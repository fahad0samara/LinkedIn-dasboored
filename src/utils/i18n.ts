// Comprehensive Arabic & English Localization Dictionary and Utilities

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Header
    appTitle: 'تحليلات سوق العمل',
    appSubtitle: 'تقرير ومؤشرات سوق التوظيف والتقنية',
    liveJobSearch: 'بحث مباشر وتغذية الوظائف',
    daxPlayground: 'مختبر صيغ DAX',
    executiveReport: 'تقرير تنفيذي وموجز PDF',
    importDataset: 'استيراد مجموعة بيانات',
    exportCsv: 'تصدير البيانات (CSV)',
    resetFilters: 'إعادة ضبط التصفية',
    customDatasetActive: 'مجموعة بيانات مخصصة نشطة',
    defaultDataset: 'مجموعة البيانات العالمية الافتراضية',
    filterApplied: 'عوامل تصفية نشطة',
    language: 'اللغة',
    currency: 'العملة',
    
    // Bookmarks
    bookmarksTitle: 'طرق العرض المفضلة والمحفوظة',
    saveCurrentView: 'حفظ طريقة العرض الحالية',
    bookmarkNamePrompt: 'أدخل اسماً لحفظ طريقة العرض الحالية:',
    bookmarkSaved: 'تم حفظ طريقة العرض بنجاح',
    resetToDefault: 'الافتراضي',
    activeView: 'العرض النشط',
    
    // Default Bookmarks
    bm_aiHighPremium: 'علاوة الذكاء الاصطناعي المرتفعة',
    bm_aiHighPremiumDesc: 'وظائف الذكاء الاصطناعي ذات أعلى رواتب وعلاوة سوقية',
    bm_remoteGlobal: 'وظائف العمل عن بُعد 100%',
    bm_remoteGlobalDesc: 'استعراض الفرص العالمية المتاحة للعمل عن بعد بالكامل',
    bm_techCorridors: 'مراكز التقنية في أمريكا وأوروبا',
    bm_techCorridorsDesc: 'أكبر أسواق التوظيف التقني في الولايات المتحدة وأوروبا',
    bm_leadership: 'وظائف الخبراء والقيادات التقنية',
    bm_leadershipDesc: 'المستويات الوظيفية المتقدمة والإدارية (Senior/Lead/Staff)',
    bm_cloudCyber: 'الحوسبة السحابية والأمن السيبراني',
    bm_cloudCyberDesc: 'تحليل قطاعات البنية التحتية وحماية البيانات',

    // Report Tabs
    tab_executive: 'نظرة عامة تنفيذية',
    tab_marketDemand: 'تحليل الطلب والمهارات',
    tab_geographic: 'التوزيع الجغرافي والإقليمي',
    tab_salary: 'معايير الأجور والرواتب',
    tab_ai: 'تخصصات الذكاء الاصطناعي',

    // Slicers Bar
    slicersTitle: 'خيارات التصفية',
    slicerCountry: 'الدولة / السوق الجغرافي',
    slicerCategory: 'قطاع الوظيفة / التخصص',
    slicerModality: 'نمط العمل',
    slicerAI: 'تخصص الذكاء الاصطناعي',
    slicerSeniority: 'المستوى الوظيفي',
    all: 'الكل',
    allCountries: 'جميع الدول',
    allCategories: 'جميع التخصصات',
    allModalities: 'جميع الأنماط',
    allAI: 'جميع الوظائف',
    allSeniority: 'جميع المستويات',
    allRoles: 'جميع الوظائف',
    activeFiltersCount: 'مرشحات مطبقة',
    clearAllSlicers: 'مسح جميع المرشحات',

    // Modal / Slicer values
    mod_remote: 'عن بُعد',
    mod_hybrid: 'هجين',
    mod_onsite: 'حضوري / مكتبي',
    
    ai_yes: 'وظائف ذكاء اصطناعي فقط',
    ai_no: 'وظائف غير الذكاء الاصطناعي',

    sen_entry: 'مبتدئ / خريج (Entry-Level)',
    sen_mid: 'متوسط الخبرة (Mid-Level)',
    sen_senior: 'أول / خبير (Senior / Lead)',
    sen_staff: 'رئيسي / تنفيذي (Staff / Principal)',

    // KPI Cards
    kpi_activePostings: 'إجمالي إعلانات الوظائف النشطة',
    kpi_activePostingsSub: 'فرصة وظيفية مفهرسة',
    kpi_totalJobs: 'إجمالي الوظائف',
    kpi_yoyGrowth: 'نمو الطلب السنوي (YoY)',
    kpi_yoyGrowthSub: 'مقارنة بالعام السابق',
    kpi_remoteAdoption: 'نسبة تبني العمل عن بُعد',
    kpi_remoteAdoptionSub: 'عن بُعد وهجين',
    kpi_remoteShare: 'نسبة العمل عن بعد',
    kpi_aiShare: 'نسبة تخصص الذكاء الاصطناعي',
    kpi_aiShareSub: 'من إجمالي الشواغر',
    kpi_benchmarkSalary: 'متوسط الراتب السنوي القياسي',
    kpi_benchmarkSalarySub: 'متوسط الأجور للنطاق الحالي',
    kpi_avgSalary: 'متوسط الراتب السنوي',
    kpi_medianSalary: 'الوسيط الحسابي للأجور',
    kpi_medianSalarySub: 'المعيار المقاوم للقيم الشاذة',
    kpi_totalVolume: 'حجم سوق التوظيف الإجمالي',
    kpi_totalVolumeSub: 'إجمالي الشواغر المفهرسة عالمياً',
    kpi_aiPremium: 'علاوة تعويضات الذكاء الاصطناعي',
    kpi_aiPremiumSub: 'فارق الأجر مقارنة بالوظائف التقليدية',
    kpi_coreNonAi: 'سوق العمل العام والأساسي',
    kpi_coreNonAiSub: 'الوظائف التقنية العامة',
    kpi_aiJobs: 'وظائف الذكاء الاصطناعي والتعلم الآلي',
    kpi_aiJobsSub: 'أدوار متخصصة ونادرة',
    kpi_activeEmployers: 'الشركات النشطة',

    // Pinned DAX
    pinnedDaxTitle: 'مقاييس DAX المخصصة والمثبتة',
    pinnedDaxSubtitle: 'يتم احتسابها ديناميكياً وفق نطاق التصفية النشط',
    unpinMeasure: 'إلغاء تثبيت المقياس',

    // Visual Card Actions & Headers
    visualFocusMode: 'وضع التركيز',
    visualExportData: 'تصدير البيانات كجدول',
    visualViewDax: 'عرض مقياس DAX',
    visualBackToReport: 'العودة للتقرير الرئيسي',
    clickToDrill: 'انقر للتعمق في البيانات (Drill-Through)',
    crossFilterHint: 'تصفية تفاعلية مرتبطة',
    tableView: 'عرض الجدول',
    chartView: 'عرض المخطط البياني',

    // Chart Titles & Subtitles
    chart_demandTrends: 'اتجاهات نشر الوظائف الشهرية وحجم الطلب',
    chart_demandTrendsSub: 'مخطط مساحي وخطّي • يوضح نمو الطلب الكلي ونمو وظائف الذكاء الاصطناعي',
    chart_categoryDist: 'توزيع إعلانات الوظائف حسب القطاع التقني',
    chart_categoryDistSub: 'مخطط شريطي متداخل • انقر فوق أي شريط للتعمق في تفاصيل القطاع',
    chart_topSkills: 'المهارات التقنية الأكثر طلباً في السوق',
    chart_topSkillsSub: 'مخطط شريطي أفقي • انقر على المهارة للتعمق في الوظائف المرتبطة بها',
    chart_modalityDist: 'توزيع أنماط العمل (عن بُعد، هجين، مكتبي)',
    chart_modalityDistSub: 'مخطط دونات دائري • انقر على أي جزء للتصفية المتقاطعة',
    chart_geoTreemap: 'شجرة التوزيع الجغرافي والقطاعي (Treemap)',
    chart_geoTreemapSub: 'شجرة هرمية تفاعلية • تعكس الحجم والرواتب لكل دولة وتخصص',
    chart_salaryCurve: 'منحنى تدرج الرواتب حسب المستوى الوظيفي',
    chart_salaryCurveSub: 'مخطط خطي • مقارنة المتوسط والوسيط عبر مستويات الخبرة',
    chart_salaryByCategory: 'متوسط الرواتب السنوية حسب القطاع التقني',
    chart_salaryByCategorySub: 'مخطط شريطي أفقي • استكشاف أعلى القطاعات دخلاً',
    chart_aiConcentration: 'نسبة تركيز وظائف الذكاء الاصطناعي حسب القطاع',
    chart_aiConcentrationSub: 'مخطط أعمدة • القطاعات الأكثر تبنياً لتقنيات الذكاء الاصطناعي',
    chart_remoteAiVsNonAi: 'تبني العمل عن بُعد: وظائف الذكاء الاصطناعي مقابل الوظائف العامة',
    chart_remoteAiVsNonAiSub: 'مقارنة أنماط العمل بين التخصصات الذكية والتقليدية',
    chart_atsTable: 'سجل شواغر الوظائف الحية (ATS Job Ledger)',
    chart_atsTableSub: 'جدول تفصيلي مباشر مدعوم بالتصفية المتقاطعة والبحث الفوري',

    // Column & Table Headers
    th_jobTitle: 'المسمى الوظيفي',
    th_company: 'الشركة / جهة التوظيف',
    th_category: 'القطاع التقني',
    th_location: 'الموقع الجغرافي',
    th_modality: 'نمط العمل',
    th_aiRole: 'تخصص ذكاء اصطناعي',
    th_avgSalary: 'متوسط الراتب السنوي',
    th_actions: 'الإجراءات',
    th_share: 'الحصة السوقية %',
    th_postingsCount: 'عدد الإعلانات',
    th_demandIndex: 'مؤشر الطلب',
    th_growth: 'معدل النمو',
    th_seniorityTier: 'المستوى الوظيفي',

    col_jobTitle: 'المسمى الوظيفي',
    col_company: 'الشركة',
    col_category: 'القطاع',
    col_location: 'الموقع الجغرافي',
    col_modality: 'نمط العمل',
    col_aiRole: 'دور ذكاء اصطناعي',
    col_salary: 'الراتب السنوي',
    col_actions: 'الإجراءات',
    col_share: 'الحصة السوقية %',
    col_postingsCount: 'عدد الوظائف',
    col_marketShare: 'الحصة السوقية',
    col_growth: 'النمو السنوي',

    // Drill-Through Overlay
    drill_title: 'مستكشف البيانات التفصيلي (Power BI Drill-Through)',
    drill_subtitle: 'استعراض البيانات المجهرية وسجلات الوظائف الفردية للنطاق المحدد',
    drill_applyAsSlicer: 'تطبيق كمرشح رئيسي في اللوحة',
    drill_tabJobs: 'قائمة الوظائف الفردية',
    drill_tabEmployers: 'كبار أصحاب العمل والشركات',
    drill_tabSkills: 'المهارات الأكثر طلباً',
    drill_tabSeniority: 'توزيع مستويات الخبرة',
    drill_searchPlaceholder: 'بحث في المسميات الوظيفية أو الشركات أو المهارات...',
    drill_backToReport: 'العودة للتقرير',
    drill_exportCsv: 'تصدير السجلات (CSV)',
    drill_viewJobDetails: 'تفاصيل الوظيفة الكاملة',
    drill_requiredSkills: 'المهارات والكفاءات المطلوبة',
    drill_employmentType: 'نوع التوظيف',
    drill_postedDate: 'تاريخ النشر',
    drill_close: 'إغلاق',

    // DAX Playground
    dax_title: 'مختبر ومعالج مقاييس DAX التفاعلي',
    dax_subtitle: 'محاكاة كاملة لمحرك DAX Analysis Services مع إمكانية التثبيت المباشر للوحة القيادة',
    dax_tabTemplates: 'نماذج DAX القياسية',
    dax_tabBuilder: 'بناء مقياس مخصص',
    dax_formula: 'صيغة المعادلة (DAX Expression)',
    dax_result: 'النتيجة المحسوبة فورياً',
    dax_pinToRibbon: 'تثبيت في شريط المؤشرات الرئيسي',
    dax_pinnedSuccess: 'تم تثبيت المقياس في شريط المؤشرات الرئيسي بنجاح',
    dax_copyCode: 'نسخ الكود',
    dax_copied: 'تم النسخ',
    dax_measureName: 'اسم المقياس',
    dax_aggregation: 'دالة التجميع',
    dax_targetField: 'الحقل المستهدف',
    dax_filterClauses: 'شروط التصفية (Filter Clauses)',

    // Executive Report
    rep_title: 'الموجز التنفيذي لسوق العمل والرواتب',
    rep_subtitle: 'تقرير معتمد لمجالس الإدارة واستراتيجيات التوظيف والتعويضات',
    rep_printPdf: 'طباعة التقرير / تصدير PDF',
    rep_copyMarkdown: 'نسخ نص التقرير (Markdown)',
    rep_exportHtml: 'تصدير تقرير HTML',
    rep_generatedDate: 'تاريخ التوليد',
    rep_keyFindings: 'أبرز الاستنتاجات التنفيذية',
    rep_strategicRecs: 'التوصيات الاستراتيجية للموارد البشرية',
    rep_aiCompParity: 'توازن تعويضات الذكاء الاصطناعي',
    rep_distributedTalent: 'المواهب الموزعة عالمياً',
    rep_leadershipDemand: 'الطلب على القيادات والكفاءات العليا',

    // Dataset Manager
    data_title: 'مدير مصادر البيانات ومجموعات العمل',
    data_tabUpload: 'رفع ملف CSV / JSON',
    data_tabPaste: 'لصق بيانات CSV',
    data_tabAddSingle: 'إضافة وظيفة مفردة',
    data_uploadPrompt: 'اسحب وأفلت ملف CSV أو JSON هنا، أو انقر للاختيار من جهازك',
    data_uploadSupported: 'يدعم ملفات ATS وتصدير منصات التوظيف القياسية',
    data_downloadTemplate: 'تحميل نموذج CSV تجريبي',
    data_preview: 'معاينة السجلات قبل الاستيراد',
    data_apply: 'تطبيق مجموعة البيانات على اللوحة',
    data_restoreDefault: 'استعادة مجموعة البيانات الافتراضية',

    // Live Job Search
    live_title: 'البحث المباشر وتغذية الوظائف العالمية',
    live_subtitle: 'مزامنة فورية مع إعلانات الوظائف الحية ودمجها في تقرير Power BI',
    live_searchPlaceholder: 'ابحث بالمسمى الوظيفي أو الكلمات المفتاحية أو المهارات...',
    live_mergeSelected: 'دمج الوظائف المحددة في التقرير',
    live_replaceAll: 'استبدال مجموعة البيانات بالكامل',
    live_source: 'المصدر',
    live_applyNow: 'تقديم عبر المصدر',

    // Footer
    footer_title: 'منصة تحليلات سوق العمل العالمي والذكاء الاصطناعي • Power BI Intelligence Dashboard',
    footer_updated: 'تم التحديث في',
    footer_postingsCount: 'إعلان وظيفي مفهرس',
    footer_dataNote: 'بيانات مجمعة من مصادر ATS متعددة ومحدثة دورياً',
  },

  en: {
    // Header
    appTitle: 'Labor Market Analytics',
    appSubtitle: 'Global Workforce & Tech Compensation Insights',
    liveJobSearch: 'Live Public Feed',
    daxPlayground: 'DAX Playground',
    executiveReport: 'Executive Briefing',
    importDataset: 'Dataset Manager',
    exportCsv: 'Export CSV',
    resetFilters: 'Reset Slicers',
    customDatasetActive: 'Custom Dataset Active',
    defaultDataset: 'Default Global Dataset',
    filterApplied: 'Filters Active',
    language: 'Language',
    currency: 'Currency',

    // Bookmarks
    bookmarksTitle: 'Power BI Bookmarks & Views',
    saveCurrentView: 'Bookmark Current View',
    bookmarkNamePrompt: 'Enter a name for this custom view:',
    bookmarkSaved: 'View successfully bookmarked',
    resetToDefault: 'Default',
    activeView: 'Active View',

    // Default Bookmarks
    bm_aiHighPremium: 'High AI Premium Roles',
    bm_aiHighPremiumDesc: 'Top-earning specialized artificial intelligence & ML positions',
    bm_remoteGlobal: '100% Remote Global Roles',
    bm_remoteGlobalDesc: 'Explore international opportunities with fully distributed work',
    bm_techCorridors: 'US & EU Tech Hubs',
    bm_techCorridorsDesc: 'Top compensation tech markets across North America and Europe',
    bm_leadership: 'Principal & Senior Leadership',
    bm_leadershipDesc: 'Senior, Lead, Staff, and Executive level postings',
    bm_cloudCyber: 'Cloud & Cyber Infrastructure',
    bm_cloudCyberDesc: 'Postings across distributed systems, DevOps, and security',

    // Report Tabs
    tab_executive: 'Executive Overview',
    tab_marketDemand: 'Market Demand & Skills',
    tab_geographic: 'Geographic Intelligence',
    tab_salary: 'Salary & Compensation',
    tab_ai: 'AI Impact & Premium',

    // Slicers Bar
    slicersTitle: 'Filters & Slicers',
    slicerCountry: 'Country / Market',
    slicerCategory: 'Job Category',
    slicerModality: 'Workplace Modality',
    slicerAI: 'AI Specialization',
    slicerSeniority: 'Seniority Level',
    all: 'All',
    allCountries: 'All Countries',
    allCategories: 'All Categories',
    allModalities: 'All Modalities',
    allAI: 'All Roles',
    allSeniority: 'All Levels',
    allRoles: 'All Roles',
    activeFiltersCount: 'Filters Applied',
    clearAllSlicers: 'Clear All Filters',

    // Modal / Slicer values
    mod_remote: 'Remote',
    mod_hybrid: 'Hybrid',
    mod_onsite: 'On-site',

    ai_yes: 'AI Roles Only',
    ai_no: 'Non-AI Core',

    sen_entry: 'Entry Level',
    sen_mid: 'Mid Level',
    sen_senior: 'Senior / Lead',
    sen_staff: 'Staff / Principal',

    // KPI Cards
    kpi_activePostings: 'Total Active Postings',
    kpi_activePostingsSub: 'Indexed Job Requisitions',
    kpi_totalJobs: 'Total Job Postings',
    kpi_yoyGrowth: 'YoY Demand Velocity',
    kpi_yoyGrowthSub: 'Compared to Prior Period',
    kpi_remoteAdoption: 'Remote Adoption Rate',
    kpi_remoteAdoptionSub: 'Remote + Hybrid Combined',
    kpi_remoteShare: 'Remote Share %',
    kpi_aiShare: 'AI Role Concentration',
    kpi_aiShareSub: 'Of Total Market Demand',
    kpi_benchmarkSalary: 'Mean Benchmark Pay',
    kpi_benchmarkSalarySub: 'Annualized Compensation',
    kpi_avgSalary: 'Average Salary',
    kpi_medianSalary: 'Median Wage (P50)',
    kpi_medianSalarySub: 'Resistant to Outliers',
    kpi_totalVolume: 'Market Volume Run-rate',
    kpi_totalVolumeSub: 'Worldwide Demand Feed',
    kpi_aiPremium: 'AI Compensation Premium',
    kpi_aiPremiumSub: 'Over Non-AI Baseline Pay',
    kpi_coreNonAi: 'Core Tech & Traditional Demand',
    kpi_coreNonAiSub: 'General Engineering & Business',
    kpi_aiJobs: 'Specialized Machine Learning & AI',
    kpi_aiJobsSub: 'High-Demand Specialized Tiers',
    kpi_activeEmployers: 'Active Employers',

    // Pinned DAX
    pinnedDaxTitle: 'Custom Pinned DAX Measures',
    pinnedDaxSubtitle: 'Computed dynamically against active filter context',
    unpinMeasure: 'Unpin Measure',

    // Visual Card Actions & Headers
    visualFocusMode: 'Focus Mode',
    visualExportData: 'Export Data Grid',
    visualViewDax: 'Inspect DAX Measure',
    visualBackToReport: 'Back to Report Canvas',
    clickToDrill: 'Click to Drill-Through',
    crossFilterHint: 'Cross-filtering active',
    tableView: 'Table View',
    chartView: 'Chart View',

    // Chart Titles & Subtitles
    chart_demandTrends: 'Monthly Hiring Demand & Postings Trajectory',
    chart_demandTrendsSub: 'Stacked Area + Line Visual • Total Market Demand vs. AI Surge',
    chart_categoryDist: 'Requisition Volume by Tech Specialization',
    chart_categoryDistSub: 'Interactive Bar Chart • Click any bar to drill-through into microdata',
    chart_topSkills: 'Most In-Demand Skills & Competencies',
    chart_topSkillsSub: 'Horizontal Bar Chart • Click skill to drill-through matching jobs',
    chart_modalityDist: 'Workplace Modality Distribution (Remote / Hybrid / On-site)',
    chart_modalityDistSub: 'Donut Chart • Click slice to cross-filter entire dashboard canvas',
    chart_geoTreemap: 'Global Geographic & Category Treemap',
    chart_geoTreemapSub: 'Hierarchical Treemap • Sized by Requisitions, Colored by Compensation',
    chart_salaryCurve: 'Compensation Progression Curve by Seniority Tier',
    chart_salaryCurveSub: 'Multi-line Visual • Average vs Median Salary across Experience Tiers',
    chart_salaryByCategory: 'Average Annual Compensation by Category',
    chart_salaryByCategorySub: 'Bar Chart • Ranked by mean annualized salary packages',
    chart_aiConcentration: 'AI Requisition Density by Category',
    chart_aiConcentrationSub: 'Column Visual • Share of requisitions mandating AI/ML capabilities',
    chart_remoteAiVsNonAi: 'Remote Adoption: AI vs Traditional Technical Roles',
    chart_remoteAiVsNonAiSub: 'Grouped Bar Visual • Workplace flexibility across domains',
    chart_atsTable: 'ATS Job Postings Ledger & Data Grid',
    chart_atsTableSub: 'Microdata tabular feed with real-time cross-filtering and search',

    // Column & Table Headers
    th_jobTitle: 'Job Title',
    th_company: 'Company',
    th_category: 'Category',
    th_location: 'Location',
    th_modality: 'Modality',
    th_aiRole: 'AI Role',
    th_avgSalary: 'Salary (Avg)',
    th_actions: 'Actions',
    th_share: 'Share %',
    th_postingsCount: 'Postings Count',
    th_demandIndex: 'Demand Index',
    th_growth: 'YoY Growth',
    th_seniorityTier: 'Seniority Tier',

    col_jobTitle: 'Job Title',
    col_company: 'Company',
    col_category: 'Category',
    col_location: 'Location',
    col_modality: 'Modality',
    col_aiRole: 'AI Role',
    col_salary: 'Salary (Avg)',
    col_actions: 'Actions',
    col_share: 'Share %',
    col_postingsCount: 'Postings Count',
    col_marketShare: 'Market Share',
    col_growth: 'YoY Growth',

    // Drill-Through Overlay
    drill_title: 'Power BI Drill-Through Microdata Explorer',
    drill_subtitle: 'Detailed record-level drilldown and employer analytics for active scope',
    drill_applyAsSlicer: 'Pin as Active Slicer',
    drill_tabJobs: 'Job Postings Microdata',
    drill_tabEmployers: 'Hiring Employers',
    drill_tabSkills: 'Required Skills',
    drill_tabSeniority: 'Seniority Tiers',
    drill_searchPlaceholder: 'Search titles, companies, or skills...',
    drill_backToReport: 'Back to Report',
    drill_exportCsv: 'Export CSV',
    drill_viewJobDetails: 'Detailed Requisition Inspector',
    drill_requiredSkills: 'Required Competencies & Technologies',
    drill_employmentType: 'Employment Type',
    drill_postedDate: 'Posted Date',
    drill_close: 'Close',

    // DAX Playground
    dax_title: 'Power BI DAX Formula Playground',
    dax_subtitle: 'Test, write, and compute dynamic DAX analytical measures on active dataset',
    dax_tabTemplates: 'DAX Formula Library',
    dax_tabBuilder: 'Interactive Measure Builder',
    dax_formula: 'DAX Expression',
    dax_result: 'Calculated Value',
    dax_pinToRibbon: 'Pin to Dashboard KPI Ribbon',
    dax_pinnedSuccess: 'Pinned measure to your active KPI ribbon!',
    dax_copyCode: 'Copy Code',
    dax_copied: 'Copied',
    dax_measureName: 'Measure Name',
    dax_aggregation: 'Aggregation Function',
    dax_targetField: 'Target Field',
    dax_filterClauses: 'Filter Clauses (CALCULATE)',

    // Executive Report
    rep_title: 'Executive Labor Market Intelligence Briefing',
    rep_subtitle: 'Board-ready executive briefing with compensation benchmarks and strategic takeaways',
    rep_printPdf: 'Print to PDF',
    rep_copyMarkdown: 'Copy Briefing (Markdown)',
    rep_exportHtml: 'Export HTML',
    rep_generatedDate: 'Generated Date',
    rep_keyFindings: 'Key Executive Findings',
    rep_strategicRecs: 'Strategic Workforce Recommendations',
    rep_aiCompParity: 'AI Comp Parity',
    rep_distributedTalent: 'Distributed Talent',
    rep_leadershipDemand: 'Senior Leadership Demand',

    // Dataset Manager
    data_title: 'Data Source & Dataset Manager',
    data_tabUpload: 'Upload CSV / JSON',
    data_tabPaste: 'Paste CSV Text',
    data_tabAddSingle: 'Add Single Posting',
    data_uploadPrompt: 'Drag and drop your CSV or JSON file here, or click to browse',
    data_uploadSupported: 'Supports standard ATS and job board export files',
    data_downloadTemplate: 'Download Sample CSV Template',
    data_preview: 'Ingestion Preview',
    data_apply: 'Apply Dataset to Dashboard',
    data_restoreDefault: 'Restore Default Dataset',

    // Live Job Search
    live_title: 'Live Public Job Search & Stream Sync',
    live_subtitle: 'Search live job feeds worldwide and merge postings directly into your Power BI dataset',
    live_searchPlaceholder: 'Search by title, keywords, or skills (e.g. Machine Learning, React)...',
    live_mergeSelected: 'Merge Selected Postings',
    live_replaceAll: 'Replace Dataset Entirely',
    live_source: 'Source',
    live_applyNow: 'View Link',

    // Footer
    footer_title: 'Global Labor Market & AI Intelligence Dashboard • Power BI Report',
    footer_updated: 'Updated',
    footer_postingsCount: 'Indexed Postings',
    footer_dataNote: 'Multi-source ATS aggregation updated periodically',
  }
};

