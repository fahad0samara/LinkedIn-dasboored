import { DaxMeasure, MarketMetrics, SkillItem } from '../types';

export const METRICS_DATA: MarketMetrics = {
  total_jobs: 12000,
  total_companies: 54,
  total_locations: 38,
  total_countries: 8,
  ai_jobs: 596,
  ai_job_percentage: 4.97,
  non_ai_jobs: 11404,
  non_ai_job_percentage: 95.03,
  remote_jobs: 4578,
  remote_job_percentage: 38.15,
  hybrid_job_percentage: 36.4,
  onsite_job_percentage: 25.45,
  salary_disclosure_percentage: 68.55,
  salary_records_count: 8226,
  overall_average_salary_usd: 178573.61,
  overall_median_salary_usd: 158500.0,
  ai_average_salary_usd: 249305.15,
  ai_median_salary_usd: 238500.0,
  non_ai_average_salary_usd: 174882.32,
  non_ai_median_salary_usd: 153000.0,
  ai_salary_premium_pct: 42.56,
  top_category: 'Technology',
  top_category_share_pct: 19.22,
  top_country: 'United States',
  top_country_share_pct: 64.62,
  top_skill: 'Communication',
  top_skill_count: 12000,
  top_skill_percentage: 100.0
};

export const CATEGORY_DATA = [
  { category: 'Technology', jobs: 2306, share: 19.22, avgSalary: 196500, remotePct: 44.2, aiPct: 5.6 },
  { category: 'Data & AI', jobs: 1188, share: 9.90, avgSalary: 212400, remotePct: 41.5, aiPct: 39.2 },
  { category: 'Operations', jobs: 1153, share: 9.61, avgSalary: 142100, remotePct: 22.8, aiPct: 0.0 },
  { category: 'Finance', jobs: 985, share: 8.21, avgSalary: 188300, remotePct: 31.4, aiPct: 0.0 },
  { category: 'Sales', jobs: 959, share: 7.99, avgSalary: 164200, remotePct: 48.6, aiPct: 0.0 },
  { category: 'Marketing', jobs: 944, share: 7.87, avgSalary: 148900, remotePct: 46.1, aiPct: 0.0 },
  { category: 'Human Resources', jobs: 674, share: 5.62, avgSalary: 139500, remotePct: 37.8, aiPct: 0.0 },
  { category: 'Accounting', jobs: 658, share: 5.48, avgSalary: 147800, remotePct: 29.5, aiPct: 0.0 },
  { category: 'Engineering', jobs: 606, share: 5.05, avgSalary: 173600, remotePct: 18.2, aiPct: 0.0 },
  { category: 'Product', jobs: 545, share: 4.54, avgSalary: 198200, remotePct: 49.3, aiPct: 0.0 },
  { category: 'Healthcare', jobs: 505, share: 4.21, avgSalary: 169400, remotePct: 14.6, aiPct: 0.0 },
  { category: 'Management', jobs: 407, share: 3.39, avgSalary: 224800, remotePct: 26.2, aiPct: 0.0 },
  { category: 'Design', jobs: 318, share: 2.65, avgSalary: 162100, remotePct: 52.1, aiPct: 0.0 },
  { category: 'Customer Support', jobs: 307, share: 2.56, avgSalary: 112500, remotePct: 56.4, aiPct: 0.0 },
  { category: 'Legal', jobs: 238, share: 1.98, avgSalary: 218900, remotePct: 28.9, aiPct: 0.0 },
  { category: 'Administration', jobs: 208, share: 1.73, avgSalary: 104200, remotePct: 32.0, aiPct: 0.0 },
];

