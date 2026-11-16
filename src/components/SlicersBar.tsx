import React from 'react';
import { Filter, Globe, Briefcase, Building, Layers, Sparkles, X } from 'lucide-react';
import { getActiveJobRecords } from '../data/jobDataEngine';
import { Language, useTranslation, translateCountry, translateCategory, translateSeniority } from '../utils/i18n';

interface SlicersBarProps {
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedModality: string;
  setSelectedModality: (m: string) => void;
  selectedAI: string;
  setSelectedAI: (a: string) => void;
  selectedSeniority: string;
  setSelectedSeniority: (s: string) => void;
  language?: Language;
}

export const SlicersBar: React.FC<SlicersBarProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedCategory,
  setSelectedCategory,
  selectedModality,
  setSelectedModality,
  selectedAI,
  setSelectedAI,
  selectedSeniority,
  setSelectedSeniority,
  language = 'ar',
}) => {
  const { t } = useTranslation(language);
  const activeRecords = getActiveJobRecords();
  const countryOptions = Array.from(new Set(activeRecords.map(job => job.Country).filter(Boolean))).sort();
  const categoryOptions = Array.from(new Set(activeRecords.map(job => job.Job_Category).filter(Boolean))).sort();
  const seniorityOptions = Array.from(new Set(activeRecords.map(job => job.Seniority).filter(Boolean))).sort();
  const countBy = (field: 'Country' | 'Job_Category' | 'Seniority', value: string) => activeRecords.filter(job => job[field] === value).length;
  const isFiltered = selectedCountry !== 'All' || selectedCategory !== 'All' || selectedModality !== 'All' || selectedAI !== 'All' || selectedSeniority !== 'All';

  const handleClearAll = () => {
    setSelectedCountry('All');
    setSelectedCategory('All');
    setSelectedModality('All');
    setSelectedAI('All');
    setSelectedSeniority('All');
  };

  return (
    <div className="dashboard-slicers bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 text-xs">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-700 font-bold uppercase tracking-wider text-[11px]">
          <Filter className="w-3.5 h-3.5 text-[#F0A15A]" />
          <span>{t('slicersTitle')}</span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3A2416] text-[#F0B36F] border border-[#80502D] normal-case">
              {t('filterApplied')}
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1 rtl:space-x-reverse text-[11px] font-medium text-slate-500 hover:text-rose-600 px-2 py-0.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>{t('clearAllSlicers')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
        {/* Slicer 1: Country Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>{t('slicerCountry')}</span>
            </span>
            {selectedCountry !== 'All' && (
              <button 
                onClick={() => setSelectedCountry('All')}
                className="text-[10px] text-[#F0A15A] hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>
            )}
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={`w-full rounded border px-2.5 py-1.5 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#118dff] focus:border-[#118dff] font-medium transition-colors ${
              selectedCountry !== 'All'
                ? 'bg-[#352114] border-[#C87535] text-[#F0B36F] font-semibold'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="All">{t('allCountries')} ({countryOptions.length})</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {translateCountry(country, language)} ({countBy('Country', country).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})
              </option>
            ))}
          </select>
        </div>

        {/* Slicer 2: Category Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <Building className="w-3 h-3 text-slate-400" />
              <span>{t('slicerCategory')}</span>
            </span>
            {selectedCategory !== 'All' && (
              <button 
                onClick={() => setSelectedCategory('All')}
                className="text-[10px] text-[#F0A15A] hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>
            )}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full rounded border px-2.5 py-1.5 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#118dff] focus:border-[#118dff] font-medium transition-colors ${
              selectedCategory !== 'All'
                ? 'bg-[#352114] border-[#C87535] text-[#F0B36F] font-semibold'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="All">{t('allCategories')} ({categoryOptions.length})</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {translateCategory(category, language)} ({countBy('Job_Category', category).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})
              </option>
            ))}
          </select>
        </div>

        {/* Slicer 3: Modality Chiclet Slicer */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1 rtl:space-x-reverse">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span>{t('slicerModality')}</span>
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'All', label: t('all') },
              { id: 'Remote', label: language === 'ar' ? 'عن بُعد' : 'Remote' },
              { id: 'Hybrid', label: language === 'ar' ? 'هجين' : 'Hybrid' },
              { id: 'On-site', label: language === 'ar' ? 'حضوري' : 'On-site' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModality(m.id)}
                className={`h-7 px-1 rounded text-[11px] font-medium text-center border transition-all cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                  selectedModality === m.id
                    ? 'bg-[#D96D2D] text-white border-[#E58A3A] shadow-2xs font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slicer 4: AI Specialization Chiclet */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1 rtl:space-x-reverse">
            <Sparkles className="w-3 h-3 text-slate-400" />
            <span>{t('slicerAI')}</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'All', label: t('all') },
              { id: 'Yes', label: language === 'ar' ? 'ذكاء' : 'AI' },
              { id: 'No', label: language === 'ar' ? 'عام' : 'Non-AI' }
            ].map((ai) => (
              <button
                key={ai.id}
                onClick={() => setSelectedAI(ai.id)}
                className={`h-7 px-1 rounded text-[11px] font-medium text-center border transition-all cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                  selectedAI === ai.id
                    ? 'bg-[#D96D2D] text-white border-[#E58A3A] shadow-2xs font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {ai.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slicer 5: Seniority Tier Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>{t('slicerSeniority')}</span>
            </span>
            {selectedSeniority !== 'All' && (
              <button 
                onClick={() => setSelectedSeniority('All')}
                className="text-[10px] text-[#F0A15A] hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>
            )}
          </label>
          <select
            value={selectedSeniority}
            onChange={(e) => setSelectedSeniority(e.target.value)}
            className={`w-full rounded border px-2.5 py-1.5 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#118dff] focus:border-[#118dff] font-medium transition-colors ${
              selectedSeniority !== 'All'
                ? 'bg-[#352114] border-[#C87535] text-[#F0B36F] font-semibold'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="All">{t('allSeniority')} ({seniorityOptions.length})</option>
            {seniorityOptions.map((seniority) => (
              <option key={seniority} value={seniority}>
                {translateSeniority(seniority, language)} ({countBy('Seniority', seniority).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
