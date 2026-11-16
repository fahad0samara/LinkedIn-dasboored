import React from 'react';
import { LayoutDashboard, TrendingUp, Globe2, DollarSign, Sparkles } from 'lucide-react';
import { Language, useTranslation } from '../utils/i18n';

interface ReportTabsProps {
  activePage: number;
  setActivePage: (page: number) => void;
  language?: Language;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({
  activePage,
  setActivePage,
  language = 'ar',
}) => {
  const { t } = useTranslation(language);

  const tabs = [
    { id: 1, label: t('tab_executive'), icon: LayoutDashboard },
    { id: 2, label: t('tab_marketDemand'), icon: TrendingUp },
    { id: 3, label: t('tab_geographic'), icon: Globe2 },
    { id: 4, label: t('tab_salary'), icon: DollarSign },
    { id: 5, label: t('tab_ai'), icon: Sparkles },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-200 text-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`px-3.5 py-2 rounded-t-md font-bold flex items-center space-x-2 rtl:space-x-reverse transition-all whitespace-nowrap border-t border-x -mb-[1px] cursor-pointer ${
              isActive
                ? 'bg-white text-[#F5B36F] border-slate-300 border-b-2 border-b-[#E58A3A] shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F5B36F]' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