export const SENIORITY_DATA = [
  { level: 'Internship', jobs: 96, share: 0.80, avgSalary: 48500, medianSalary: 47000 },
  { level: 'Junior', jobs: 438, share: 3.65, avgSalary: 84200, medianSalary: 82000 },
  { level: 'Entry Level', jobs: 982, share: 8.18, avgSalary: 71900, medianSalary: 69000 },
  { level: 'Mid Level', jobs: 3450, share: 28.75, avgSalary: 132400, medianSalary: 128000 },
  { level: 'Senior', jobs: 2887, share: 24.06, avgSalary: 184600, medianSalary: 179000 },
  { level: 'Lead', jobs: 911, share: 7.59, avgSalary: 221500, medianSalary: 215000 },
  { level: 'Manager', jobs: 1652, share: 13.77, avgSalary: 204100, medianSalary: 198000 },
  { level: 'Director', jobs: 982, share: 8.18, avgSalary: 282400, medianSalary: 275000 },
  { level: 'Executive', jobs: 602, share: 5.02, avgSalary: 412000, medianSalary: 395000 },
];

export const COUNTRY_DATA = [
  { country: 'United States', jobs: 7754, share: 64.62, avgSalary: 189400, remotePct: 39.4 },
  { country: 'United Kingdom', jobs: 1344, share: 11.20, avgSalary: 162100, remotePct: 36.8 },
  { country: 'Germany', jobs: 1008, share: 8.40, avgSalary: 158300, remotePct: 32.1 },
  { country: 'France', jobs: 696, share: 5.80, avgSalary: 151200, remotePct: 33.5 },
  { country: 'Canada', jobs: 588, share: 4.90, avgSalary: 164800, remotePct: 41.2 },
  { country: 'Australia', jobs: 384, share: 3.20, avgSalary: 168500, remotePct: 38.0 },
  { country: 'Switzerland', jobs: 132, share: 1.10, avgSalary: 215000, remotePct: 24.2 },
  { country: 'Denmark', jobs: 94, share: 0.78, avgSalary: 161000, remotePct: 28.5 },
];

export const SKILLS_DATA: SkillItem[] = [
  { skill: 'Communication', count: 12000, category: 'Business', type: 'Soft Skill', pct_of_jobs: 100.0 },
  { skill: 'Leadership', count: 4067, category: 'Business', type: 'Management', pct_of_jobs: 33.9 },
  { skill: 'Excel', count: 3105, category: 'Business', type: 'Productivity', pct_of_jobs: 25.9 },
  { skill: 'Git', count: 2548, category: 'Technical', type: 'Version Control', pct_of_jobs: 21.2 },
  { skill: 'Python', count: 2450, category: 'Technical', type: 'Programming Language', pct_of_jobs: 20.4 },
  { skill: 'Project Management', count: 2144, category: 'Business', type: 'Methodology', pct_of_jobs: 17.9 },
  { skill: 'SQL', count: 2037, category: 'Technical', type: 'Database', pct_of_jobs: 17.0 },
  { skill: 'Salesforce', count: 1401, category: 'Business', type: 'CRM', pct_of_jobs: 11.7 },
  { skill: 'AWS', count: 1355, category: 'Technical', type: 'Cloud', pct_of_jobs: 11.3 },
  { skill: 'Docker', count: 1272, category: 'Technical', type: 'DevOps', pct_of_jobs: 10.6 },
  { skill: 'Kubernetes', count: 980, category: 'Technical', type: 'DevOps', pct_of_jobs: 8.2 },
  { skill: 'React', count: 912, category: 'Technical', type: 'Framework', pct_of_jobs: 7.6 },
  { skill: 'Machine Learning', count: 850, category: 'AI & Data', type: 'Core AI/ML', pct_of_jobs: 7.1 },
  { skill: 'PyTorch', count: 590, category: 'AI & Data', type: 'Deep Learning', pct_of_jobs: 4.9 },
  { skill: 'Generative AI / LLM', count: 475, category: 'AI & Data', type: 'GenAI', pct_of_jobs: 4.0 },
  { skill: 'SAP', count: 820, category: 'Business', type: 'Enterprise ERP', pct_of_jobs: 6.8 },
  { skill: 'Figma', count: 410, category: 'Business', type: 'Design', pct_of_jobs: 3.4 },
  { skill: 'Power BI', count: 680, category: 'AI & Data', type: 'BI & Analytics', pct_of_jobs: 5.7 }
];

