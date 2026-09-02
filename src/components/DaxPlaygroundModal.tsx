import React, { useState, useMemo } from 'react';
import { 
  Calculator, Sparkles, Play, Plus, Trash2, CheckCircle2, 
  HelpCircle, Code2, Copy, Check, BarChart2, X, ArrowRight, Bookmark
} from 'lucide-react';
import { JobRecord } from '../types';
import { getActiveJobRecords } from '../data/jobDataEngine';
import { CurrencyCode, formatSalary } from '../utils/currency';
import { Language, useTranslation, translateCategory, translateModality } from '../utils/i18n';

export interface CustomMetric {
  id: string;
  name: string;
  daxFormula: string;
  category: string;
  resultFormatted: string;
  resultNumeric: number;
  formatType: 'currency' | 'percentage' | 'number' | 'ratio';
  explanation: string;
}

interface DaxPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onPinMetric?: (metric: CustomMetric) => void;
  language?: Language | string;
}

interface TemplateFormula {
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  dax: string;
  formatType: 'currency' | 'percentage' | 'number' | 'ratio';
  compute: (records: JobRecord[], currency: CurrencyCode, language?: Language | string) => { value: number; formatted: string; explanation: string };
}

const TEMPLATE_FORMULAS: TemplateFormula[] = [
  {
    name: '90th Percentile Executive Salary',
    nameAr: 'الشريحة المئوية 90 لرواتب الإدارة التنفيذية',
    category: 'Compensation',
    categoryAr: 'الأجور والتعويضات',
    dax: `Salary 90th Percentile = \nPERCENTILE.EXC('FactJobs'[Salary_Avg_USD], 0.90)`,
    formatType: 'currency',
    compute: (records, curr, lang) => {
      const salaries = records.map(r => r.Salary_Avg_USD || 0).filter(s => s > 0).sort((a, b) => a - b);
      if (salaries.length === 0) return { value: 0, formatted: '$0', explanation: lang === 'ar' ? 'لا توجد سجلات رواتب' : 'No salary records available' };
      const idx = Math.floor(salaries.length * 0.90);
      const val = salaries[idx];
      return {
        value: val,
        formatted: formatSalary(val, curr, { isArabic: lang === 'ar' }),
        explanation: lang === 'ar' 
          ? `عتبة أعلى 10% من السوق عبر ${salaries.length.toLocaleString('ar-EG')} إعلان مفصح عن راتبه.`
          : `Top 10% market threshold across ${salaries.length.toLocaleString()} salary-disclosed postings.`
      };
    }
  },
  {
    name: 'Remote-to-Onsite Hiring Velocity Ratio',
    nameAr: 'نسبة سرعة التوظيف عن بُعد مقارنة بالحضوري',
    category: 'Workforce Modality',
    categoryAr: 'أنماط بيئة العمل',
    dax: `Remote vs Onsite Ratio = \nVAR RemoteJobs = CALCULATE(COUNTROWS('FactJobs'), 'FactJobs'[Workplace_Modality] = "Remote")\nVAR OnsiteJobs = CALCULATE(COUNTROWS('FactJobs'), 'FactJobs'[Workplace_Modality] = "On-site")\nRETURN DIVIDE(RemoteJobs, OnsiteJobs, 0)`,
    formatType: 'ratio',
    compute: (records, _curr, lang) => {
      const rem = records.filter(r => r.Workplace_Modality === 'Remote' || r.Is_Remote === 'Yes').length;
      const on = records.filter(r => r.Workplace_Modality === 'On-site').length || 1;
      const ratio = Number((rem / on).toFixed(2));
      return {
        value: ratio,
        formatted: `${ratio}x`,
        explanation: lang === 'ar' 
          ? `مقابل كل وظيفة حضورية واحدة، يوجد ${ratio} وظيفة عن بعد بالكامل.`
          : `For every 1 on-site job posted, there are ${ratio} fully remote postings.`
      };
    }
  },
  {
    name: 'Tech & AI Market Share %',
    nameAr: 'الحصة السوقية لقطاع التقنية والذكاء الاصطناعي',
    category: 'Talent Density',
    categoryAr: 'كثافة المواهب',
    dax: `Tech & AI Share % = \nVAR HighTechJobs = CALCULATE(COUNTROWS('FactJobs'), 'FactJobs'[Job_Category] IN {"Technology", "Data & AI"})\nVAR AllJobs = COUNTROWS('FactJobs')\nRETURN DIVIDE(HighTechJobs, AllJobs, 0)`,
    formatType: 'percentage',
    compute: (records, _curr, lang) => {
      const total = records.length || 1;
      const tech = records.filter(r => r.Job_Category === 'Technology' || r.Job_Category === 'Data & AI').length;
      const pct = Number(((tech / total) * 100).toFixed(1));
      return {
        value: pct,
        formatted: `${pct}%`,
        explanation: lang === 'ar' 
          ? `يمثل قطاع التقنية والذكاء الاصطناعي ${pct}% من إجمالي الطلب في السوق النشط.`
          : `Technology and AI represent ${pct}% of total active market demand.`
      };
    }
  },
  {
    name: 'Senior Leadership Concentration (Lead+)',
    nameAr: 'نسبة تركيز القيادات العليا والإدارة (Lead+)',
    category: 'Seniority Tiers',
    categoryAr: 'المستويات الوظيفية',
    dax: `Senior+ Leadership % = \nVAR LeadPlus = CALCULATE(COUNTROWS('FactJobs'), 'FactJobs'[Seniority] IN {"Lead", "Manager", "Director", "Executive"})\nRETURN DIVIDE(LeadPlus, COUNTROWS('FactJobs'), 0)`,
    formatType: 'percentage',
    compute: (records, _curr, lang) => {
      const total = records.length || 1;
      const leads = records.filter(r => ['Lead', 'Manager', 'Director', 'Executive'].includes(r.Seniority)).length;
      const pct = Number(((leads / total) * 100).toFixed(1));
      return {
        value: pct,
        formatted: `${pct}%`,
        explanation: lang === 'ar' 
          ? `${pct}% من إجمالي الوظائف المفتوحة تتطلب كفاءات قيادية أو إدارية متقدمة.`
          : `${pct}% of all open postings require senior leadership or management capabilities.`
      };
    }
  },
  {
    name: 'Annual Compensation Run Rate (Sum)',
    nameAr: 'المعدل السنوي الإجمالي لكتلة الرواتب المعروضة',
    category: 'Financial Run Rate',
    categoryAr: 'المعايير المالية',
    dax: `Total Market Payroll Run Rate = \nSUMX('FactJobs', 'FactJobs'[Salary_Avg_USD])`,
    formatType: 'currency',
    compute: (records, curr, lang) => {
      const sum = records.reduce((acc, r) => acc + (r.Salary_Avg_USD || 0), 0);
      return {
        value: sum,
        formatted: formatSalary(sum, curr, { compact: true, isArabic: lang === 'ar' }),
        explanation: lang === 'ar' 
          ? `إجمالي حجم الإنفاق السنوي المتوقع على الرواتب للوظائف المفتوحة.`
          : `Aggregate annual annualized compensation expenditure across active market demand.`
      };
    }
  }
];