export const CATEGORY_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'Technology': { ar: 'التقنية وهندسة البرمجيات', en: 'Technology' },
  'Data & AI': { ar: 'البيانات والذكاء الاصطناعي', en: 'Data & AI' },
  'Finance': { ar: 'المالية والاستثمار', en: 'Finance' },
  'Healthcare': { ar: 'الرعاية الصحية والطب', en: 'Healthcare' },
  'Marketing': { ar: 'التسويق الرقمي والنمو', en: 'Marketing' },
  'Sales': { ar: 'المبيعات وتطوير الأعمال', en: 'Sales' },
  'Design': { ar: 'التصميم وتجربة المستخدم', en: 'Design' },
  'Human Resources': { ar: 'الموارد البشرية والمواهب', en: 'Human Resources' },
  'Operations': { ar: 'العمليات وسلاسل الإمداد', en: 'Operations' },
  'Legal': { ar: 'الشؤون القانونية والامتثال', en: 'Legal' },
};

export const COUNTRY_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'United States': { ar: 'الولايات المتحدة', en: 'United States' },
  'United Kingdom': { ar: 'المملكة المتحدة', en: 'United Kingdom' },
  'Germany': { ar: 'ألمانيا', en: 'Germany' },
  'Canada': { ar: 'كندا', en: 'Canada' },
  'Australia': { ar: 'أستراليا', en: 'Australia' },
  'France': { ar: 'فرنسا', en: 'France' },
  'Netherlands': { ar: 'هولندا', en: 'Netherlands' },
  'India': { ar: 'الهند', en: 'India' },
  'Saudi Arabia': { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
  'United Arab Emirates': { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates' },
  'Singapore': { ar: 'سنغافورة', en: 'Singapore' },
  'Switzerland': { ar: 'سويسرا', en: 'Switzerland' },
  'Japan': { ar: 'اليابان', en: 'Japan' },
};

export const MODALITY_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'Remote': { ar: 'عن بُعد', en: 'Remote' },
  'Hybrid': { ar: 'هجين', en: 'Hybrid' },
  'On-site': { ar: 'حضوري / مكتبي', en: 'On-site' },
};