export const MONTHLY_POSTINGS_DATA = [
  { month: 'Jan', postings: 840, remote: 320, ai: 38, avgSalary: 174000 },
  { month: 'Feb', postings: 920, remote: 350, ai: 42, avgSalary: 175500 },
  { month: 'Mar', postings: 1080, remote: 410, ai: 54, avgSalary: 177200 },
  { month: 'Apr', postings: 1150, remote: 440, ai: 59, avgSalary: 178000 },
  { month: 'May', postings: 1210, remote: 465, ai: 63, avgSalary: 179100 },
  { month: 'Jun', postings: 1180, remote: 450, ai: 61, avgSalary: 178800 },
  { month: 'Jul', postings: 990, remote: 375, ai: 48, avgSalary: 177900 },
  { month: 'Aug', postings: 1040, remote: 395, ai: 52, avgSalary: 178400 },
  { month: 'Sep', postings: 1260, remote: 485, ai: 66, avgSalary: 180200 },
  { month: 'Oct', postings: 1290, remote: 495, ai: 68, avgSalary: 181000 },
  { month: 'Nov', postings: 1120, remote: 430, ai: 56, avgSalary: 179800 },
  { month: 'Dec', postings: 920, remote: 358, ai: 45, avgSalary: 178200 }
];

export const MODALITY_SALARY_DATA = [
  { seniority: 'Entry', remote: 76000, hybrid: 72500, onsite: 67200 },
  { seniority: 'Junior', remote: 88500, hybrid: 85000, onsite: 79100 },
  { seniority: 'Mid', remote: 138000, hybrid: 134200, onsite: 125000 },
  { seniority: 'Senior', remote: 192000, hybrid: 187500, onsite: 174400 },
  { seniority: 'Lead', remote: 228000, hybrid: 224000, onsite: 212500 },
  { seniority: 'Manager', remote: 211000, hybrid: 207500, onsite: 193800 },
  { seniority: 'Director', remote: 292000, hybrid: 285000, onsite: 270200 },
  { seniority: 'Executive', remote: 425000, hybrid: 415000, onsite: 396000 }
];

