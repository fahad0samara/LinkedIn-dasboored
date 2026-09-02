import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkPlus, X } from 'lucide-react';
import { SavedBookmark, getSavedBookmarks, saveCustomBookmark, deleteCustomBookmark } from '../utils/bookmarks';
import { Language, useTranslation } from '../utils/i18n';

interface BookmarksBarProps {
  onApplyBookmark: (filters: SavedBookmark['filters']) => void;
  currentFilters: {
    country: string;
    category: string;
    modality: string;
    ai: string;
    seniority: string;
    page: number;
    currency?: string;
  };
  language?: Language;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({
  onApplyBookmark,
  currentFilters,
  language = 'ar'
}) => {
  const { t } = useTranslation(language);
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newBookmarkName, setNewBookmarkName] = useState<string>('');
  const [newBookmarkDesc, setNewBookmarkDesc] = useState<string>('');
  const [activeBookmarkId, setActiveBookmarkId] = useState<string | null>(null);

  const refreshBookmarks = () => {
    setBookmarks(getSavedBookmarks());
  };

  useEffect(() => {
    refreshBookmarks();
  }, []);

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookmarkName.trim()) return;

    saveCustomBookmark({
      name: newBookmarkName.trim(),
      description: newBookmarkDesc.trim() || `Saved view (${currentFilters.country} • ${currentFilters.category})`,
      filters: { ...currentFilters }
    });

    setNewBookmarkName('');
    setNewBookmarkDesc('');
    setIsAdding(false);
    refreshBookmarks();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomBookmark(id);
    refreshBookmarks();
    if (activeBookmarkId === id) setActiveBookmarkId(null);
  };

  const handleSelectBookmark = (b: SavedBookmark) => {
    setActiveBookmarkId(b.id);
    onApplyBookmark(b.filters);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        
        {/* Left: Bookmarks Label & Scrollable Chips */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-slate-500 text-xs font-bold uppercase tracking-wider shrink-0 pr-2 rtl:pr-0 rtl:pl-2 border-r rtl:border-r-0 rtl:border-l border-slate-200">
            <Bookmark className="w-3.5 h-3.5 text-[#118dff]" />
            <span>{t('bookmarksTitle')}:</span>
          </div>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse shrink-0">
            {bookmarks.map((bm) => {
              const isActive = activeBookmarkId === bm.id;
              const displayName = (language === 'ar' && bm.nameAr) ? bm.nameAr : bm.name;
              const displayDesc = (language === 'ar' && bm.descriptionAr) ? bm.descriptionAr : bm.description;
              
              return (
                <div
                  key={bm.id}
                  onClick={() => handleSelectBookmark(bm)}
                  className={`group relative flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[#118dff] text-white border-[#118dff] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                  title={displayDesc}
                >
                  <span className="whitespace-nowrap">{displayName}</span>

                  {!bm.isPreset && (
                    <button
                      onClick={(e) => handleDelete(bm.id, e)}
                      className={`p-0.5 rounded-full opacity-60 hover:opacity-100 hover:bg-red-500/20 ${
                        isActive ? 'text-white' : 'text-slate-400 hover:text-red-600'
                      }`}
                      title={language === 'ar' ? 'حذف الإشارة المرجعية' : 'Delete bookmark'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Add New Bookmark Trigger */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="px-2.5 py-1 text-xs font-semibold text-[#118dff] hover:text-[#0078d4] hover:bg-sky-50 rounded-md border border-sky-200 flex items-center space-x-1 rtl:space-x-reverse transition-colors cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{t('saveCurrentView')}</span>
            </button>
          ) : (
            <form onSubmit={handleSaveCurrent} className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <input
                type="text"
                value={newBookmarkName}
                onChange={(e) => setNewBookmarkName(e.target.value)}
                placeholder={language === 'ar' ? 'اسم طريقة العرض...' : 'Bookmark name...'}
                className="px-2.5 py-1 text-xs border border-slate-300 rounded font-medium focus:ring-1 focus:ring-[#118dff] focus:outline-hidden"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newBookmarkName.trim()}
                className="px-2.5 py-1 bg-[#118dff] hover:bg-[#0078d4] disabled:opacity-50 text-white rounded text-xs font-bold"
              >
                {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
