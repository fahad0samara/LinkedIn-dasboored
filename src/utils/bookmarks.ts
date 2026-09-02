export interface SavedBookmark {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  icon?: string;
  filters: {
    country: string;
    category: string;
    modality: string;
    ai: string;
    seniority: string;
    page: number;
    currency?: string;
  };
  isPreset?: boolean;
  createdAt: string;
}

export const PRESET_BOOKMARKS: SavedBookmark[] = [
  {
    id: 'preset_ai_boom',
    name: '🤖 AI & ML High Premium',
    nameAr: '🤖 علاوة الذكاء الاصطناعي المرتفعة',
    description: 'Data Science & AI roles with AI specialization (+42% salary premium)',
    descriptionAr: 'وظائف الذكاء الاصطناعي وعلم البيانات مع أعلى علاوة سوقية (+42%)',
    icon: 'Brain',
    filters: {
      country: 'All',
      category: 'Data Science & AI',
      modality: 'All',
      ai: 'Yes',
      seniority: 'All',
      page: 5,
    },
    isPreset: true,
    createdAt: 'Default'
  },
  {
    id: 'preset_global_remote',
    name: '🌐 100% Remote Global Roles',
    nameAr: '🌐 وظائف العمل عن بُعد 100%',
    description: 'Worldwide fully remote opportunities across all tech categories',
    descriptionAr: 'فرص عمل عالمية متاحة للعمل عن بعد بالكامل في كافة القطاعات',
    icon: 'Globe',
    filters: {
      country: 'All',
      category: 'All',
      modality: 'Remote',
      ai: 'All',
      seniority: 'All',
      page: 1,
    },
    isPreset: true,
    createdAt: 'Default'
  },
  {
    id: 'preset_us_tech',
    name: '🇺🇸 US Tech & Engineering',
    nameAr: '🇺🇸 مراكز التقنية الأمريكية',
    description: 'United States Technology hiring hubs (Silicon Valley, Seattle, NY)',
    descriptionAr: 'أكبر أسواق التوظيف التقني في الولايات المتحدة وسيليكون فالي',
    icon: 'Cpu',
    filters: {
      country: 'United States',
      category: 'Software Engineering',
      modality: 'All',
      ai: 'All',
      seniority: 'All',
      page: 1,
    },
    isPreset: true,
    createdAt: 'Default'
  },
  {
    id: 'preset_executive',
    name: '👑 Leadership & Lead Roles',
    nameAr: '👑 وظائف الخبراء والقيادات التقنية',
    description: 'Senior leadership, Principal, and Lead positions across global markets',
    descriptionAr: 'المستويات الوظيفية القيادية والمتقدمة (Senior / Lead / Staff)',
    icon: 'Award',
    filters: {
      country: 'All',
      category: 'All',
      modality: 'All',
      ai: 'All',
      seniority: 'Lead / Staff',
      page: 4,
    },
    isPreset: true,
    createdAt: 'Default'
  },
  {
    id: 'preset_eu_markets',
    name: '🇪🇺 European Talent Corridors',
    nameAr: '🇪🇺 أسواق التوظيف الأوروبية',
    description: 'UK, Germany, and European market overview',
    descriptionAr: 'نظرة شاملة على أسواق التوظيف في بريطانيا وألمانيا وأوروبا',
    icon: 'Building2',
    filters: {
      country: 'Germany',
      category: 'All',
      modality: 'All',
      ai: 'All',
      seniority: 'All',
      page: 3,
    },
    isPreset: true,
    createdAt: 'Default'
  },
  {
    id: 'preset_compensation',
    name: '💰 Top Compensation Analysis',
    nameAr: '💰 تحليل معايير الأجور العليا',
    description: 'Salary benchmark progression curves and percentile tiers',
    descriptionAr: 'منحنيات تدرج الرواتب القياسية ومقارنة فئات الخبرة',
    icon: 'DollarSign',
    filters: {
      country: 'All',
      category: 'All',
      modality: 'All',
      ai: 'All',
      seniority: 'Senior',
      page: 4,
    },
    isPreset: true,
    createdAt: 'Default'
  }
];

const LOCAL_STORAGE_KEY = 'powerbi_saved_bookmarks';

export function getSavedBookmarks(): SavedBookmark[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return PRESET_BOOKMARKS;
    const userCustom: SavedBookmark[] = JSON.parse(raw);
    return [...PRESET_BOOKMARKS, ...userCustom];
  } catch (err) {
    return PRESET_BOOKMARKS;
  }
}

export function saveCustomBookmark(bookmark: Omit<SavedBookmark, 'id' | 'createdAt' | 'isPreset'>): SavedBookmark {
  const newBookmark: SavedBookmark = {
    ...bookmark,
    id: `user_bm_${Date.now()}`,
    isPreset: false,
    createdAt: new Date().toLocaleDateString()
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: SavedBookmark[] = raw ? JSON.parse(raw) : [];
    const updated = [newBookmark, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save custom bookmark', err);
  }

  return newBookmark;
}

export function deleteCustomBookmark(id: string): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;
    const existing: SavedBookmark[] = JSON.parse(raw);
    const filtered = existing.filter(b => b.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete bookmark', err);
  }
}