export const DAX_CATALOG: DaxMeasure[] = [
  {
    name: 'Total Jobs',
    category: 'Volume & Cardinality',
    formula: `Total Jobs = \nCOUNTROWS('FactJobs')`,
    calculation: 'Calculates the total count of distinct job postings in the active filter context.',
    whyNeeded: 'Serves as the master denominator and foundational KPI across all dashboard pages.',
    whereUsed: 'Page 1-5 Top KPI Cards, category matrix, and location breakdowns.'
  },
  {
    name: 'Total Companies',
    category: 'Volume & Cardinality',
    formula: `Total Companies = \nDISTINCTCOUNT('FactJobs'[Company])`,
    calculation: 'Calculates the number of unique employer organizations with active postings.',
    whyNeeded: 'Shows corporate market diversity and ensures demand is not skewed by a single employer.',
    whereUsed: 'Page 1 KPI Card and Page 2 Company Hiring Leaderboard.'
  },
  {
    name: 'Total Locations',
    category: 'Volume & Cardinality',
    formula: `Total Locations = \nDISTINCTCOUNT('FactJobs'[Location])`,
    calculation: 'Calculates distinct geographical hiring cities and metropolitan regions.',
    whyNeeded: 'Quantifies geographical footprint and decentralization of job openings.',
    whereUsed: 'Page 1 KPI Card & Global Location Map.'
  },
  {
    name: 'Remote Job %',
    category: 'Workplace Modality',
    formula: `Remote Job % = \nDIVIDE(\n    CALCULATE([Total Jobs], 'FactJobs'[Is_Remote] = "Yes"),\n    [Total Jobs],\n    0\n)`,
    calculation: 'Computes the proportion of job postings that are 100% remote.',
    whyNeeded: 'Tracks post-2025 workplace flexibility and remote hiring density across industries.',
    whereUsed: 'Page 1 & 2 KPI Cards, Modality Bar Charts, and Category Slicers.'
  },
  {
    name: 'AI Jobs',
    category: 'AI Market Share',
    formula: `AI Jobs = \nCALCULATE(\n    [Total Jobs],\n    'FactJobs'[Is_AI_Job] = "Yes"\n)`,
    calculation: 'Filters and counts postings requiring explicit Artificial Intelligence / ML competencies.',
    whyNeeded: 'Measures true AI hiring footprint without inflating numbers with generic IT/data roles.',
    whereUsed: 'Page 1 Summary Badge, Page 5 AI vs Overall Header KPI.'
  },
  {
    name: 'AI Job %',
    category: 'AI Market Share',
    formula: `AI Job % = \nDIVIDE([AI Jobs], [Total Jobs], 0)`,
    calculation: 'Proportion of specialized AI roles relative to total all-industry employment postings.',
    whyNeeded: 'Directly answers whether AI dominates the labor market or remains a specialized niche (4.97%).',
    whereUsed: 'Page 5 Hero Gauge and Category Comparison Matrix.'
  },
  {
    name: 'Average Salary',
    category: 'Compensation',
    formula: `Average Salary = \nCALCULATE(\n    AVERAGE('FactJobs'[Salary_Avg_USD]),\n    'FactJobs'[Has_Salary] = "Yes"\n)`,
    calculation: 'Calculates the arithmetic mean annual compensation (USD) for jobs with disclosed pay.',
    whyNeeded: 'Provides standard compensation baseline for cross-category and geographic comparisons.',
    whereUsed: 'Page 4 Primary Salary KPI, Category Salary Rank, Seniority Trend.'
  },
  {
    name: 'Median Salary',
    category: 'Compensation',
    formula: `Median Salary = \nCALCULATE(\n    MEDIAN('FactJobs'[Salary_Avg_USD]),\n    'FactJobs'[Has_Salary] = "Yes"\n)`,
    calculation: 'Calculates 50th percentile annual compensation in USD.',
    whyNeeded: 'Resistant to extreme executive compensation outliers, reflecting realistic market pay.',
    whereUsed: 'Page 4 Primary Salary KPI and Seniority Step Chart.'
  },
  {
    name: 'AI Salary Premium %',
    category: 'Compensation & AI',
    formula: `AI Salary Premium % = \nVAR AISal = CALCULATE(AVERAGE('FactJobs'[Salary_Avg_USD]), 'FactJobs'[Has_Salary] = "Yes", 'FactJobs'[Is_AI_Job] = "Yes")\nVAR NonAISal = CALCULATE(AVERAGE('FactJobs'[Salary_Avg_USD]), 'FactJobs'[Has_Salary] = "Yes", 'FactJobs'[Is_AI_Job] = "No")\nRETURN DIVIDE(AISal - NonAISal, NonAISal, 0)`,
    calculation: 'Calculates the percentage markup of AI salaries over traditional job salaries.',
    whyNeeded: 'Evaluates the economic premium attached to AI/ML skills (+42.56% market premium).',
    whereUsed: 'Page 5 Wage Premium Callout Card.'
  },
  {
    name: 'Salary Disclosure %',
    category: 'Compensation Quality',
    formula: `Salary Disclosure % = \nDIVIDE(\n    CALCULATE([Total Jobs], 'FactJobs'[Has_Salary] = "Yes"),\n    [Total Jobs],\n    0\n)`,
    calculation: 'Proportion of total listings that provide transparent salary ranges.',
    whyNeeded: 'Validates statistical sample size and measures pay transparency legislation impact (68.55%).',
    whereUsed: 'Page 4 Data Quality Gauge.'
  },
  {
    name: 'Skill Postings Count',
    category: 'Skills Analysis',
    formula: `Skill Postings Count = \nCALCULATE(\n    DISTINCTCOUNT('DimSkills'[job_id])\n)`,
    calculation: 'Counts unique job postings requiring a specific skill via the DimSkills bridge table.',
    whyNeeded: 'Enables accurate skill rankings without duplicate-counting multifaceted jobs.',
    whereUsed: 'Page 3 Top Skills Ranked Bar Chart.'
  },
  {
    name: 'Skill Penetration %',
    category: 'Skills Analysis',
    formula: `Skill Penetration % = \nDIVIDE([Skill Postings Count], [Total Jobs], 0)`,
    calculation: 'Share of total market postings that mandate a given skill.',
    whyNeeded: 'Normalizes skill demand across changing filter contexts and job categories.',
    whereUsed: 'Page 3 Matrix Heatmap and Skill Category Comparison.'
  }
];