export const SENIORITY_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'Entry Level': { ar: 'مبتدئ / خريج', en: 'Entry Level' },
  'Entry-level': { ar: 'مبتدئ / خريج', en: 'Entry-level' },
  'Mid Level': { ar: 'متوسط الخبرة', en: 'Mid Level' },
  'Mid-level': { ar: 'متوسط الخبرة', en: 'Mid-level' },
  'Senior': { ar: 'أول / خبير', en: 'Senior' },
  'Lead': { ar: 'قائد فريق / تقني', en: 'Lead' },
  'Lead / Staff': { ar: 'رئيسي / تنفيذي', en: 'Lead / Staff' },
  'Manager': { ar: 'مدير إدارة', en: 'Manager' },
  'Director': { ar: 'مدير تنفيذي / قطاع', en: 'Director' },
  'Executive': { ar: 'قيادي تنفيذي أول', en: 'Executive' },
};

export function translateCategory(cat: string, lang?: Language | string): string {
  const l: Language = lang === 'en' ? 'en' : 'ar';
  if (cat === 'All') return l === 'ar' ? 'جميع التخصصات' : 'All Categories';
  return CATEGORY_TRANSLATIONS[cat]?.[l] || cat;
}

export function translateCountry(country: string, lang?: Language | string): string {
  const l: Language = lang === 'en' ? 'en' : 'ar';
  if (country === 'All') return l === 'ar' ? 'جميع الدول' : 'All Countries';
  return COUNTRY_TRANSLATIONS[country]?.[l] || country;
}

