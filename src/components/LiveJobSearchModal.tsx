import React, { useState, useEffect } from 'react';
import { 
  Search, Globe, RefreshCw, Plus, ExternalLink, Building2, 
  MapPin, DollarSign, Sparkles, CheckCircle2, ArrowRight, X, Layers 
} from 'lucide-react';
import { fetchLiveJobs, LiveJobResult, convertLiveJobsToRecords } from '../utils/liveJobFetcher';
import { appendJobsToDataset, setCustomDataset } from '../data/jobDataEngine';
import { CurrencyCode, formatSalary } from '../utils/currency';
import { Language, useTranslation, translateCategory, translateCountry, translateModality } from '../utils/i18n';

interface LiveJobSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetUpdated: () => void;
  currency: CurrencyCode;
  language?: Language;
}

export const LiveJobSearchModal: React.FC<LiveJobSearchModalProps> = ({
  isOpen,
  onClose,
  onDatasetUpdated,
  currency,
  language = 'ar'
}) => {
  const { t } = useTranslation(language);
  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [jobs, setJobs] = useState<LiveJobResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadJobs = async (searchQuery: string = query, cat: string = selectedCategory) => {
    setLoading(true);
    try {
      const results = await fetchLiveJobs(searchQuery, cat, 20);
      setJobs(results);
      // Select all by default for easy batch ingestion
      setSelectedJobIds(new Set(results.map(j => j.id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadJobs(query, selectedCategory);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs(query, selectedCategory);
  };

  const toggleSelectJob = (id: string) => {
    const next = new Set(selectedJobIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedJobIds(next);
  };

  const handleIngestSelected = (replaceEntireDataset: boolean = false) => {
    const chosenJobs = jobs.filter(j => selectedJobIds.has(j.id));
    if (chosenJobs.length === 0) return;

    const records = convertLiveJobsToRecords(chosenJobs);
    if (replaceEntireDataset) {
      setCustomDataset(records);
      setFeedbackMessage(language === 'ar' ? `تم تعيين اللوحة إلى ${records.length} وظيفة حية!` : `Set active dashboard to ${records.length} live jobs!`);
    } else {
      appendJobsToDataset(records);
      setFeedbackMessage(language === 'ar' ? `تم دمج ${records.length} وظيفة حية في لوحة القيادة!` : `Merged ${records.length} live jobs into dashboard!`);
    }

    onDatasetUpdated();
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h2 className="text-base font-bold">
                  {language === 'ar' ? 'البحث الحي وتغذية الوظائف العامة المباشرة' : 'Live Public Job Search & Stream Sync'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider">
                  {language === 'ar' ? 'تغذية حية' : 'Live Feed'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'ar' ? 'ابحث في إعلانات التوظيف العالمية وادمجها فورياً في نموذج بيانات Power BI' : 'Search live job feeds worldwide and merge postings directly into your Power BI intelligence dataset'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث بالمسمى، الكلمات المفتاحية، أو المهارات (مثل: React, Machine Learning)...' : 'Search by title, keywords, or skills (e.g. Machine Learning, React, Product Manager)...'}
                className="w-full pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#118dff] font-medium"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                loadJobs(query, e.target.value);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium focus:outline-hidden"
            >
              <option value="All">{t('allCategories')}</option>
              <option value="Technology">{translateCategory('Technology', language)}</option>
              <option value="Data & AI">{translateCategory('Data & AI', language)}</option>
              <option value="Design">{translateCategory('Design', language)}</option>
              <option value="Marketing">{translateCategory('Marketing', language)}</option>
              <option value="Finance">{translateCategory('Finance', language)}</option>
              <option value="Sales">{translateCategory('Sales', language)}</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#118dff] hover:bg-[#0078d4] text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? (language === 'ar' ? 'جارٍ البحث...' : 'Searching...') : (language === 'ar' ? 'بحث' : 'Search')}</span>
            </button>
          </form>

          {/* Feedback or Ingestion Actions */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-slate-600 font-medium">
              {language === 'ar'
                ? `تم العثور على ${jobs.length} وظيفة حية (${selectedJobIds.size} محددة للإدراج)`
                : `Found ${jobs.length} live job listings (${selectedJobIds.size} selected for ingestion)`}
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {feedbackMessage ? (
                <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{feedbackMessage}</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleIngestSelected(false)}
                    disabled={selectedJobIds.size === 0}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? `دمج (${selectedJobIds.size}) في اللوحة` : `Merge (${selectedJobIds.size}) into Dashboard`}</span>
                  </button>

                  <button
                    onClick={() => handleIngestSelected(true)}
                    disabled={selectedJobIds.size === 0}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-slate-100 rounded text-xs font-semibold flex items-center space-x-1.5 rtl:space-x-reverse transition-colors disabled:opacity-40 cursor-pointer"
                    title={language === 'ar' ? 'استبدال البيانات الحالية بالكامل بالوظائف المحددة' : 'Replace entire dataset with chosen live jobs'}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'استبدال النموذج بالكامل' : 'Replace Dataset'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2.5 bg-slate-100">
          {jobs.length === 0 && !loading ? (
            <div className="text-center py-12 text-slate-400 font-medium text-xs">
              {language === 'ar' ? 'لم يتم العثور على وظائف تطابق البحث. جرب كلمات بحث أخرى.' : 'No live jobs found matching query. Try different keywords.'}
            </div>
          ) : (
            jobs.map((job) => {
              const isSelected = selectedJobIds.has(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => toggleSelectJob(job.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white border-[#118dff] shadow-xs' 
                      : 'bg-white/70 border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="mt-1 rounded text-[#118dff] focus:ring-[#118dff] cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                          {job.isAi && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center space-x-1 rtl:space-x-reverse">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              <span>{language === 'ar' ? 'ذكاء اصطناعي' : 'AI Role'}</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-semibold">
                            {translateModality(job.modality, language)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center space-x-1 rtl:space-x-reverse text-slate-700 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{job.company}</span>
                          </span>

                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{translateCountry(job.location, language)}</span>
                          </span>

                          <span className="text-slate-400">
                            {language === 'ar' ? 'المصدر:' : 'Source:'} <strong className="text-slate-700">{job.source}</strong>
                          </span>
                        </div>

                        {job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.skills.slice(0, 6).map((sk) => (
                              <span key={sk} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right rtl:text-left shrink-0">
                      <div className="text-sm font-bold font-mono text-[#107c41]">
                        {formatSalary(job.salaryAvg, currency, { isArabic: language === 'ar' })}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'الراتب المقدر' : 'Estimated Annual'}</span>
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-[#118dff] hover:underline flex items-center justify-end rtl:justify-start space-x-0.5 rtl:space-x-reverse mt-1"
                        >
                          <span>{language === 'ar' ? 'عرض الرابط' : 'View Link'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            {language === 'ar' ? 'تحديث فوري لجميع المخططات ومؤشرات DAX عند الاستيراد' : 'Immediate recalculation of all charts and DAX measures upon import'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