export const KEY_FINDINGS = [
  {
    number: 1,
    title: 'Technology Represents Under One-Fifth of Total Postings',
    titleAr: 'قطاع التقنية يمثل أقل من خُمس إجمالي الوظائف المعلنة',
    stat: '19.22%',
    desc: 'Technology is the largest individual category (2,306 jobs), but over 80% of hiring demand lies in non-tech domains such as Operations (9.6%), Finance (8.2%), Sales (8.0%), and Marketing (7.9%).',
    descAr: 'التقنية هي أكبر قطاع مفرد (2,306 وظيفة)، إلا أن أكثر من 80% من الطلب يتركز في قطاعات أخرى كالعمليات (9.6%) والمالية (8.2%) والمبيعات (8.0%) والتسويق (7.9%).'
  },
  {
    number: 2,
    title: 'AI Roles Represent Exactly 4.97% of the Overall Labor Market',
    titleAr: 'وظائف الذكاء الاصطناعي تمثل 4.97% من إجمالي سوق العمل',
    stat: '4.97%',
    desc: 'Specialized AI/ML roles account for 596 out of 12,000 postings. AI is a high-impact but specialized segment, with 78% concentrated in Data & AI and 22% in core Software Systems.',
    descAr: 'تمثل وظائف الذكاء الاصطناعي وتعلم الآلة 596 من أصل 12,000 وظيفة؛ وهو قطاع عالي التأثير والقيمة، حيث يتركز 78% منها في تخصصات البيانات والذكاء الاصطناعي.'
  },
  {
    number: 3,
    title: 'Substantial AI Wage Premium Across All Seniority Tiers',
    titleAr: 'علاوة رواتب استثنائية لخبراء الذكاء الاصطناعي عبر كافة المستويات',
    stat: '+42.56%',
    desc: 'The average salary for specialized AI roles is $249,305 USD (Median: $238,500 USD), compared to $174,882 USD (Median: $153,000 USD) for non-AI positions.',
    descAr: 'يصل متوسط رواتب أدوار الذكاء الاصطناعي المتخصصة إلى 249,305 دولار (الوسيط: 238,500 دولار)، مقارنة بـ 174,882 دولار (الوسيط: 153,000 دولار) للوظائف التقليدية.'
  },
  {
    number: 4,
    title: 'Remote (38.2%) and Hybrid (36.4%) Outpace On-site (25.5%)',
    titleAr: 'العمل عن بُعد (38.2%) والهجين (36.4%) يتفوقان على الحضور المكتبي (25.5%)',
    stat: '74.55%',
    desc: 'Nearly three-quarters of enterprise postings offer flexible workplace arrangements. Customer Support (56.4%) and Design (52.1%) have the highest remote percentages, while Healthcare (14.6%) is predominantly on-site.',
    descAr: 'ما يقارب ثلاثة أرباع إعلانات الشركات العالمية تتيح ترتيبات عمل مرنة، حيث تتصدر تخصصات التصميم ودعم العملاء أعلى نسب العمل عن بعد.'
  },
  {
    number: 5,
    title: 'Python (20.4%) and SQL (17.0%) Lead Technical Competencies',
    titleAr: 'لغة Python وSQL تتصدران المهارات التقنية الأكثر طلباً',
    stat: 'Top Tech',
    desc: 'Python and SQL remain the universal data and software backbone. Git version control (21.2%), AWS cloud (11.3%), and Docker containers (10.6%) represent core foundational infrastructure skills.',
    descAr: 'تظل بايثون وSQL العمود الفقري للبرمجيات والبيانات، تليهما مهارات البنية السحابية AWS وDocker وإدارة النسخ Git.'
  },
  {
    number: 6,
    title: 'Senior and Mid-Level Roles Make Up 52.8% of Total Hiring',
    titleAr: 'المستويات المتوسطة والخبراء تشكل 52.8% من إجمالي التوظيف',
    stat: '52.81%',
    desc: 'Mid-Level (28.75%) and Senior (24.06%) roles dominate corporate demand. Entry-level openings account for 8.18% and junior positions 3.65%, indicating an ongoing employer preference for experienced autonomous contributors.',
    descAr: 'تهيمن المستويات المتوسطة (28.75%) والخبراء (24.06%) على طلب الشركات، مما يعكس تفضيل أصحاب العمل للمساهمين ذوي الخبرة والاستقلالية.'
  },
  {
    number: 7,
    title: 'High Pay Transparency Compliance in Global Enterprise Postings',
    titleAr: 'التزام مرتفع بشفافية الرواتب ونشر نطاقات الأجور',
    stat: '68.55%',
    desc: 'Over two-thirds of postings publish explicit salary bands, driven by transparency regulations in the US, EU, and UK. Disclosed salaries range from $35,000 to $540,000 USD.',
    descAr: 'أكثر من ثلثي الإعلانات تنشر نطاقات أجور صريحة وفقاً لقوانين الشفافية العالمية، وتتراوح الرواتب المفصح عنها بين 35,000 و 540,000 دولار سنوياً.'
  },
  {
    number: 8,
    title: 'United States Leads Global Volume and Compensation',
    titleAr: 'الولايات المتحدة تتصدر حجم الطلب ومستويات التعويضات العالمية',
    stat: '64.62%',
    desc: 'The US represents 64.62% of analyzed postings with an average salary of $189,400 USD, followed by the United Kingdom (11.20% share, $162,100 USD average) and Germany (8.40% share, $158,300 USD average).',
    descAr: 'تمثل الولايات المتحدة 64.62% من الوظائف المحللة بمتوسط راتب 189,400 دولار، تليها المملكة المتحدة (11.20%) وألمانيا (8.40%).'
  }
];

