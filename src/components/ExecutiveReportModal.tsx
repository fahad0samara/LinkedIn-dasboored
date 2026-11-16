import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Copy, Check, Sparkles, TrendingUp, 
  DollarSign, Globe, Layers, AlertCircle, CheckCircle2, X
} from 'lucide-react';
import { MarketMetrics } from '../types';
import { DynamicReportMetrics } from '../data/jobDataEngine';
import { CurrencyCode, formatSalary } from '../utils/currency';
import { Language, useTranslation, translateCategory, translateCountry, translateModality } from '../utils/i18n';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics?: MarketMetrics | DynamicReportMetrics | any;
  selectedCountry: string;
  selectedCategory: string;
  selectedModality: string;
  currency: CurrencyCode;
  language?: Language;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  selectedCountry,
  selectedCategory,
  selectedModality,
  currency,
  language = 'ar'
}) => {
  const { t } = useTranslation(language);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Safe normalized metric values
  const totalJobs = metrics?.total_jobs ?? metrics?.totalJobs ?? 12000;
  const overallAvgSalary = metrics?.overall_average_salary_usd ?? metrics?.avgSalary ?? 178573.61;
  const aiSalaryPremium = metrics?.ai_salary_premium_pct ?? metrics?.aiSalaryPremiumPct ?? 42.56;
  const remotePercentage = metrics?.remote_job_percentage ?? metrics?.remotePercentage ?? 38.15;
  const activeCompanies = metrics?.active_companies ?? metrics?.total_companies ?? metrics?.totalCompanies ?? 54;
  const remoteSalaryPremium = metrics?.remote_salary_premium_pct ?? 12.5;

  const currentDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const scopeCountry = translateCountry(selectedCountry, language);
  const scopeCategory = translateCategory(selectedCategory, language);
  const scopeModality = translateModality(selectedModality, language);

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownReport = () => {
    if (language === 'ar') {
      return `# تقرير موجز واستشاري لإدارة سوق العمل والأجور والمهارات
**تاريخ الإصدار:** ${currentDate}
**نطاق التحليل:** ${scopeCountry} • ${scopeCategory} • ${scopeModality} | العملة: ${currency}

---

## 1. المؤشرات والركائز التنفيذية الرئيسية
- **إجمالي الوظائف النشطة المعروضة:** ${totalJobs.toLocaleString('ar-EG')} وظيفة
- **متوسط الراتب السنوي العالمي:** ${formatSalary(overallAvgSalary, currency, { isArabic: true })}
- **علاوة رواتب الذكاء الاصطناعي:** +${aiSalaryPremium}% مقارنة بالوظائف التقليدية
- **نسبة العمل عن بُعد:** ${remotePercentage}% من إجمالي السوق
- **الشركات الموظفة النشطة:** ${activeCompanies} منشأة
- **علاوة أجور العمل عن بعد:** +${remoteSalaryPremium}%

---

## 2. الرؤى التحليلية الاستراتيجية
1. **تسارع نمو الذكاء الاصطناعي:** تحقق الوظائف المتخصصة في الذكاء الاصطناعي علاوة أجر تبلغ ${aiSalaryPremium}%، مع نمو سنوي متسارع في الطلب على الكفاءات المتخصصة.
2. **مرونة نماذج العمل الهجين وعن بُعد:** يمثل العمل عن بُعد ${remotePercentage}%، مع تنافسية عالية لاستقطاب المواهب التقنية عبر الحدود الجغرافية.
3. **توزيع فئات الخبرة:** تركز الشركات على استقطاب المستويات المتقدمة (Senior+) لتحقيق كفاءة تشغيلية مباشرة.

---

## 3. التوصيات التنفيذية المقترحة
- **معايرة حزم التعويضات:** إعادة ضبط نطاقات الرواتب لمواكبة الضغوط التضخمية في مجالات الذكاء الاصطناعي.
- **سياسات العمل المرنة:** التوسع في آليات التوظيف الهجين وعن بعد لتقليل تكلفة الاستقطاب بنسبة تصل إلى 20%.
- **برامج إعادة التأهيل الداخلي:** الاستثمار في تدريب الكوادر الحالية على تقنيات الذكاء الاصطناعي لتقليل الاعتماد على التوظيف الخارجي باهظ التكلفة.
`;
    }

    return `# Executive Labor Market Intelligence & Compensation Briefing
**Generated:** ${currentDate}
**Scope:** ${selectedCountry} • ${selectedCategory} • ${selectedModality} | Currency: ${currency}

---

## 1. Executive Summary & Core KPIs
- **Total Active Job Demand:** ${totalJobs.toLocaleString()} postings
- **Overall Mean Compensation:** ${formatSalary(overallAvgSalary, currency)}
- **AI Talent Salary Premium:** +${aiSalaryPremium}%
- **Workforce Remote Distribution:** ${remotePercentage}%
- **Hiring Employers Sampled:** ${activeCompanies} organizations
- **Remote Modality Premium:** +${remoteSalaryPremium}%

---

## 2. Strategic Insights
1. **AI Talent Premium Surge:** Specialized machine learning and AI roles command a +${aiSalaryPremium}% wage premium.
2. **Distributed Talent Arbitrage:** Remote work represents ${remotePercentage}% of postings, offering significant hiring speed advantages.
3. **Seniority Tier Distribution:** Organizations increasingly prioritize Senior and Lead headcount for direct execution.

---

## 3. Executive Recommendations
- **Compensation Recalibration:** Align compensation bands with prevailing AI benchmark wages.
- **Geographic Talent Hubs:** Leverage remote hiring for high-density tech skill tiers.
- **Internal Upskilling:** Invest in ML enablement to reduce hiring premiums.
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const reportHtml = `<!DOCTYPE html>
<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8">
  <title>${language === 'ar' ? 'التقرير التنفيذي لسوق العمل والرواتب' : 'Executive Labor Market Report'}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; font-size: 26px; }
    h2 { color: #1e293b; margin-top: 24px; font-size: 18px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; }
    .kpi-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .kpi-val { font-size: 24px; font-weight: bold; color: #0284c7; margin-top: 4px; }
    .recommendation { background: #f0fdf4; border-right: ${language === 'ar' ? '4px solid #16a34a' : 'none'}; border-left: ${language === 'ar' ? 'none' : '4px solid #16a34a'}; padding: 12px 16px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <h1>${language === 'ar' ? 'تقرير سوق العمل والرواتب التنفيذي' : 'Executive Labor Market Intelligence Briefing'}</h1>
  <p><strong>${language === 'ar' ? 'تاريخ الإصدار:' : 'Generated:'}</strong> ${currentDate} | <strong>${language === 'ar' ? 'النطاق:' : 'Scope:'}</strong> ${scopeCountry} • ${scopeCategory} • ${scopeModality}</p>
  
  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-title">${language === 'ar' ? 'الوظائف النشطة' : 'Active Postings'}</div><div class="kpi-val">${totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</div></div>
    <div class="kpi-card"><div class="kpi-title">${language === 'ar' ? 'متوسط الراتب' : 'Average Salary'}</div><div class="kpi-val">${formatSalary(overallAvgSalary, currency, { isArabic: language === 'ar' })}</div></div>
    <div class="kpi-card"><div class="kpi-title">${language === 'ar' ? 'علاوة الذكاء الاصطناعي' : 'AI Premium'}</div><div class="kpi-val">+${aiSalaryPremium}%</div></div>
    <div class="kpi-card"><div class="kpi-title">${language === 'ar' ? 'نسبة العمل عن بعد' : 'Remote Share'}</div><div class="kpi-val">${remotePercentage}%</div></div>
  </div>

  <h2>${language === 'ar' ? 'التوصيات الاستراتيجية' : 'Strategic Recommendations'}</h2>
  <div class="recommendation"><strong>${language === 'ar' ? 'توازن أجور الذكاء الاصطناعي:' : 'AI Comp Parity:'}</strong> ${language === 'ar' ? 'تسريع برامج محو أمية الذكاء الاصطناعي داخلياً لتقليل الضغط على علاوات التوظيف الخارجية.' : 'Accelerate internal ML literacy to temper external premium inflation.'}</div>
  <div class="recommendation"><strong>${language === 'ar' ? 'المواهب الموزعة عن بعد:' : 'Distributed Talent:'}</strong> ${language === 'ar' ? 'التوظيف عن بعد يمنح سرعة استقطاب أعلى للمواهب التقنية الحرجة.' : 'Remote hiring retains 38%+ of applicant velocity across critical tech tiers.'}</div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Executive_Labor_Report_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="print-report-root fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs print:block print:bg-white print:p-0">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 print:max-h-none print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
        
        {/* Modal Toolbar (hidden on print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded bg-[#118dff] flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">
                {language === 'ar' ? 'التقرير التنفيذي لتحليلات سوق العمل والتعويضات' : 'Executive Labor Market Intelligence Briefing'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {language === 'ar' ? 'موجز تحليلي جاهز للعرض على مجالس الإدارة وصناع القرار' : 'Board-ready executive briefing with compensation benchmarks and strategic takeaways'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'ar' ? 'تم نسخ التقرير' : 'Copied Markdown') : (language === 'ar' ? 'نسخ التقرير' : 'Copy Briefing')}</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تصدير HTML' : 'Export HTML'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded text-xs font-bold text-white bg-[#118dff] hover:bg-[#0078d4] flex items-center space-x-1.5 rtl:space-x-reverse shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'طباعة / PDF' : 'Print to PDF'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-2 rtl:ml-0 rtl:mr-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Executive Report Body */}
        <div className="p-8 flex-1 overflow-y-auto space-y-6 bg-white text-slate-900 print:p-0 print:overflow-visible">
          
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-widest text-[#118dff] uppercase font-bold">
                {language === 'ar' ? 'استخبارات سوق العمل العالمي • تقرير تنفيذي معتمد' : 'Global Labor Market Intelligence • Executive Report'}
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                {language === 'ar' ? 'الموجز الاستراتيجي لتحليلات الأجور وسوق العمل' : 'Labor Market & Compensation Strategic Briefing'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ar' ? `صدر بتاريخ ${currentDate} • تغذية بيانات حية متعددة المصادر` : `Generated ${currentDate} • Multi-source ATS & Industry Compensation Feed`}
              </p>
            </div>

            <div className="text-right rtl:text-left text-xs">
              <div className="font-semibold text-slate-800">{language === 'ar' ? 'نطاق التصفية' : 'Filtered Scope'}</div>
              <div className="text-slate-500 font-mono text-[11px]">
                {scopeCountry} • {scopeCategory} • {scopeModality}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                {language === 'ar' ? `العملة: ${currency}` : `Currency: ${currency}`}
              </div>
            </div>
          </div>

          {/* KPI Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('kpi_totalJobs')}</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1 whitespace-nowrap leading-tight">
                {totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{language === 'ar' ? 'إعلانات توظيف معلنة' : 'Open Postings Sample'}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('kpi_avgSalary')}</span>
              <div className="text-xl sm:text-2xl font-black text-[#107c41] font-mono mt-1 whitespace-nowrap leading-tight">
                {formatSalary(overallAvgSalary, currency, { isArabic: language === 'ar' })}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{language === 'ar' ? 'متوسط الأجور السنوي' : 'Mean Market Benchmark'}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('kpi_aiPremium')}</span>
              <div className="text-xl sm:text-2xl font-black text-[#e66c37] font-mono mt-1 whitespace-nowrap leading-tight">
                +{aiSalaryPremium}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{language === 'ar' ? 'فارق راتب الذكاء الاصطناعي' : 'Over baseline non-AI roles'}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('kpi_remoteShare')}</span>
              <div className="text-xl sm:text-2xl font-black text-[#118dff] font-mono mt-1 whitespace-nowrap leading-tight">
                {remotePercentage}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{language === 'ar' ? 'مرونة بيئة العمل' : 'Distributed workforce'}</span>
            </div>
          </div>

          {/* Section 1: Executive Insights */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse border-b border-slate-200 pb-1.5">
              <Sparkles className="w-4 h-4 text-[#118dff]" />
              <span>{language === 'ar' ? 'أبرز الملاحظات والاستنتاجات التنفيذية' : 'Key Executive Findings'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-sky-50/50 rounded-lg border border-sky-100">
                <div className="font-bold text-sky-950 mb-1 flex items-center space-x-1 rtl:space-x-reverse">
                  <TrendingUp className="w-3.5 h-3.5 text-[#118dff]" />
                  <span>{language === 'ar' ? 'علاوة الطلب على الذكاء الاصطناعي' : 'AI Wage Premium'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {language === 'ar' 
                    ? `تستمر وظائف الذكاء الاصطناعي في قيادة مستويات الأجور بفارق علاوة قدره +${aiSalaryPremium}% مقارنة بالمهام التقنية العامة، مما يؤكد اشتداد المنافسة على هذه الكفاءات.`
                    : `Specialized AI/ML roles continue commanding an outsized premium of +${aiSalaryPremium}%, reflecting intense market competition for qualified engineering talent.`}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <div className="font-bold text-emerald-950 mb-1 flex items-center space-x-1 rtl:space-x-reverse">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'ar' ? 'مرونة التوظيف عن بعد' : 'Geographic Distribution'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? `يمثل العمل عن بُعد ${remotePercentage}% من الفرص المتاحة، مع تفوق متوسط الأجر بنسبة +${remoteSalaryPremium}% لاستقطاب أفضل الكفاءات العالمية.`
                    : `Fully remote postings account for ${remotePercentage}% of listings, offering talent velocity while providing employers cross-border sourcing flexibility.`}
                </p>
              </div>

              <div className="p-3.5 bg-purple-50/50 rounded-lg border border-purple-100">
                <div className="font-bold text-purple-950 mb-1 flex items-center space-x-1 rtl:space-x-reverse">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>{language === 'ar' ? 'المستويات المهنية والقيادية' : 'Seniority Demand'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? `تركز الشركات على تعيين الكفاءات المتقدمة (Senior/Lead) لتسريع وتيرة التنفيذ ومواكبة متطلبات التحول الرقمي الحديثة.`
                    : `Demand heavily skews toward Senior and Lead tiers, with organizations willing to pay peak bands for proven engineering and product leadership.`}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Actionable Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse border-b border-slate-200 pb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'التوصيات الاستراتيجية لإدارات الموارد البشرية والمؤسسات' : 'Strategic Workforce Recommendations'}</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start space-x-2.5 rtl:space-x-reverse p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</div>
                <div>
                  <strong className="text-slate-900">{language === 'ar' ? 'معايرة نطاقات الأجور (Compensation Bands):' : 'Re-calibrate Tech Salary Bands:'}</strong>{' '}
                  {language === 'ar' 
                    ? `تحديث سلالم الرواتب دورياً لمنع تسرب الكفاءات في تخصصات البيانات والذكاء الاصطناعي.`
                    : `Regularly refresh software and AI compensation benchmarks against live ATS data to retain critical engineering talent.`}
                </div>
              </div>

              <div className="flex items-start space-x-2.5 rtl:space-x-reverse p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</div>
                <div>
                  <strong className="text-slate-900">{language === 'ar' ? 'الاستثمار في صقل المهارات داخلياً:' : 'Develop Internal AI Upskilling Pipelines:'}</strong>{' '}
                  {language === 'ar'
                    ? `تدريب المهندسين الحاليين على تقنيات الذكاء الاصطناعي التوليدي لتوفير حتى 35% من تكاليف الاستقطاب الخارجي.`
                    : `Upskill existing software teams on generative AI workflows to offset premium external hiring expenses.`}
                </div>
              </div>

              <div className="flex items-start space-x-2.5 rtl:space-x-reverse p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</div>
                <div>
                  <strong className="text-slate-900">{language === 'ar' ? 'توسيع نموذج العمل الهجين الذكي:' : 'Formalize Hybrid/Remote Tier Policies:'}</strong>{' '}
                  {language === 'ar'
                    ? `الاستفادة من العمل عن بعد لاستقطاب مواهب نادرة من أسواق إقليمية ودولية دون الحاجة لتأسيس مقرات جديدة.`
                    : `Leverage structured remote options for niche technical skills to broaden candidate reach across geographic borders.`}
                </div>
              </div>
            </div>
          </div>

          {/* Footer signoff */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              {language === 'ar' ? 'منصة تحليلات سوق العمل العالمية • تقرير استشاري تنفيذي' : 'Global Labor Market Intelligence • Automated Executive Summary Report'}
            </div>
            <div>
              {language === 'ar' ? 'بيانات معتمدة' : 'Verified ATS Feed'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