export const DaxPlaygroundModal: React.FC<DaxPlaygroundModalProps> = ({
  isOpen,
  onClose,
  currency,
  onPinMetric,
  language = 'ar'
}) => {
  const { t } = useTranslation(language);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [customName, setCustomName] = useState<string>(language === 'ar' ? 'مقياس مخصص لمعدل الطلب' : 'Custom In-Demand Ratio');
  const [customAggregation, setCustomAggregation] = useState<'AVERAGE' | 'MEDIAN' | 'COUNT' | 'PERCENTILE_75' | 'PERCENTILE_90' | 'SUM'>('AVERAGE');
  const [customField, setCustomField] = useState<'Salary_Avg_USD' | 'Skill_Count' | 'Job_ID'>('Salary_Avg_USD');
  const [customFilterModality, setCustomFilterModality] = useState<string>('All');
  const [customFilterCategory, setCustomFilterCategory] = useState<string>('All');
  const [customFilterAI, setCustomFilterAI] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'templates' | 'builder'>('templates');
  const [copied, setCopied] = useState<boolean>(false);
  const [pinnedSuccess, setPinnedSuccess] = useState<string | null>(null);

  const activeRecords = useMemo(() => getActiveJobRecords(), [isOpen]);

  // Compute selected template
  const currentTemplate = TEMPLATE_FORMULAS[selectedTemplateIndex];
  const templateResult = useMemo(() => {
    return currentTemplate.compute(activeRecords, currency, language);
  }, [currentTemplate, activeRecords, currency, language]);

  // Compute custom builder
  const builderResult = useMemo(() => {
    let subset = activeRecords;
    if (customFilterModality !== 'All') {
      subset = subset.filter(r => r.Workplace_Modality === customFilterModality);
    }
    if (customFilterCategory !== 'All') {
      subset = subset.filter(r => r.Job_Category === customFilterCategory);
    }
    if (customFilterAI !== 'All') {
      subset = subset.filter(r => customFilterAI === 'Yes' ? (r.Is_AI_Job === 'Yes') : (r.Is_AI_Job !== 'Yes'));
    }

    if (subset.length === 0) {
      return { value: 0, formatted: '0', dax: '', explanation: language === 'ar' ? 'لا توجد سجلات تطابق الفلتر' : 'No records matched filter criteria' };
    }

    let val = 0;
    let formatted = '';
    let isCurrency = customField === 'Salary_Avg_USD';

    if (customAggregation === 'COUNT') {
      val = subset.length;
      formatted = val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    } else if (customAggregation === 'SUM') {
      val = subset.reduce((a, b) => a + (b[customField] as number || 0), 0);
      formatted = isCurrency ? formatSalary(val, currency, { compact: true, isArabic: language === 'ar' }) : val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    } else if (customAggregation === 'AVERAGE') {
      const sum = subset.reduce((a, b) => a + (b[customField] as number || 0), 0);
      val = Math.round(sum / subset.length);
      formatted = isCurrency ? formatSalary(val, currency, { isArabic: language === 'ar' }) : val.toFixed(1);
    } else if (customAggregation === 'MEDIAN') {
      const sorted = subset.map(r => r[customField] as number || 0).sort((a, b) => a - b);
      val = sorted[Math.floor(sorted.length / 2)];
      formatted = isCurrency ? formatSalary(val, currency, { isArabic: language === 'ar' }) : val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    } else if (customAggregation === 'PERCENTILE_75') {
      const sorted = subset.map(r => r[customField] as number || 0).sort((a, b) => a - b);
      val = sorted[Math.floor(sorted.length * 0.75)];
      formatted = isCurrency ? formatSalary(val, currency, { isArabic: language === 'ar' }) : val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    } else if (customAggregation === 'PERCENTILE_90') {
      const sorted = subset.map(r => r[customField] as number || 0).sort((a, b) => a - b);
      val = sorted[Math.floor(sorted.length * 0.90)];
      formatted = isCurrency ? formatSalary(val, currency, { isArabic: language === 'ar' }) : val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
    }

    const filterDaxClauses: string[] = [];
    if (customFilterModality !== 'All') filterDaxClauses.push(`'FactJobs'[Workplace_Modality] = "${customFilterModality}"`);
    if (customFilterCategory !== 'All') filterDaxClauses.push(`'FactJobs'[Job_Category] = "${customFilterCategory}"`);
    if (customFilterAI !== 'All') filterDaxClauses.push(`'FactJobs'[Is_AI_Job] = "${customFilterAI}"`);

    const filterDax = filterDaxClauses.length > 0 ? `, ${filterDaxClauses.join(', ')}` : '';
    const generatedDax = `${customName.replace(/\s+/g, '_')} = \nCALCULATE(\n    ${customAggregation}('FactJobs'[${customField}])${filterDax}\n)`;

    return {
      value: val,
      formatted,
      dax: generatedDax,
      explanation: language === 'ar' 
        ? `محسوب عبر ${subset.length.toLocaleString('ar-EG')} سجل مطابق في قاعدة البيانات النشطة.`
        : `Calculated over ${subset.length.toLocaleString()} matching records in active dataset.`
    };
  }, [activeRecords, customAggregation, customField, customFilterModality, customFilterCategory, customFilterAI, customName, currency, language]);

  if (!isOpen) return null;

  const handleCopyDax = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePinCurrent = () => {
    if (!onPinMetric) return;

    if (activeTab === 'templates') {
      const displayName = language === 'ar' ? currentTemplate.nameAr : currentTemplate.name;
      onPinMetric({
        id: `dax_${Date.now()}`,
        name: displayName,
        daxFormula: currentTemplate.dax,
        category: language === 'ar' ? currentTemplate.categoryAr : currentTemplate.category,
        resultFormatted: templateResult.formatted,
        resultNumeric: templateResult.value,
        formatType: currentTemplate.formatType,
        explanation: templateResult.explanation
      });
      setPinnedSuccess(language === 'ar' ? `تم تثبيت "${displayName}" في شريط المؤشرات الرئيسي!` : `Pinned "${displayName}" to your active KPI ribbon!`);
    } else {
      onPinMetric({
        id: `dax_${Date.now()}`,
        name: customName,
        daxFormula: builderResult.dax,
        category: language === 'ar' ? 'مقياس مخصص' : 'Custom Metric',
        resultFormatted: builderResult.formatted,
        resultNumeric: builderResult.value,
        formatType: customField === 'Salary_Avg_USD' ? 'currency' : 'number',
        explanation: builderResult.explanation
      });
      setPinnedSuccess(language === 'ar' ? `تم تثبيت "${customName}" في شريط المؤشرات الرئيسي!` : `Pinned "${customName}" to your active KPI ribbon!`);
    }

    setTimeout(() => setPinnedSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded bg-[#118dff]/20 border border-[#118dff]/40 flex items-center justify-center text-[#118dff]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {language === 'ar' ? 'بيئة كتابة معادلات ومقاييس DAX التفاعلية' : 'Power BI DAX Formula Playground'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'محاكاة كاملة لمحرك DAX Analysis Services مع إمكانية التثبيت المباشر للوحة القيادة' : 'Test, write, and compute dynamic DAX analytical measures on active dataset'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-100 px-5 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-white text-[#118dff] shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نماذج وصيغ DAX الجاهزة' : 'DAX Formula Library'}</span>
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
                activeTab === 'builder'
                  ? 'bg-white text-[#118dff] shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'منشئ المقاييس المخصصة' : 'Interactive Measure Builder'}</span>
            </button>
          </div>

          {pinnedSuccess && (
            <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center space-x-1 rtl:space-x-reverse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{pinnedSuccess}</span>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'templates' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Template selector list */}
              <div className="md:col-span-5 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {language === 'ar' ? 'اختر معادلة DAX' : 'Select DAX Measure'}
                </label>
                <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
                  {TEMPLATE_FORMULAS.map((item, idx) => (
                    <div
                      key={item.name}
                      onClick={() => setSelectedTemplateIndex(idx)}
                      className={`p-2.5 rounded-[4px] border text-xs cursor-pointer transition-colors ${
                        selectedTemplateIndex === idx
                          ? 'bg-sky-50/80 border-[#118dff] text-slate-900 font-semibold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate pr-1 rtl:pr-0 rtl:pl-1">{language === 'ar' ? item.nameAr : item.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                          {language === 'ar' ? item.categoryAr : item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formula code & preview */}
              <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {language === 'ar' ? 'صيغة DAX البرمجية' : 'DAX Expression'}
                    </span>
                    <button
                      onClick={() => handleCopyDax(currentTemplate.dax)}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 rtl:space-x-reverse bg-slate-100 px-2 py-0.5 rounded border border-slate-200 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ الكود' : 'Copy')}</span>
                    </button>
                  </div>

                  <div className="bg-[#1e1e1e] text-emerald-400 font-mono text-xs p-3.5 rounded-[4px] border border-slate-800 leading-relaxed overflow-x-auto select-all">
                    <pre className="whitespace-pre-wrap">{currentTemplate.dax}</pre>
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="bg-slate-50 p-3.5 rounded-[4px] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {language === 'ar' ? 'النتيجة المحسوبة فورياً' : 'Calculated Value'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeRecords.length.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {language === 'ar' ? 'سجل' : 'rows evaluated'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#118dff]">
                    {templateResult.formatted}
                  </div>
                  <p className="text-xs text-slate-600">
                    {templateResult.explanation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Builder Tab */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'ar' ? 'اسم المقياس' : 'Measure Name'}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-hidden focus:border-[#118dff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'ar' ? 'دالة التجميع (DAX Aggregation)' : 'Aggregation Function'}
                  </label>
                  <select
                    value={customAggregation}
                    onChange={(e: any) => setCustomAggregation(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-hidden"
                  >
                    <option value="AVERAGE">AVERAGE (المتوسط الحسابي)</option>
                    <option value="MEDIAN">MEDIAN (الوسيط الإحصائي)</option>
                    <option value="COUNT">COUNT (عدد الوظائف)</option>
                    <option value="PERCENTILE_75">PERCENTILE.EXC (الشريحة 75%)</option>
                    <option value="PERCENTILE_90">PERCENTILE.EXC (الشريحة 90%)</option>
                    <option value="SUM">SUM (المجموع الإجمالي)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'ar' ? 'الحقل المستهدف' : 'Target Field'}
                  </label>
                  <select
                    value={customField}
                    onChange={(e: any) => setCustomField(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-hidden"
                  >
                    <option value="Salary_Avg_USD">{language === 'ar' ? 'متوسط الراتب السنوي (USD)' : 'Salary_Avg_USD (Annual Pay)'}</option>
                    <option value="Skill_Count">{language === 'ar' ? 'عدد المهارات المطلوبة' : 'Skill_Count (Skills per Job)'}</option>
                  </select>
                </div>
              </div>

              {/* Slicer filters */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  {language === 'ar' ? 'شروط التصفية DAX (Filter Context Clauses)' : 'DAX Filter Context (CALCULATE Conditions)'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">{t('slicerModality')}</label>
                    <select
                      value={customFilterModality}
                      onChange={(e) => setCustomFilterModality(e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded"
                    >
                      <option value="All">{t('allModalities')}</option>
                      <option value="Remote">{t('mod_remote')}</option>
                      <option value="Hybrid">{t('mod_hybrid')}</option>
                      <option value="On-site">{t('mod_onsite')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">{t('slicerCategory')}</label>
                    <select
                      value={customFilterCategory}
                      onChange={(e) => setCustomFilterCategory(e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded"
                    >
                      <option value="All">{t('allCategories')}</option>
                      <option value="Technology">{translateCategory('Technology', language)}</option>
                      <option value="Data & AI">{translateCategory('Data & AI', language)}</option>
                      <option value="Finance">{translateCategory('Finance', language)}</option>
                      <option value="Healthcare">{translateCategory('Healthcare', language)}</option>
                      <option value="Marketing">{translateCategory('Marketing', language)}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">{t('slicerAI')}</label>
                    <select
                      value={customFilterAI}
                      onChange={(e) => setCustomFilterAI(e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded"
                    >
                      <option value="All">{t('allRoles')}</option>
                      <option value="Yes">{language === 'ar' ? 'وظائف الذكاء الاصطناعي فقط' : 'AI Only'}</option>
                      <option value="No">{language === 'ar' ? 'وظائف عامة فقط' : 'Non-AI Only'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Code output & result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#1e1e1e] text-emerald-400 font-mono text-xs p-3 rounded border border-slate-800">
                  <pre className="whitespace-pre-wrap">{builderResult.dax}</pre>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold uppercase">{language === 'ar' ? 'النتيجة الفورية' : 'Live Result'}</span>
                    <div className="text-2xl font-bold font-mono text-[#118dff] mt-1">{builderResult.formatted}</div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{builderResult.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {language === 'ar' ? 'المقاييس المثبتة ستظهر فورياً في اللوحة الرئيسية' : 'Pinned measures appear in the top ribbon and update dynamically'}
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>

            {onPinMetric && (
              <button
                onClick={handlePinCurrent}
                className="px-3.5 py-1.5 rounded bg-[#118dff] hover:bg-[#0078d4] text-white text-xs font-semibold flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-2xs cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تثبيت في اللوحة الرئيسية' : 'Pin to Dashboard KPI Ribbon'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