export const SAMPLE_JOBS = [
  { id: 'REQ-10001', title: 'Operations Manager', company: 'Pfizer', cat: 'Operations', sen: 'Manager', mod: 'On-site', ai: 'No', sal: 165000, loc: 'Seattle, WA, United States', skills: 'Project Management, Leadership, Process Improvement' },
  { id: 'REQ-10002', title: '.NET Core Developer', company: 'Meta', cat: 'Technology', sen: 'Senior', mod: 'Remote', ai: 'No', sal: 181500, loc: 'Seattle, WA, United States', skills: '.NET, C#, Azure, SQL, Git' },
  { id: 'REQ-10003', title: 'Generative AI Solutions Architect', company: 'Microsoft', cat: 'Data & AI', sen: 'Lead', mod: 'Hybrid', ai: 'Yes', sal: 285000, loc: 'San Francisco, CA, United States', skills: 'Python, LLM, Generative AI, AWS, Azure, Leadership' },
  { id: 'REQ-10004', title: 'Senior Financial Analyst', company: 'Stripe', cat: 'Finance', sen: 'Senior', mod: 'Remote', ai: 'No', sal: 175000, loc: 'New York, NY, United States', skills: 'Excel, Financial Modeling, SQL, Communication' },
  { id: 'REQ-10005', title: 'Lead Data Engineer', company: 'Snowflake', cat: 'Data & AI', sen: 'Lead', mod: 'Hybrid', ai: 'No', sal: 230000, loc: 'Boston, MA, United States', skills: 'Python, SQL, AWS, Docker, Kubernetes' },
  { id: 'REQ-10006', title: 'Corporate Counsel', company: 'Baker McKenzie', cat: 'Legal', sen: 'Senior', mod: 'Hybrid', ai: 'No', sal: 245000, loc: 'London, United Kingdom', skills: 'Contract Negotiation, Compliance, Communication' },
  { id: 'REQ-10007', title: 'Machine Learning Engineer', company: 'OpenAI', cat: 'Data & AI', sen: 'Mid Level', mod: 'On-site', ai: 'Yes', sal: 215000, loc: 'San Francisco, CA, United States', skills: 'Python, PyTorch, Machine Learning, Docker, Git' },
  { id: 'REQ-10008', title: 'Senior Product Designer', company: 'Figma', cat: 'Design', sen: 'Senior', mod: 'Remote', ai: 'No', sal: 190000, loc: 'Remote, United States', skills: 'Figma, Design Systems, User Research, Leadership' },
  { id: 'REQ-10009', title: 'Cloud Infrastructure Architect', company: 'SAP', cat: 'Technology', sen: 'Lead', mod: 'Hybrid', ai: 'No', sal: 185000, loc: 'Munich, Germany', skills: 'AWS, Kubernetes, Docker, Linux, Terraform' },
  { id: 'REQ-10010', title: 'Senior Talent Acquisition Lead', company: 'L\'Oréal', cat: 'Human Resources', sen: 'Manager', mod: 'Hybrid', ai: 'No', sal: 148000, loc: 'Paris, France', skills: 'Recruiting, Workday, Employer Branding, Leadership' },
  { id: 'REQ-10011', title: 'Principal Full Stack Engineer', company: 'Shopify', cat: 'Technology', sen: 'Lead', mod: 'Remote', ai: 'No', sal: 210000, loc: 'Toronto, Canada', skills: 'React, TypeScript, Ruby, GraphQL, AWS' },
  { id: 'REQ-10012', title: 'Staff AI Research Scientist', company: 'Google DeepMind', cat: 'Data & AI', sen: 'Lead', mod: 'Hybrid', ai: 'Yes', sal: 320000, loc: 'London, United Kingdom', skills: 'PyTorch, Python, LLM, Deep Learning, Mathematics' },
  { id: 'REQ-10013', title: 'Enterprise Account Executive', company: 'Salesforce', cat: 'Sales', sen: 'Senior', mod: 'Remote', ai: 'No', sal: 195000, loc: 'Sydney, Australia', skills: 'Salesforce, CRM, Negotiation, Enterprise Sales' },
  { id: 'REQ-10014', title: 'Clinical Data Manager', company: 'Novartis', cat: 'Healthcare', sen: 'Mid Level', mod: 'On-site', ai: 'No', sal: 162000, loc: 'Basel, Switzerland', skills: 'Clinical Trials, CDISC, SAS, Excel, Data Quality' },
  { id: 'REQ-10015', title: 'Senior Industrial Automation Engineer', company: 'Schneider Electric', cat: 'Engineering', sen: 'Senior', mod: 'On-site', ai: 'No', sal: 172000, loc: 'Grenoble, France', skills: 'PLC, SCADA, Industrial IoT, Electrical Engineering' },
  { id: 'REQ-10016', title: 'Senior Risk & Compliance Officer', company: 'Novo Nordisk', cat: 'Finance', sen: 'Senior', mod: 'Hybrid', ai: 'No', sal: 168000, loc: 'Copenhagen, Denmark', skills: 'Compliance, Risk Management, Audit, Financial Analysis' }
];