export function translateModality(mod: string, lang?: Language | string): string {
  const l: Language = lang === 'en' ? 'en' : 'ar';
  if (mod === 'All') return l === 'ar' ? 'جميع الأنماط' : 'All Modalities';
  return MODALITY_TRANSLATIONS[mod]?.[l] || mod;
}

export function translateSeniority(sen: string, lang?: Language | string): string {
  const l: Language = lang === 'en' ? 'en' : 'ar';
  if (sen === 'All') return l === 'ar' ? 'جميع المستويات' : 'All Tiers';
  return SENIORITY_TRANSLATIONS[sen]?.[l] || sen;
}

export function translateAI(ai: string, lang?: Language | string): string {
  const l: Language = lang === 'en' ? 'en' : 'ar';
  if (ai === 'All') return l === 'ar' ? 'جميع الوظائف' : 'All Roles';
  if (ai === 'Yes') return l === 'ar' ? 'وظائف ذكاء اصطناعي فقط' : 'AI Roles Only';
  if (ai === 'No') return l === 'ar' ? 'وظائف عامة (غير ذكاء اصطناعي)' : 'Non-AI Core Only';
  return ai;
}

export function useTranslation(lang?: Language | string) {
  const resolvedLang: Language = lang === 'en' ? 'en' : 'ar';
  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = (translations[resolvedLang] as Record<string, string>) || (translations['ar'] as Record<string, string>);
    let text = dict[key] || (translations['en'] as Record<string, string>)[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }
    return text;
  };

  return { t, lang: resolvedLang, isRTL: resolvedLang === 'ar' };
}
