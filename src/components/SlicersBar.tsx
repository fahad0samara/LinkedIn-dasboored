import React from 'react';
import { Filter, Globe, Briefcase, Building, Layers, Sparkles, X } from 'lucide-react';
import { COUNTRY_DATA, CATEGORY_DATA, SENIORITY_DATA } from '../data/jobData';
import { Language, useTranslation, translateCountry, translateCategory, translateSeniority, translateModality, translateAI } from '../utils/i18n';

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
  const isFiltered = selectedCountry !== 'All' || selectedCategory !== 'All' || selectedModality !== 'All' || selectedAI !== 'All' || selectedSeniority !== 'All';

  const handleClearAll = () => {
    setSelectedCountry('All');
    setSelectedCategory('All');
    setSelectedModality('All');
    setSelectedAI('All');
    setSelectedSeniority('All');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[4px] p-3 shadow-2xs">
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 text-xs">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-700 font-bold uppercase tracking-wider text-[11px]">
          <Filter className="w-3.5 h-3.5 text-[#118dff]" />
          <span>{t('slicersTitle')}</span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#118dff] border border-sky-200 normal-case">
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
                className="text-[10px] text-[#118dff] hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>
            )}
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={`w-full rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#118dff] focus:border-[#118dff] font-medium transition-colors ${
              selectedCountry !== 'All'
                ? 'bg-sky-50/60 border-[#118dff] text-[#118dff] font-semibold'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="All">{t('allCountries')} ({COUNTRY_DATA.length})</option>
            {COUNTRY_DATA.map((c) => (
              <option key={c.country} value={c.country}>
                {translateCountry(c.country, language)} ({c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})
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
                className="text-[10px] text-[#118dff] hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>
            )}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#118dff] focus:border-[#118dff] font-medium transition-colors ${
              selectedCategory !== 'All'
                ? 'bg-sky-50/60 border-[#118dff] text-[#118dff] font-semibold'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="All">{t('allCategories')} ({CATEGORY_DATA.length})</option>
            {CATEGORY_DATA.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {translateCategory(cat.category, language)} ({cat.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})
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
              { id: 'Remote', label: t('mod_remote') },
              { id: 'Hybrid', label: t('mod_hybrid') },
              { id: 'On-site', label: t('mod_onsite') }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModality(m.id)}
                className={`py-1 px-1 rounded text-[11px] font-medium text-center border transition-all cursor-pointer ${
                  selectedModality === m.id
                    ? 'bg-[#118dff] text-white border-[#118dff] shadow-2xs font-semibold'
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
              { id: 'Yes', label: language === 'ar' ? 'ذكاء اصطناعي' : 'AI Only' },
              { id: 'No', label: language === 'ar' ? 'عام' : 'Non-AI' }
            ].map((ai) => (
              <button
                key={ai.id}
                onClick={() => setSelectedAI(ai.id)}
                className={`py-1 px-1 rounded text-[11px] font-medium text-center border transition-all cursor-pointer ${
                  selectedAI === ai.id
                    ? 'bg-[#e66c37] text-white border-[#e66c37] shadow-2xs font-semibold'
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
                className="text-[10px] text-[#118dff] hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>
            )}
          </label>
          <select
            value={selectedSeniority}
            onChange={(e) => setSelectedSeniority(e.target.value)}
            className={`w-full rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#118dff] focus:border-[#118dff] font-medium transition-colors ${
              selectedSeniority !== 'All'
                ? 'bg-sky-50/60 border-[#118dff] text-[#118dff] font-semibold'
                : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="All">{t('allSeniority')} ({SENIORITY_DATA.length})</option>
            {SENIORITY_DATA.map((s) => (
              <option key={s.level} value={s.level}>
                {translateSeniority(s.level, language)} ({s.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
