import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download, 
  Filter, 
  Building2, 
  Globe2, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  ArrowUpDown,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Tag
} from 'lucide-react';
import { JobRecord } from '../types';
import { evaluateDaxFilterEngine } from '../data/jobDataEngine';
import { CurrencyCode, formatSalary } from '../utils/currency';
import { Language, useTranslation, translateCategory, translateCountry, translateSeniority, translateModality } from '../utils/i18n';

export interface DrillThroughTarget {
  type: 'category' | 'country' | 'modality' | 'seniority' | 'skill' | 'ai' | 'cross' | 'custom';
  title: string;
  category?: string;
  country?: string;
  modality?: string;
  seniority?: string;
  skill?: string;
  ai?: string;
  color?: string;
  subtitle?: string;
}

interface DrillThroughOverlayProps {
  target: DrillThroughTarget | null;
  onClose: () => void;
  onApplyAsSlicer?: (filterKey: 'category' | 'country' | 'modality' | 'seniority' | 'ai', value: string) => void;
  globalFilters: {
    country: string;
    category: string;
    modality: string;
    ai: string;
    seniority: string;
  };
  currency?: CurrencyCode;
  language?: Language;
}

export const DrillThroughOverlay: React.FC<DrillThroughOverlayProps> = ({
  target,
  onClose,
  onApplyAsSlicer,
  globalFilters,
  currency = 'USD',
  language = 'ar',
}) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'jobs' | 'employers' | 'skills' | 'seniority'>('jobs');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalityFilter, setModalityFilter] = useState<string>('All');
  const [seniorityFilter, setSeniorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'salary-desc' | 'salary-asc' | 'date-desc' | 'title-asc'>('salary-desc');
  const [page, setPage] = useState<number>(1);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobRecord | null>(null);
  const itemsPerPage = 8;

  // Handle ESC key to dismiss overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedJobDetail) {
          setSelectedJobDetail(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedJobDetail]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, modalityFilter, seniorityFilter, sortBy, target]);

  // Calculate the drillthrough context data using the DAX evaluation engine
  const drillMetrics = useMemo(() => {
    if (!target) return null;

    const catParam = target.category || (target.type === 'category' ? target.title : globalFilters.category);
    const cntryParam = target.country || (target.type === 'country' ? target.title : globalFilters.country);
    const modParam = target.modality || (target.type === 'modality' ? target.title : globalFilters.modality);
    const aiParam = target.ai || (target.type === 'ai' ? (target.title.includes('AI') ? 'Yes' : 'No') : globalFilters.ai);
    const senParam = target.seniority || (target.type === 'seniority' ? target.title : globalFilters.seniority);

    return evaluateDaxFilterEngine({
      category: catParam,
      country: cntryParam,
      modality: modParam,
      ai: aiParam,
      seniority: senParam,
      search: target.skill ? target.skill : ''
    });
  }, [target, globalFilters]);

  // Filter and sort the microdata rows
  const filteredRows = useMemo(() => {
    if (!drillMetrics) return [];
    let rows = [...drillMetrics.matchingRecords];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter(r => 
        r.Job_Title.toLowerCase().includes(q) ||
        r.Company.toLowerCase().includes(q) ||
        r.Location.toLowerCase().includes(q) ||
        r.Skills_List.toLowerCase().includes(q)
      );
    }

    if (modalityFilter !== 'All') {
      rows = rows.filter(r => r.Workplace_Modality === modalityFilter);
    }

    if (seniorityFilter !== 'All') {
      rows = rows.filter(r => r.Seniority === seniorityFilter);
    }

    rows.sort((a, b) => {
      if (sortBy === 'salary-desc') return (b.Salary_Avg_USD || 0) - (a.Salary_Avg_USD || 0);
      if (sortBy === 'salary-asc') return (a.Salary_Avg_USD || 0) - (b.Salary_Avg_USD || 0);
      if (sortBy === 'date-desc') return new Date(b.Date_Posted).getTime() - new Date(a.Date_Posted).getTime();
      if (sortBy === 'title-asc') return a.Job_Title.localeCompare(b.Job_Title);
      return 0;
    });

    return rows;
  }, [drillMetrics, searchTerm, modalityFilter, seniorityFilter, sortBy]);

  // Top hiring employers in this drill scope
  const employerBreakdown = useMemo(() => {
    if (!filteredRows.length) return [];
    const map: Record<string, { count: number; salaries: number[]; locations: Set<string>; isAi: number }> = {};
    filteredRows.forEach(j => {
      if (!map[j.Company]) {
        map[j.Company] = { count: 0, salaries: [], locations: new Set(), isAi: 0 };
      }
      map[j.Company].count += 1;
      if (j.Salary_Avg_USD) map[j.Company].salaries.push(j.Salary_Avg_USD);
      map[j.Company].locations.add(j.Location);
      if (j.Is_AI_Job === 'Yes') map[j.Company].isAi += 1;
    });

    return Object.entries(map).map(([company, data]) => {
      const avgSal = data.salaries.length 
        ? Math.round(data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length)
        : 160000;
      return {
        company,
        postings: data.count,
        avgSalary: avgSal,
        locationsCount: data.locations.size,
        aiRoles: data.isAi,
        pct: Number(((data.count / filteredRows.length) * 100).toFixed(1))
      };
    }).sort((a, b) => b.postings - a.postings);
  }, [filteredRows]);

  // Top skills in this drill scope
  const topSkillsBreakdown = useMemo(() => {
    if (!filteredRows.length) return [];
    const skillMap: Record<string, number> = {};
    filteredRows.forEach(j => {
      j.Skills_List.split(',').map(s => s.trim()).forEach(skill => {
        if (skill) {
          skillMap[skill] = (skillMap[skill] || 0) + 1;
        }
      });
    });

    return Object.entries(skillMap).map(([skill, count]) => ({
      skill,
      count,
      pct: Number(((count / filteredRows.length) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count).slice(0, 16);
  }, [filteredRows]);

  // Seniority breakdown in this drill scope
  const seniorityBreakdown = useMemo(() => {
    if (!filteredRows.length) return [];
    const senMap: Record<string, { count: number; sumSal: number }> = {};
    filteredRows.forEach(j => {
      if (!senMap[j.Seniority]) senMap[j.Seniority] = { count: 0, sumSal: 0 };
      senMap[j.Seniority].count += 1;
      senMap[j.Seniority].sumSal += j.Salary_Avg_USD || 160000;
    });

    return Object.entries(senMap).map(([level, d]) => ({
      level,
      displayName: translateSeniority(level, language),
      count: d.count,
      pct: Number(((d.count / filteredRows.length) * 100).toFixed(1)),
      avgSalary: Math.round(d.sumSal / d.count)
    })).sort((a, b) => b.count - a.count);
  }, [filteredRows, language]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, page]);

  if (!target || !drillMetrics) return null;

  const handleExportCsv = () => {
    const headers = "Job_ID,Job_Title,Company,Job_Category,Seniority,Workplace_Modality,Is_Remote,Is_AI_Job,Country,Location,Date_Posted,Salary_Avg_USD,Skills_List\n";
    const rows = filteredRows.map(j => 
      `"${j.Job_ID}","${j.Job_Title}","${j.Company}","${j.Job_Category}","${j.Seniority}","${j.Workplace_Modality}","${j.Is_Remote}","${j.Is_AI_Job}","${j.Country}","${j.Location}","${j.Date_Posted}",${j.Salary_Avg_USD || 0},"${j.Skills_List}"`
    ).join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `PowerBI_DrillThrough_${target.type}_${target.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCommitSlicer = () => {
    if (!onApplyAsSlicer) return;
    if (target.type === 'category') {
      onApplyAsSlicer('category', target.category || target.title);
    } else if (target.type === 'country') {
      onApplyAsSlicer('country', target.country || target.title);
    } else if (target.type === 'modality') {
      onApplyAsSlicer('modality', target.modality || target.title);
    } else if (target.type === 'seniority') {
      onApplyAsSlicer('seniority', target.seniority || target.title);
    } else if (target.type === 'ai') {
      onApplyAsSlicer('ai', target.ai || (target.title.includes('AI') ? 'Yes' : 'No'));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Power BI Drillthrough Modal Container */}
      <div 
        className="bg-white w-full max-w-6xl max-h-[92vh] rounded-[4px] shadow-2xl border border-slate-300 flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* TOP BAR: POWER BI DRILL-THROUGH HEADER */}
        {/* ========================================================================= */}
        <div className="bg-[#1e293b] text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={onClose}
              className="p-1.5 rounded-[3px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold cursor-pointer"
              title={language === 'ar' ? 'العودة للوحة التقرير (Esc)' : 'Return to Report Canvas (Esc)'}
            >
              <ChevronLeft className="w-4 h-4 text-[#118dff] rtl:rotate-180" />
              <span className="hidden sm:inline">{language === 'ar' ? 'العودة للتقرير' : 'Back to Report'}</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="p-1 bg-[#118dff]/20 text-[#118dff] rounded border border-[#118dff]/40">
                {target.type === 'category' ? <Briefcase className="w-4 h-4" /> :
                 target.type === 'country' ? <Globe2 className="w-4 h-4" /> :
                 target.type === 'modality' ? <Layers className="w-4 h-4" /> :
                 target.type === 'skill' ? <Tag className="w-4 h-4" /> :
                 <Sparkles className="w-4 h-4" />}
              </span>

              <div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    {language === 'ar' ? 'مستوى التعمق التفصيلي Power BI' : 'Power BI Drill-Through Target'}
                  </span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.2 rounded font-semibold">
                    {target.type.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2 rtl:space-x-reverse">
                  <span>{target.title}</span>
                  {target.country && target.type !== 'country' && (
                    <span className="text-xs font-normal text-slate-400">
                      {language === 'ar' ? `في ${translateCountry(target.country, language)}` : `in ${target.country}`}
                    </span>
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse self-end sm:self-auto">
            {onApplyAsSlicer && (
              <button
                onClick={handleCommitSlicer}
                className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-[3px] bg-[#118dff] hover:bg-[#0078d4] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                title={language === 'ar' ? 'تطبيق كعنصر تصفية عام وإغلاق' : 'Apply as active global slicer and close'}
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{language === 'ar' ? 'تثبيت كعنصر تصفية' : 'Pin as Slicer'}</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-[3px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
              title={language === 'ar' ? 'تصدير السجلات المصفاة كملف CSV' : 'Export filtered records to CSV'}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'تصدير CSV' : 'Export CSV'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[3px] bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title={language === 'ar' ? 'إغلاق (Esc)' : 'Close (Esc)'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KPI RIBBON FOR DRILLED SCOPE */}
        {/* ========================================================================= */}
        <div className="bg-[#f8fafc] border-b border-slate-200 p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="bg-white p-2.5 rounded-[3px] border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{language === 'ar' ? 'الوظائف المطابقة' : 'Drilled Postings'}</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {drillMetrics.totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
            </div>
            <div className="text-[10px] text-sky-700 font-medium">
              {language === 'ar' ? `${drillMetrics.matchingRecords.length} سجل مطابق` : `${drillMetrics.matchingRecords.length} Matching Postings`}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-[3px] border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{t('kpi_avgSalary')}</div>
            <div className="text-base font-bold font-mono text-[#107c41] mt-0.5">
              {formatSalary(drillMetrics.avgSalary, currency, { compact: true, isArabic: language === 'ar' })}
            </div>
            <div className="text-[10px] text-slate-500">
              {language === 'ar' ? `الوسيط: ${formatSalary(drillMetrics.medianSalary, currency, { compact: true, isArabic: language === 'ar' })}` : `Median: ${formatSalary(drillMetrics.medianSalary, currency, { compact: true })}`}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-[3px] border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{t('mod_remote')} %</div>
            <div className="text-base font-bold font-mono text-[#118dff] mt-0.5">
              {drillMetrics.remotePercentage}%
            </div>
            <div className="text-[10px] text-slate-500">
              {drillMetrics.remoteJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {t('mod_remote')}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-[3px] border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{t('slicerAI')} %</div>
            <div className="text-base font-bold font-mono text-[#e66c37] mt-0.5">
              {drillMetrics.aiPercentage}%
            </div>
            <div className="text-[10px] text-slate-500">
              {drillMetrics.aiJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {language === 'ar' ? 'تخصصي' : 'Specialized'}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-[3px] border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{t('kpi_activeEmployers')}</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {drillMetrics.totalCompanies}
            </div>
            <div className="text-[10px] text-slate-500">
              {language === 'ar' ? 'منشأة توظيف' : 'Active Employers'}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-[3px] border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{language === 'ar' ? 'الدول النشطة' : 'Countries'}</div>
            <div className="text-base font-bold font-mono text-[#6b007b] mt-0.5">
              {drillMetrics.totalCountries}
            </div>
            <div className="text-[10px] text-slate-500">
              {language === 'ar' ? 'أسواق عالمية' : 'Global Markets'}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB CONTROLS & SUB-FILTERS */}
        {/* ========================================================================= */}
        <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
                activeTab === 'jobs' 
                  ? 'bg-sky-100 text-sky-900 border border-sky-300' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#118dff]" />
              <span>{language === 'ar' ? 'سجلات الوظائف التفصيلية' : 'Job Postings Microdata'}</span>
              <span className="bg-white/80 px-1.5 py-0.2 rounded text-[10px] font-mono border border-slate-200 text-slate-700">
                {filteredRows.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('employers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
                activeTab === 'employers' 
                  ? 'bg-sky-100 text-sky-900 border border-sky-300' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#6b007b]" />
              <span>{language === 'ar' ? 'الشركات وجهات التوظيف' : 'Hiring Employers'}</span>
              <span className="bg-white/80 px-1.5 py-0.2 rounded text-[10px] font-mono border border-slate-200 text-slate-700">
                {employerBreakdown.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
                activeTab === 'skills' 
                  ? 'bg-sky-100 text-sky-900 border border-sky-300' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-[#107c41]" />
              <span>{language === 'ar' ? 'المهارات والكفاءات' : 'Required Skills'}</span>
              <span className="bg-white/80 px-1.5 py-0.2 rounded text-[10px] font-mono border border-slate-200 text-slate-700">
                {topSkillsBreakdown.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('seniority')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
                activeTab === 'seniority' 
                  ? 'bg-sky-100 text-sky-900 border border-sky-300' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#e66c37]" />
              <span>{t('slicerSeniority')}</span>
            </button>
          </div>

          {/* Quick Search & Sorters */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2 rtl:left-auto rtl:right-2 top-2 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث في السجلات...' : 'Search records...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 rtl:pl-2 rtl:pr-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-[3px] w-full focus:outline-hidden focus:border-[#118dff]"
              />
            </div>

            <div className="flex items-center space-x-1 rtl:space-x-reverse shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-[3px] px-2 py-1 text-slate-700 focus:outline-hidden"
              >
                <option value="salary-desc">{language === 'ar' ? 'الراتب (من الأعلى)' : 'Salary (High to Low)'}</option>
                <option value="salary-asc">{language === 'ar' ? 'الراتب (من الأقل)' : 'Salary (Low to High)'}</option>
                <option value="date-desc">{language === 'ar' ? 'التاريخ (الأحدث)' : 'Date Posted (Newest)'}</option>
                <option value="title-asc">{language === 'ar' ? 'المسمى الوظيفي (أ-ي)' : 'Job Title (A-Z)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] min-h-[350px]">
          {/* TAB 1: JOB POSTINGS MICRODATA TABLE */}
          {activeTab === 'jobs' && (
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-[3px] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left rtl:text-right text-xs border-collapse">
                    <thead className="bg-[#f1f5f9] text-slate-700 text-[11px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">{t('col_jobTitle')}</th>
                        <th className="py-2.5 px-3">{t('col_company')}</th>
                        <th className="py-2.5 px-3">{t('col_category')}</th>
                        <th className="py-2.5 px-3">{t('col_location')}</th>
                        <th className="py-2.5 px-3">{t('col_modality')}</th>
                        <th className="py-2.5 px-3">{t('col_aiRole')}</th>
                        <th className="py-2.5 px-3 text-right rtl:text-left">{t('col_salary')} ({currency})</th>
                        <th className="py-2.5 px-3 text-center">{language === 'ar' ? 'التفاصيل' : 'Details'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {paginatedRows.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                            {language === 'ar' ? 'لم يتم العثور على سجلات مطابقة للبحث.' : 'No records match the active search or filter parameters.'}
                          </td>
                        </tr>
                      ) : (
                        paginatedRows.map((j) => (
                          <tr 
                            key={j.Job_ID}
                            onClick={() => setSelectedJobDetail(j)}
                            className="hover:bg-sky-50/70 transition-colors cursor-pointer group"
                          >
                            <td className="py-2 px-3 font-semibold text-slate-900 group-hover:text-[#118dff]">
                              <div>{j.Job_Title}</div>
                              <div className="text-[10px] text-slate-400">{translateSeniority(j.Seniority, language)} • {j.Job_ID}</div>
                            </td>
                            <td className="py-2 px-3 text-slate-700 font-medium">{j.Company}</td>
                            <td className="py-2 px-3 text-slate-600">{translateCategory(j.Job_Category, language)}</td>
                            <td className="py-2 px-3 text-slate-500 max-w-[140px] truncate">{translateCountry(j.Country, language)}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                j.Workplace_Modality === 'Remote' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                                j.Workplace_Modality === 'Hybrid' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                'bg-teal-50 text-teal-700 border border-teal-200'
                              }`}>
                                {translateModality(j.Workplace_Modality, language)}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono">
                              {j.Is_AI_Job === 'Yes' ? (
                                <span className="text-[#e66c37] font-semibold flex items-center space-x-1 rtl:space-x-reverse">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{language === 'ar' ? 'نعم' : 'Yes'}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">{language === 'ar' ? 'لا' : 'No'}</span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-mono text-right rtl:text-left text-[#107c41] font-bold">
                              {formatSalary(j.Salary_Avg_USD || 0, currency, { isArabic: language === 'ar' })}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedJobDetail(j);
                                }}
                                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-[#118dff] hover:text-white text-slate-600 transition-colors text-[10px] font-bold border border-slate-200"
                              >
                                {language === 'ar' ? 'عرض' : 'Inspect'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between bg-white px-3 py-2 border border-slate-200 rounded-[3px] text-xs font-medium">
                <span className="text-slate-600 text-[11px]">
                  {language === 'ar'
                    ? `الصفحة ${page} من ${totalPages} (${filteredRows.length.toLocaleString('ar-EG')} سجل مطابق)`
                    : `Page ${page} of ${totalPages} (${filteredRows.length.toLocaleString()} matching records)`}
                </span>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center text-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-0.5 rtl:mr-0 rtl:ml-0.5 rtl:rotate-180" />
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center text-xs cursor-pointer"
                  >
                    {language === 'ar' ? 'التالي' : 'Next'}
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5 rtl:ml-0 rtl:mr-0.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYERS BREAKDOWN */}
          {activeTab === 'employers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {employerBreakdown.map((emp) => (
                <div 
                  key={emp.company}
                  onClick={() => setSearchTerm(emp.company)}
                  className="bg-white p-3 rounded-[3px] border border-slate-200 shadow-2xs hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-bold text-slate-900 text-xs truncate max-w-[180px]">{emp.company}</div>
                    <span className="text-[11px] font-mono text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                      {emp.postings} {language === 'ar' ? 'وظائف' : 'jobs'} ({emp.pct}%)
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">{language === 'ar' ? 'متوسط الراتب' : 'Avg Compensation'}</span>
                      <span className="font-mono font-bold text-[#107c41]">{formatSalary(emp.avgSalary, currency, { compact: true, isArabic: language === 'ar' })}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">{language === 'ar' ? 'وظائف الذكاء الاصطناعي' : 'AI Specialized'}</span>
                      <span className="font-mono font-bold text-[#e66c37]">{emp.aiRoles} {language === 'ar' ? 'دور' : 'roles'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SKILLS BREAKDOWN */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {topSkillsBreakdown.map((sk) => (
                <div 
                  key={sk.skill}
                  onClick={() => setSearchTerm(sk.skill)}
                  className="bg-white p-2.5 rounded-[3px] border border-slate-200 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs truncate">{sk.skill}</span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {sk.pct}%
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    {sk.count} {language === 'ar' ? 'إعلان يتطلب هذه المهارة' : 'postings demand this'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SENIORITY TIERS */}
          {activeTab === 'seniority' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {seniorityBreakdown.map((sen) => (
                <div 
                  key={sen.level}
                  className="bg-white p-3.5 rounded-[3px] border border-slate-200 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{sen.displayName}</span>
                    <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {sen.pct}%
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('col_postingsCount')}:</span>
                      <span className="font-bold font-mono text-slate-800">{sen.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('kpi_avgSalary')}:</span>
                      <span className="font-bold font-mono text-[#107c41]">{formatSalary(sen.avgSalary, currency, { isArabic: language === 'ar' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MODAL: SINGLE JOB DETAILED INSPECTOR */}
        {/* ========================================================================= */}
        {selectedJobDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div 
              className="bg-white w-full max-w-2xl rounded-[4px] shadow-2xl border border-slate-300 overflow-hidden text-slate-800 flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#1e293b] text-white p-4 flex items-start justify-between border-b border-slate-700">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold">
                    {selectedJobDetail.Job_ID} • {translateCategory(selectedJobDetail.Job_Category, language)}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{selectedJobDetail.Job_Title}</h3>
                  <div className="text-xs text-slate-300 mt-0.5 flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="font-semibold text-white">{selectedJobDetail.Company}</span>
                    <span>•</span>
                    <span>{translateCountry(selectedJobDetail.Country, language)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJobDetail(null)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t('slicerModality')}</span>
                    <div className="font-bold text-slate-800 mt-0.5">{translateModality(selectedJobDetail.Workplace_Modality, language)}</div>
                  </div>
                  <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t('slicerSeniority')}</span>
                    <div className="font-bold text-slate-800 mt-0.5">{translateSeniority(selectedJobDetail.Seniority, language)}</div>
                  </div>
                  <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t('slicerAI')}</span>
                    <div className="font-bold text-[#e66c37] mt-0.5">{selectedJobDetail.Is_AI_Job === 'Yes' ? (language === 'ar' ? 'نعم (متخصص)' : 'Yes') : (language === 'ar' ? 'لا' : 'No')}</div>
                  </div>
                  <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t('col_salary')}</span>
                    <div className="font-bold text-[#107c41] font-mono mt-0.5">{formatSalary(selectedJobDetail.Salary_Avg_USD || 0, currency, { isArabic: language === 'ar' })}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">{language === 'ar' ? 'المهارات المطلوبة' : 'Required Competencies & Technologies'}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJobDetail.Skills_List.split(',').map((skill, idx) => (
                      <span key={idx} className="bg-sky-50 text-sky-800 border border-sky-200 text-xs px-2.5 py-1 rounded-[3px] font-mono font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'الموقع الجغرافي:' : 'Location:'}</span>
                    <span className="font-medium text-slate-800">{selectedJobDetail.Location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'تاريخ النشر:' : 'Posted Date:'}</span>
                    <span className="font-mono text-slate-800">{selectedJobDetail.Date_Posted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'نوع التوظيف:' : 'Employment Type:'}</span>
                    <span className="font-medium text-slate-800">{selectedJobDetail.Employment_Type}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#f8fafc] px-4 py-2.5 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedJobDetail(null)}
                  className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
