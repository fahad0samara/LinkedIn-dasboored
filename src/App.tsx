import React, { useState, useMemo, useEffect } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { BookmarksBar } from './components/BookmarksBar';
import { ReportTabs } from './components/ReportTabs';
import { SlicersBar } from './components/SlicersBar';
import { PowerBICanvas } from './components/PowerBICanvas';
import { DatasetImportModal } from './components/DatasetImportModal';
import { LiveJobSearchModal } from './components/LiveJobSearchModal';
import { DaxPlaygroundModal, CustomMetric } from './components/DaxPlaygroundModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { getActiveJobRecords, isUsingCustomDataset, evaluateDaxFilterEngine } from './data/jobDataEngine';
import { METRICS_DATA } from './data/jobData';
import { CurrencyCode } from './utils/currency';
import { SavedBookmark } from './utils/bookmarks';
import { Language, useTranslation } from './utils/i18n';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const { t } = useTranslation(language);
  const [activePage, setActivePage] = useState<number>(1);
  const [datasetVersion, setDatasetVersion] = useState<number>(0);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Keep HTML document direction and language in sync
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isLiveSearchModalOpen, setIsLiveSearchModalOpen] = useState<boolean>(false);
  const [isDaxModalOpen, setIsDaxModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Pinned custom DAX metrics
  const [customPinnedMetrics, setCustomPinnedMetrics] = useState<CustomMetric[]>([]);

  // Cross-Filter / Slicer States
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModality, setSelectedModality] = useState<string>('All');
  const [selectedAI, setSelectedAI] = useState<string>('All');
  const [selectedSeniority, setSelectedSeniority] = useState<string>('All');

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCountry !== 'All') count++;
    if (selectedCategory !== 'All') count++;
    if (selectedModality !== 'All') count++;
    if (selectedAI !== 'All') count++;
    if (selectedSeniority !== 'All') count++;
    return count;
  }, [selectedCountry, selectedCategory, selectedModality, selectedAI, selectedSeniority]);

  const handleResetFilters = () => {
    setSelectedCountry('All');
    setSelectedCategory('All');
    setSelectedModality('All');
    setSelectedAI('All');
    setSelectedSeniority('All');
  };

  const handleDatasetUpdated = () => {
    setDatasetVersion(v => v + 1);
    handleResetFilters();
  };

  const handleApplyBookmark = (filters: SavedBookmark['filters']) => {
    if (filters.country !== undefined) setSelectedCountry(filters.country);
    if (filters.category !== undefined) setSelectedCategory(filters.category);
    if (filters.modality !== undefined) setSelectedModality(filters.modality);
    if (filters.ai !== undefined) setSelectedAI(filters.ai);
    if (filters.seniority !== undefined) setSelectedSeniority(filters.seniority);
    if (filters.page !== undefined) setActivePage(filters.page);
    if (filters.currency && (['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'SGD', 'JPY'] as CurrencyCode[]).includes(filters.currency as CurrencyCode)) {
      setCurrency(filters.currency as CurrencyCode);
    }
  };

  const handlePinMetric = (metric: CustomMetric) => {
    setCustomPinnedMetrics(prev => {
      const exists = prev.some(m => m.id === metric.id);
      if (exists) return prev;
      return [...prev, metric];
    });
  };

  const handleUnpinMetric = (id: string) => {
    setCustomPinnedMetrics(prev => prev.filter(m => m.id !== id));
  };

  const activeRecords = getActiveJobRecords();
  const isCustom = isUsingCustomDataset();
  const totalCount = isCustom ? activeRecords.length : METRICS_DATA.total_jobs;
  const currentDateFormatted = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', year: 'numeric' });

  // Evaluate current DAX metrics for reports
  const daxEvaluation = useMemo(() => {
    return evaluateDaxFilterEngine({
      country: selectedCountry,
      category: selectedCategory,
      modality: selectedModality,
      ai: selectedAI,
      seniority: selectedSeniority,
      search: ''
    });
  }, [selectedCountry, selectedCategory, selectedModality, selectedAI, selectedSeniority, datasetVersion]);

  return (
    <div className={`min-h-screen bg-[#f8f9fa] text-slate-900 font-sans flex flex-col ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* 1. Header */}
      <DashboardHeader
        key={`hdr-${datasetVersion}-${language}`}
        activeFiltersCount={activeFiltersCount}
        onResetFilters={handleResetFilters}
        selectedCountry={selectedCountry}
        selectedCategory={selectedCategory}
        selectedModality={selectedModality}
        selectedAI={selectedAI}
        selectedSeniority={selectedSeniority}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenLiveSearchModal={() => setIsLiveSearchModalOpen(true)}
        onOpenDaxModal={() => setIsDaxModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
      />

      {/* 2. Power BI Bookmarks / Saved Views Bar */}
      <BookmarksBar
        onApplyBookmark={handleApplyBookmark}
        currentFilters={{
          country: selectedCountry,
          category: selectedCategory,
          modality: selectedModality,
          ai: selectedAI,
          seniority: selectedSeniority,
          page: activePage,
          currency: currency
        }}
        language={language}
      />

      {/* 3. Main Dashboard Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Report View Navigation Tabs */}
        <ReportTabs
          activePage={activePage}
          setActivePage={setActivePage}
          language={language}
        />

        {/* Interactive Chiclet & Dropdown Slicers Bar */}
        <SlicersBar
          key={`slicer-${datasetVersion}-${language}`}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedModality={selectedModality}
          setSelectedModality={setSelectedModality}
          selectedAI={selectedAI}
          setSelectedAI={setSelectedAI}
          selectedSeniority={selectedSeniority}
          setSelectedSeniority={setSelectedSeniority}
          language={language}
        />

        {/* Visual Canvas */}
        <PowerBICanvas
          key={`canvas-${datasetVersion}-${language}`}
          activePage={activePage}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedModality={selectedModality}
          setSelectedModality={setSelectedModality}
          selectedAI={selectedAI}
          setSelectedAI={setSelectedAI}
          selectedSeniority={selectedSeniority}
          setSelectedSeniority={setSelectedSeniority}
          currency={currency}
          customPinnedMetrics={customPinnedMetrics}
          onUnpinMetric={handleUnpinMetric}
          language={language}
        />
      </main>

      {/* Dataset Import & Management Modal */}
      <DatasetImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onDatasetUpdated={handleDatasetUpdated}
        language={language}
      />

      {/* Live Job Search & Web Ingestion Modal */}
      <LiveJobSearchModal
        isOpen={isLiveSearchModalOpen}
        onClose={() => setIsLiveSearchModalOpen(false)}
        onDatasetUpdated={handleDatasetUpdated}
        currency={currency}
        language={language}
      />

      {/* Power BI DAX Formula Playground Modal */}
      <DaxPlaygroundModal
        isOpen={isDaxModalOpen}
        onClose={() => setIsDaxModalOpen(false)}
        currency={currency}
        onPinMetric={handlePinMetric}
        language={language}
      />

      {/* Executive Briefing Report & PDF Generator Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        metrics={daxEvaluation}
        selectedCountry={selectedCountry}
        selectedCategory={selectedCategory}
        selectedModality={selectedModality}
        currency={currency}
        language={language}
      />

      {/* Report Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{language === 'ar' ? 'منصة تحليلات سوق العمل والرواتب العالمية • تقرير Power BI التنفيذي' : 'Global Job Market Analytics • Power BI Dashboard'}</span>
          <span className="font-mono text-[11px] text-slate-400">
            {language === 'ar' 
              ? `آخر تحديث ${currentDateFormatted} • ${totalCount.toLocaleString('ar-EG')} إعلان وظيفي`
              : `Updated ${currentDateFormatted} • ${totalCount.toLocaleString()} Postings`}
          </span>
        </div>
      </footer>
    </div>
  );
}
