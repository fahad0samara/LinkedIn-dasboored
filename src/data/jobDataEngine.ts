import { JobRecord, MarketMetrics, SkillItem } from '../types';
import { CATEGORY_DATA, COUNTRY_DATA, SENIORITY_DATA, METRICS_DATA } from './jobData';

// Top companies by country
export const COMPANIES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['Microsoft', 'Google', 'Apple', 'Amazon', 'Meta', 'NVIDIA', 'Stripe', 'Salesforce', 'OpenAI', 'Snowflake', 'Netflix', 'Adobe', 'Pfizer', 'JPMorgan Chase', 'Goldman Sachs', 'Tesla', 'Uber', 'Airbnb', 'Databricks', 'Cisco'],
  'United Kingdom': ['DeepMind', 'Barclays', 'HSBC', 'AstraZeneca', 'Unilever', 'Arm Holdings', 'BP', 'Revolut', 'Deliveroo', 'Vodafone', 'Baker McKenzie'],
  'Germany': ['SAP', 'Siemens', 'BMW Group', 'Mercedes-Benz', 'Bosch', 'Allianz', 'Bayer', 'Deutsche Bank', 'Delivery Hero', 'Infineon'],
  'France': ['L\'Oréal', 'Schneider Electric', 'TotalEnergies', 'BNP Paribas', 'Airbus', 'Sanofi', 'Capgemini', 'Dassault Systèmes', 'Ubisoft'],
  'Canada': ['Shopify', 'RBC', 'TD Bank', 'Thomson Reuters', 'OpenText', 'CGI', 'BlackBerry', 'Lululemon', 'Manulife'],
  'Australia': ['Atlassian', 'Canva', 'Commonwealth Bank', 'BHP', 'Macquarie Group', 'Telstra', 'CSL', 'Rio Tinto'],
  'Switzerland': ['Roche', 'Novartis', 'UBS', 'ABB', 'Swisscom', 'Logitech', 'CERN', 'Nestlé', 'Zurich Insurance', 'On Running', 'Sonova'],
  'Denmark': ['Novo Nordisk', 'Maersk', 'Vestas', 'Carlsberg', 'Lego Group', 'DSV', 'Genmab', 'Pandora']
};

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA'],
  'United Kingdom': ['London', 'Cambridge', 'Manchester', 'Edinburgh', 'Bristol'],
  'Germany': ['Munich', 'Berlin', 'Frankfurt', 'Stuttgart', 'Hamburg'],
  'France': ['Paris', 'Lyon', 'Grenoble', 'Toulouse', 'Nantes'],
  'Canada': ['Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Ottawa, ON'],
  'Australia': ['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD'],
  'Switzerland': ['Zurich', 'Basel', 'Geneva', 'Lausanne', 'Bern'],
  'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Billund']
};

export const ROLE_TITLES_BY_CATEGORY: Record<string, string[]> = {
  'Technology': [
    'Senior Software Engineer', 'Full Stack Developer', '.NET Core Developer', 'Frontend Architect', 
    'Backend Engineer', 'DevOps Platform Engineer', 'Cloud Solutions Architect', 'Systems Infrastructure Lead',
    'Site Reliability Engineer', 'Cybersecurity Specialist', 'iOS Mobile Engineer', 'API Integration Engineer'
  ],
  'Data & AI': [
    'Machine Learning Engineer', 'Generative AI Solutions Architect', 'Lead Data Engineer', 
    'Staff AI Research Scientist', 'Senior Data Scientist', 'AI Ethics & Governance Lead',
    'Computer Vision Engineer', 'NLP Data Scientist', 'BI Analytics Engineer', 'Data Platform Architect'
  ],
  'Operations': [
    'Operations Manager', 'Director of Global Supply Chain', 'Process Optimization Lead',
    'Logistics Operations Specialist', 'VP of Business Operations', 'Strategic Program Manager'
  ],
  'Finance': [
    'Senior Financial Analyst', 'Director of Corporate FP&A', 'Risk & Compliance Officer',
    'Quantitative Portfolio Analyst', 'Treasury Operations Lead', 'Investment Controller'
  ],
  'Sales': [
    'Enterprise Account Executive', 'VP of Global Sales', 'Sales Development Representative',
    'Commercial Account Director', 'Strategic Partnerships Lead', 'Customer Revenue Manager'
  ],
  'Marketing': [
    'VP of Growth Marketing', 'Senior Performance Marketing Manager', 'Product Marketing Lead',
    'Brand Strategy Director', 'Content Operations Lead', 'Digital Marketing Specialist'
  ],
  'Human Resources': [
    'Senior Talent Acquisition Lead', 'VP of People Operations', 'Global Total Rewards Manager',
    'HR Business Partner', 'Employee Experience Director', 'HRIS Specialist'
  ],
  'Accounting': [
    'Senior Corporate Accountant', 'Accounting Director', 'Senior Tax Consultant',
    'Internal Audit Manager', 'Financial Controller', 'Cost Accounting Specialist'
  ],
  'Engineering': [
    'Senior Industrial Automation Engineer', 'Mechanical Systems Architect', 'Electrical Engineer',
    'Hardware Quality Engineer', 'Robotics Systems Lead', 'Embedded Firmware Engineer'
  ],
  'Product': [
    'Principal Product Manager', 'Group Product Manager', 'Technical Product Manager',
    'Director of Product Strategy', 'Associate Product Manager', 'VP of Product Innovation'
  ],
  'Healthcare': [
    'Clinical Data Manager', 'Biomedical Regulatory Associate', 'Clinical Research Director',
    'Medical Informatics Specialist', 'Healthcare Compliance Lead', 'Pharmacovigilance Officer'
  ],
  'Management': [
    'Managing Director', 'Chief of Staff', 'General Manager', 'Operations VP', 'Strategy Director'
  ],
  'Design': [
    'Senior Product Designer', 'Principal UX Researcher', 'Design Systems Architect',
    'Brand Identity Lead', 'Creative Director', 'Visual Experience Designer'
  ],
  'Customer Support': [
    'Customer Support Lead', 'VP of Customer Experience', 'Technical Support Engineer',
    'Client Success Manager', 'Support Operations Specialist'
  ],
  'Legal': [
    'Corporate Counsel', 'Senior IP & Patent Attorney', 'Regulatory Compliance Director',
    'Commercial Contracts Lead', 'Data Privacy Officer'
  ],
  'Administration': [
    'Executive Business Partner', 'Operations Coordinator', 'Office Administration Director',
    'Executive Assistant to CEO', 'Workplace Services Manager'
  ]
};

export const SKILLS_POOL: Record<string, string[]> = {
  'Technology': ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'Git', 'GraphQL', 'Terraform', '.NET', 'C#', 'Java', 'Linux'],
  'Data & AI': ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Generative AI / LLM', 'SQL', 'Snowflake', 'Spark', 'Databricks', 'AWS', 'Power BI', 'Deep Learning', 'HuggingFace', 'Pandas'],
  'Operations': ['Project Management', 'Process Improvement', 'Lean Six Sigma', 'Jira', 'Excel', 'Leadership', 'ERP', 'Communication', 'Supply Chain', 'Vendor Management'],
  'Finance': ['Excel', 'Financial Modeling', 'SQL', 'Power BI', 'SAP', 'Risk Management', 'Forecasting', 'Valuation', 'Communication', 'Audit'],
  'Sales': ['Salesforce', 'HubSpot', 'Enterprise Sales', 'Negotiation', 'CRM', 'Cold Outreach', 'Contract Closing', 'Communication', 'Presentation'],
  'Marketing': ['SEO', 'Google Analytics', 'HubSpot', 'Content Strategy', 'Growth Marketing', 'Meta Ads', 'Figma', 'Copywriting', 'Communication'],
  'Human Resources': ['Workday', 'Greenhouse', 'Recruiting', 'Talent Acquisition', 'HRIS', 'Employee Relations', 'Leadership', 'Communication'],
  'Accounting': ['QuickBooks', 'SAP', 'NetSuite', 'Tax Compliance', 'GAAP / IFRS', 'Excel', 'Internal Controls', 'Audit', 'Financial Statements'],
  'Engineering': ['PLC', 'SCADA', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Electrical Design', 'IoT', 'Robotics', 'Quality Assurance'],
  'Product': ['Product Strategy', 'Agile / Scrum', 'Jira', 'User Research', 'Product Analytics', 'Roadmapping', 'Figma', 'Leadership', 'Data Analysis'],
  'Healthcare': ['Clinical Trials', 'CDISC', 'SAS', 'FDA Regulations', 'GCP / GLP', 'Electronic Data Capture', 'Excel', 'Medical Writing'],
  'Management': ['Strategic Planning', 'Leadership', 'P&L Management', 'Cross-functional Collaboration', 'Stakeholder Management', 'Public Speaking'],
  'Design': ['Figma', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Adobe CC', 'UI/UX Design', 'Design Thinking'],
  'Customer Support': ['Zendesk', 'Intercom', 'Customer Service', 'Troubleshooting', 'CRM', 'Communication', 'Conflict Resolution'],
  'Legal': ['Contract Negotiation', 'Compliance', 'Corporate Law', 'GDPR / Privacy', 'Intellectual Property', 'Risk Assessment', 'Legal Writing'],
  'Administration': ['Office 365', 'Calendar Management', 'Event Planning', 'Travel Coordination', 'Communication', 'Executive Support']
};

// Deterministic Pseudo-Random Number Generator for consistent datasets
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate dynamic rolling date (relative to current date)
export function getDynamicDate(dayOffset: number): {
  dateStr: string;
  year: number;
  month: number;
  monthName: string;
  yearMonth: string;
  quarter: string;
} {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const monthName = months[d.getMonth()];
  const day = d.getDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  const quarter = `Q${Math.floor((month - 1) / 3) + 1}`;
  
  return { dateStr, year, month, monthName, yearMonth, quarter };
}

// Rolling 12 months list for trends
export function getRollingMonthList(count = 12): Array<{ month: string; yearMonth: string; label: string }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const list: Array<{ month: string; yearMonth: string; label: string }> = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = months[d.getMonth()];
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    list.push({
      month: mName,
      yearMonth: ym,
      label: `${mName}`
    });
  }
  return list;
}

// Generate realistic dataset with dynamic dates
export function generateExhaustiveJobRecords(): JobRecord[] {
  const records: JobRecord[] = [];
  let seed = 42;

  const countries = Object.keys(COMPANIES_BY_COUNTRY);
  let idCounter = 10001;

  countries.forEach((country) => {
    const companies = COMPANIES_BY_COUNTRY[country];
    const cities = CITIES_BY_COUNTRY[country];
    const countryObj = COUNTRY_DATA.find(c => c.country === country);
    const countryWeight = countryObj ? countryObj.share / 100 : 0.1;

    const countForCountry = Math.max(18, Math.round(countryWeight * 500));

    Object.keys(ROLE_TITLES_BY_CATEGORY).forEach((cat) => {
      const titles = ROLE_TITLES_BY_CATEGORY[cat];
      const skillsForCat = SKILLS_POOL[cat] || ['Communication', 'Excel', 'Problem Solving'];
      const catObj = CATEGORY_DATA.find(c => c.category === cat);
      const catWeight = catObj ? catObj.share / 100 : 0.05;

      const numJobs = Math.max(1, Math.round(countForCountry * catWeight * 1.6));

      for (let i = 0; i < numJobs; i++) {
        const rnd1 = seededRandom(seed++);
        const rnd2 = seededRandom(seed++);
        const rnd3 = seededRandom(seed++);
        const rnd4 = seededRandom(seed++);
        const rnd5 = seededRandom(seed++);

        const company = companies[Math.floor(rnd1 * companies.length)];
        const city = cities[Math.floor(rnd2 * cities.length)];
        const title = titles[Math.floor(rnd3 * titles.length)];

        // Seniority distribution
        let seniority = 'Senior';
        if (rnd4 < 0.02) seniority = 'Internship';
        else if (rnd4 < 0.08) seniority = 'Junior';
        else if (rnd4 < 0.18) seniority = 'Entry Level';
        else if (rnd4 < 0.48) seniority = 'Mid Level';
        else if (rnd4 < 0.73) seniority = 'Senior';
        else if (rnd4 < 0.83) seniority = 'Lead';
        else if (rnd4 < 0.93) seniority = 'Manager';
        else if (rnd4 < 0.98) seniority = 'Director';
        else seniority = 'Executive';

        // Modality distribution
        const remoteThreshold = (catObj?.remotePct || 38) / 100;
        let modality: 'Remote' | 'Hybrid' | 'On-site' = 'Hybrid';
        if (rnd5 < remoteThreshold) {
          modality = 'Remote';
        } else if (rnd5 < remoteThreshold + 0.35) {
          modality = 'Hybrid';
        } else {
          modality = 'On-site';
        }

        // AI Role flag
        const isAI = (cat === 'Data & AI' && rnd1 < 0.55) || (cat === 'Technology' && rnd2 < 0.12) || (title.includes('AI') || title.includes('Machine Learning'));

        // Salary estimation
        const baseCatSalary = catObj?.avgSalary || 160000;
        const countryMultiplier = country === 'Switzerland' ? 1.22 : country === 'United States' ? 1.15 : country === 'Denmark' ? 1.05 : 0.95;
        const aiMultiplier = isAI ? 1.42 : 1.0;
        
        let senMultiplier = 1.0;
        if (seniority === 'Internship') senMultiplier = 0.35;
        else if (seniority === 'Junior') senMultiplier = 0.55;
        else if (seniority === 'Entry Level') senMultiplier = 0.48;
        else if (seniority === 'Mid Level') senMultiplier = 0.85;
        else if (seniority === 'Senior') senMultiplier = 1.15;
        else if (seniority === 'Lead') senMultiplier = 1.35;
        else if (seniority === 'Manager') senMultiplier = 1.25;
        else if (seniority === 'Director') senMultiplier = 1.70;
        else if (seniority === 'Executive') senMultiplier = 2.40;

        const salVariation = 0.9 + (seededRandom(seed++) * 0.2);
        const finalSalary = Math.round((baseCatSalary * countryMultiplier * aiMultiplier * senMultiplier * salVariation) / 500) * 500;

        // Skills pick 3-6
        const numSkills = 3 + Math.floor(seededRandom(seed++) * 4);
        const shuffled = [...skillsForCat].sort(() => 0.5 - seededRandom(seed++));
        const pickedSkills = shuffled.slice(0, numSkills);
        if (isAI && !pickedSkills.includes('Machine Learning') && !pickedSkills.includes('Python')) {
          pickedSkills.unshift('Machine Learning', 'Python');
        }

        // Dynamic rolling date within last 180 days
        const offsetDays = Math.floor(seededRandom(seed++) * 180);
        const dynamicDate = getDynamicDate(offsetDays);

        records.push({
          Job_ID: `REQ-${idCounter++}`,
          Job_Title: title,
          Company: company,
          Job_Category: cat,
          Seniority: seniority,
          Workplace_Modality: modality,
          Is_Remote: modality === 'Remote' ? 'Yes' : 'No',
          Is_AI_Job: isAI ? 'Yes' : 'No',
          Country: country,
          Location: `${city}, ${country}`,
          Date_Posted: dynamicDate.dateStr,
          Year: dynamicDate.year,
          Month: dynamicDate.month,
          Month_Name: dynamicDate.monthName,
          Year_Month: dynamicDate.yearMonth,
          Quarter: dynamicDate.quarter,
          Employment_Type: 'Full-Time',
          Has_Salary: 'Yes',
          Salary_Min_USD: Math.round(finalSalary * 0.9),
          Salary_Max_USD: Math.round(finalSalary * 1.1),
          Salary_Avg_USD: finalSalary,
          Skills_List: pickedSkills.join(', '),
          Skill_Count: pickedSkills.length
        });
      }
    });
  });

  return records;
}

// Master generated records (Dynamic)
export const MASTER_JOB_RECORDS = generateExhaustiveJobRecords();

// Dataset State Manager
let customJobRecords: JobRecord[] | null = null;
let activeDatasetName: string = 'Default Global Dataset';

export function setCustomDataset(records: JobRecord[] | null, name?: string) {
  customJobRecords = records;
  activeDatasetName = name || (records ? 'Custom Uploaded Dataset' : 'Default Global Dataset');
}

export function appendJobsToDataset(newRecords: JobRecord[], name?: string) {
  const current = getActiveJobRecords();
  setCustomDataset([...newRecords, ...current], name || (customJobRecords ? activeDatasetName : 'Enriched Live Dataset'));
}

export function getActiveDatasetName(): string {
  return activeDatasetName;
}

export function getActiveJobRecords(): JobRecord[] {
  return customJobRecords || MASTER_JOB_RECORDS;
}

export function isUsingCustomDataset(): boolean {
  return customJobRecords !== null;
}

export interface FilterCriteria {
  country: string;
  category: string;
  modality: string;
  ai: string;
  seniority: string;
  search?: string;
  customRecords?: JobRecord[];
}

export interface DynamicReportMetrics {
  totalJobs: number;
  totalCompanies: number;
  totalCountries: number;
  aiJobs: number;
  aiPercentage: number;
  nonAiJobs: number;
  nonAiPercentage: number;
  remoteJobs: number;
  remotePercentage: number;
  hybridPercentage: number;
  onsitePercentage: number;
  avgSalary: number;
  medianSalary: number;
  aiAvgSalary: number;
  aiMedianSalary: number;
  nonAiAvgSalary: number;
  nonAiMedianSalary: number;
  aiSalaryPremiumPct: number;
  salaryDisclosurePct: number;
  categoryDistribution: Array<{ category: string; jobs: number; share: number; avgSalary: number; isHighlighted?: boolean }>;
  countryDistribution: Array<{ country: string; jobs: number; share: number; avgSalary: number; isHighlighted?: boolean }>;
  seniorityDistribution: Array<{ level: string; jobs: number; share: number; avgSalary: number }>;
  modalityDistribution: Array<{ modality: string; count: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; postings: number; remote: number; ai: number; avgSalary: number }>;
  skillsRanked: Array<{ skill: string; count: number; pct_of_jobs: number; category: string }>;
  matchingRecords: JobRecord[];
}

// Multi-Dimensional DAX Evaluation Engine (Dynamic with Custom Dataset Support)
export function evaluateDaxFilterEngine(filters: FilterCriteria): DynamicReportMetrics {
  const { country, category, modality, ai, seniority, search = '', customRecords } = filters;
  const activeRecords = customRecords || getActiveJobRecords();
  const isCustom = isUsingCustomDataset() || !!customRecords;

  // 1. Filter Active Records
  const matched = activeRecords.filter(job => {
    const matchCountry = country === 'All' || job.Country.toLowerCase() === country.toLowerCase();
    const matchCat = category === 'All' || job.Job_Category.toLowerCase() === category.toLowerCase();
    const matchMod = modality === 'All' || job.Workplace_Modality.toLowerCase() === modality.toLowerCase();
    const isJobAi = job.Is_AI_Job === 'Yes' || (job.Is_AI_Job as any) === true || (job.Is_AI_Job as any) === 'true';
    const matchAI = ai === 'All' || (ai === 'Yes' ? isJobAi : !isJobAi);
    const matchSen = seniority === 'All' || job.Seniority.toLowerCase() === seniority.toLowerCase();
    const matchSearch = search.trim() === '' ||
      (job.Job_Title && job.Job_Title.toLowerCase().includes(search.toLowerCase())) ||
      (job.Company && job.Company.toLowerCase().includes(search.toLowerCase())) ||
      (job.Skills_List && job.Skills_List.toLowerCase().includes(search.toLowerCase())) ||
      (job.Location && job.Location.toLowerCase().includes(search.toLowerCase()));

    return matchCountry && matchCat && matchMod && matchAI && matchSen && matchSearch;
  });

  const isGlobal = country === 'All' && category === 'All' && modality === 'All' && ai === 'All' && seniority === 'All' && search.trim() === '';

  // If using standard default dataset and no filters applied:
  if (isGlobal && !isCustom) {
    const rollingMonths = getRollingMonthList(12);
    return {
      totalJobs: METRICS_DATA.total_jobs,
      totalCompanies: METRICS_DATA.total_companies,
      totalCountries: METRICS_DATA.total_countries,
      aiJobs: METRICS_DATA.ai_jobs,
      aiPercentage: METRICS_DATA.ai_job_percentage,
      nonAiJobs: METRICS_DATA.non_ai_jobs,
      nonAiPercentage: METRICS_DATA.non_ai_job_percentage,
      remoteJobs: METRICS_DATA.remote_jobs,
      remotePercentage: METRICS_DATA.remote_job_percentage,
      hybridPercentage: METRICS_DATA.hybrid_job_percentage,
      onsitePercentage: METRICS_DATA.onsite_job_percentage,
      avgSalary: METRICS_DATA.overall_average_salary_usd,
      medianSalary: METRICS_DATA.overall_median_salary_usd,
      aiAvgSalary: METRICS_DATA.ai_average_salary_usd,
      aiMedianSalary: METRICS_DATA.ai_median_salary_usd,
      nonAiAvgSalary: METRICS_DATA.non_ai_average_salary_usd,
      nonAiMedianSalary: METRICS_DATA.non_ai_median_salary_usd,
      aiSalaryPremiumPct: METRICS_DATA.ai_salary_premium_pct,
      salaryDisclosurePct: METRICS_DATA.salary_disclosure_percentage,
      categoryDistribution: CATEGORY_DATA.map(c => ({ ...c })),
      countryDistribution: COUNTRY_DATA.map(c => ({ ...c })),
      seniorityDistribution: SENIORITY_DATA.map(s => ({ ...s })),
      modalityDistribution: [
        { modality: 'Remote', count: 4578, percentage: 38.15 },
        { modality: 'Hybrid', count: 4368, percentage: 36.40 },
        { modality: 'On-site', count: 3054, percentage: 25.45 }
      ],
      monthlyTrend: rollingMonths.map((m, idx) => {
        const basePostings = [840, 920, 1080, 1150, 1210, 1180, 990, 1040, 1260, 1290, 1120, 920][idx % 12];
        return {
          month: m.month,
          postings: basePostings,
          remote: Math.round(basePostings * 0.38),
          ai: Math.round(basePostings * 0.05),
          avgSalary: 174000 + (idx * 600)
        };
      }),
      skillsRanked: [
        { skill: 'Communication', count: 12000, pct_of_jobs: 100, category: 'Business' },
        { skill: 'Leadership', count: 4067, pct_of_jobs: 33.9, category: 'Business' },
        { skill: 'Excel', count: 3105, pct_of_jobs: 25.9, category: 'Business' },
        { skill: 'Git', count: 2548, pct_of_jobs: 21.2, category: 'Technical' },
        { skill: 'Python', count: 2450, pct_of_jobs: 20.4, category: 'Technical' },
        { skill: 'Project Management', count: 2144, pct_of_jobs: 17.9, category: 'Business' },
        { skill: 'SQL', count: 2037, pct_of_jobs: 17.0, category: 'Technical' },
        { skill: 'Salesforce', count: 1401, pct_of_jobs: 11.7, category: 'Business' },
        { skill: 'AWS', count: 1355, pct_of_jobs: 11.3, category: 'Technical' },
        { skill: 'Docker', count: 1272, pct_of_jobs: 10.6, category: 'Technical' }
      ],
      matchingRecords: matched
    };
  }

  // Under active filter context OR custom dataset:
  let totalJobs = matched.length;
  if (!isCustom) {
    if (country !== 'All' && category === 'All' && modality === 'All' && ai === 'All' && seniority === 'All') {
      const cObj = COUNTRY_DATA.find(c => c.country === country);
      if (cObj) totalJobs = cObj.jobs;
    } else if (category !== 'All' && country === 'All' && modality === 'All' && ai === 'All' && seniority === 'All') {
      const catObj = CATEGORY_DATA.find(c => c.category === category);
      if (catObj) totalJobs = catObj.jobs;
    } else {
      const sampleRatio = matched.length / MASTER_JOB_RECORDS.length;
      totalJobs = Math.max(matched.length, Math.round(sampleRatio * 12000));
    }
  }

  const uniqueCompanies = new Set(matched.map(j => j.Company)).size;
  const uniqueCountries = new Set(matched.map(j => j.Country)).size;

  const remoteCount = matched.filter(j => j.Workplace_Modality?.toLowerCase() === 'remote' || j.Is_Remote === 'Yes').length;
  const hybridCount = matched.filter(j => j.Workplace_Modality?.toLowerCase() === 'hybrid').length;
  const onsiteCount = matched.filter(j => j.Workplace_Modality?.toLowerCase() === 'on-site' || j.Workplace_Modality?.toLowerCase() === 'onsite').length;
  const matchedTotal = matched.length || 1;

  const remotePct = Number(((remoteCount / matchedTotal) * 100).toFixed(1));
  const hybridPct = Number(((hybridCount / matchedTotal) * 100).toFixed(1));
  const onsitePct = Number(((onsiteCount / matchedTotal) * 100).toFixed(1));

  const aiCount = matched.filter(j => j.Is_AI_Job === 'Yes' || (j.Is_AI_Job as any) === true || (j.Is_AI_Job as any) === 'true').length;
  const aiPct = Number(((aiCount / matchedTotal) * 100).toFixed(1));
  const aiJobsEstimated = Math.round((aiPct / 100) * totalJobs);
  const nonAiJobsEstimated = totalJobs - aiJobsEstimated;

  const validSalaries = matched
    .map(j => typeof j.Salary_Avg_USD === 'number' && j.Salary_Avg_USD > 0 ? j.Salary_Avg_USD : null)
    .filter((s): s is number => s !== null)
    .sort((a, b) => a - b);

  const avgSalary = validSalaries.length > 0 ? Math.round(validSalaries.reduce((a, b) => a + b, 0) / validSalaries.length) : 175000;
  const medianSalary = validSalaries.length > 0 ? validSalaries[Math.floor(validSalaries.length / 2)] : avgSalary;

  const aiSalaries = matched.filter(j => j.Is_AI_Job === 'Yes' || (j.Is_AI_Job as any) === true || (j.Is_AI_Job as any) === 'true').map(j => j.Salary_Avg_USD || 0).filter(s => s > 0);
  const nonAiSalaries = matched.filter(j => j.Is_AI_Job !== 'Yes' && (j.Is_AI_Job as any) !== true && (j.Is_AI_Job as any) !== 'true').map(j => j.Salary_Avg_USD || 0).filter(s => s > 0);

  const aiAvg = aiSalaries.length > 0 ? Math.round(aiSalaries.reduce((a, b) => a + b, 0) / aiSalaries.length) : Math.round(avgSalary * 1.35);
  const aiMed = aiSalaries.length > 0 ? aiSalaries[Math.floor(aiSalaries.length / 2)] : Math.round(medianSalary * 1.30);
  const nonAiAvg = nonAiSalaries.length > 0 ? Math.round(nonAiSalaries.reduce((a, b) => a + b, 0) / nonAiSalaries.length) : Math.round(avgSalary * 0.98);
  const nonAiMed = nonAiSalaries.length > 0 ? nonAiSalaries[Math.floor(nonAiSalaries.length / 2)] : Math.round(medianSalary * 0.96);

  const premiumPct = nonAiAvg > 0 ? Number((((aiAvg - nonAiAvg) / nonAiAvg) * 100).toFixed(1)) : 0;

  // Category Breakdown
  const catMap: Record<string, { jobs: number; sumSal: number; count: number }> = {};
  matched.forEach(j => {
    const catName = j.Job_Category || 'Other';
    if (!catMap[catName]) catMap[catName] = { jobs: 0, sumSal: 0, count: 0 };
    catMap[catName].jobs += 1;
    if (j.Salary_Avg_USD) {
      catMap[catName].sumSal += j.Salary_Avg_USD;
      catMap[catName].count += 1;
    }
  });

  const allCategories = Object.keys(catMap).length > 0 ? Object.keys(catMap) : CATEGORY_DATA.map(c => c.category);
  const categoryDistribution = allCategories.map(catName => {
    const stat = catMap[catName];
    const rawJobs = stat ? (isCustom ? stat.jobs : Math.round((stat.jobs / matchedTotal) * totalJobs)) : 0;
    const catSalary = stat && stat.count > 0 ? Math.round(stat.sumSal / stat.count) : avgSalary;
    return {
      category: catName,
      jobs: Math.max(1, rawJobs),
      share: Number(((rawJobs / (totalJobs || 1)) * 100).toFixed(1)),
      avgSalary: catSalary,
      isHighlighted: category !== 'All' && category.toLowerCase() === catName.toLowerCase()
    };
  }).sort((a, b) => b.jobs - a.jobs);

  // Country Breakdown
  const countryMap: Record<string, { jobs: number; sumSal: number; count: number }> = {};
  matched.forEach(j => {
    const cntry = j.Country || 'Global';
    if (!countryMap[cntry]) countryMap[cntry] = { jobs: 0, sumSal: 0, count: 0 };
    countryMap[cntry].jobs += 1;
    if (j.Salary_Avg_USD) {
      countryMap[cntry].sumSal += j.Salary_Avg_USD;
      countryMap[cntry].count += 1;
    }
  });

  const allCountries = Object.keys(countryMap).length > 0 ? Object.keys(countryMap) : COUNTRY_DATA.map(c => c.country);
  const countryDistribution = allCountries.map(cntryName => {
    const stat = countryMap[cntryName];
    const rawJobs = stat ? (isCustom ? stat.jobs : Math.round((stat.jobs / matchedTotal) * totalJobs)) : 0;
    const cntrySalary = stat && stat.count > 0 ? Math.round(stat.sumSal / stat.count) : avgSalary;
    return {
      country: cntryName,
      jobs: Math.max(1, rawJobs),
      share: Number(((rawJobs / (totalJobs || 1)) * 100).toFixed(1)),
      avgSalary: cntrySalary,
      isHighlighted: country !== 'All' && country.toLowerCase() === cntryName.toLowerCase()
    };
  }).sort((a, b) => b.jobs - a.jobs);

  // Seniority breakdown
  const senMap: Record<string, number> = {};
  matched.forEach(j => {
    const sen = j.Seniority || 'Senior';
    senMap[sen] = (senMap[sen] || 0) + 1;
  });

  const seniorityLevels = Object.keys(senMap).length > 0 ? Object.keys(senMap) : SENIORITY_DATA.map(s => s.level);
  const seniorityDistribution = seniorityLevels.map(lvl => {
    const count = senMap[lvl] || 0;
    const scaled = isCustom ? count : Math.round((count / matchedTotal) * totalJobs);
    const senBaseObj = SENIORITY_DATA.find(s => s.level.toLowerCase() === lvl.toLowerCase());
    return {
      level: lvl,
      jobs: Math.max(0, scaled),
      share: Number(((scaled / (totalJobs || 1)) * 100).toFixed(1)),
      avgSalary: senBaseObj ? senBaseObj.avgSalary : avgSalary
    };
  }).sort((a, b) => b.jobs - a.jobs);

  // Monthly trend for sparkline (rolling 12 months)
  const rollingMonths = getRollingMonthList(12);
  const monthlyMap: Record<string, { count: number; remote: number; ai: number; sumSal: number; salCount: number }> = {};
  
  matched.forEach(j => {
    const m = j.Month_Name || (j.Date_Posted ? new Date(j.Date_Posted).toLocaleString('default', { month: 'short' }) : 'Jan');
    if (!monthlyMap[m]) monthlyMap[m] = { count: 0, remote: 0, ai: 0, sumSal: 0, salCount: 0 };
    monthlyMap[m].count += 1;
    if (j.Workplace_Modality?.toLowerCase() === 'remote' || j.Is_Remote === 'Yes') monthlyMap[m].remote += 1;
    if (j.Is_AI_Job === 'Yes' || (j.Is_AI_Job as any) === true || (j.Is_AI_Job as any) === 'true') monthlyMap[m].ai += 1;
    if (j.Salary_Avg_USD) {
      monthlyMap[m].sumSal += j.Salary_Avg_USD;
      monthlyMap[m].salCount += 1;
    }
  });

  const monthlyTrend = rollingMonths.map(rm => {
    const stat = monthlyMap[rm.month];
    const rawJobs = stat ? (isCustom ? stat.count : Math.round((stat.count / matchedTotal) * totalJobs)) : Math.max(1, Math.round(totalJobs / 12));
    const mRemote = stat ? (isCustom ? stat.remote : Math.round(rawJobs * (remotePct / 100))) : Math.round(rawJobs * (remotePct / 100));
    const mAi = stat ? (isCustom ? stat.ai : Math.round(rawJobs * (aiPct / 100))) : Math.round(rawJobs * (aiPct / 100));
    const mSalary = stat && stat.salCount > 0 ? Math.round(stat.sumSal / stat.salCount) : avgSalary;

    return {
      month: rm.month,
      postings: rawJobs,
      remote: mRemote,
      ai: mAi,
      avgSalary: mSalary
    };
  });

  // Skills Ranked
  const skillCountMap: Record<string, { count: number; cat: string }> = {};
  matched.forEach(j => {
    if (j.Skills_List) {
      const sks = j.Skills_List.split(',').map(s => s.trim()).filter(Boolean);
      sks.forEach(sk => {
        if (!skillCountMap[sk]) skillCountMap[sk] = { count: 0, cat: j.Job_Category || 'General' };
        skillCountMap[sk].count += 1;
      });
    }
  });

  const skillsRanked = Object.entries(skillCountMap)
    .map(([skill, data]) => ({
      skill,
      count: isCustom ? data.count : Math.round((data.count / matchedTotal) * totalJobs),
      pct_of_jobs: Number(((data.count / matchedTotal) * 100).toFixed(1)),
      category: data.cat
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalJobs,
    totalCompanies: Math.max(1, uniqueCompanies),
    totalCountries: Math.max(1, uniqueCountries),
    aiJobs: aiJobsEstimated,
    aiPercentage: aiPct,
    nonAiJobs: nonAiJobsEstimated,
    nonAiPercentage: Number((100 - aiPct).toFixed(1)),
    remoteJobs: isCustom ? remoteCount : Math.round(totalJobs * (remotePct / 100)),
    remotePercentage: remotePct,
    hybridPercentage: hybridPct,
    onsitePercentage: onsitePct,
    avgSalary,
    medianSalary,
    aiAvgSalary: aiAvg,
    aiMedianSalary: aiMed,
    nonAiAvgSalary: nonAiAvg,
    nonAiMedianSalary: nonAiMed,
    aiSalaryPremiumPct: premiumPct,
    salaryDisclosurePct: validSalaries.length > 0 ? Number(((validSalaries.length / matchedTotal) * 100).toFixed(1)) : 68.55,
    categoryDistribution,
    countryDistribution,
    seniorityDistribution,
    modalityDistribution: [
      { modality: 'Remote', count: isCustom ? remoteCount : Math.round(totalJobs * (remotePct / 100)), percentage: remotePct },
      { modality: 'Hybrid', count: isCustom ? hybridCount : Math.round(totalJobs * (hybridPct / 100)), percentage: hybridPct },
      { modality: 'On-site', count: isCustom ? onsiteCount : Math.round(totalJobs * (onsitePct / 100)), percentage: onsitePct }
    ],
    monthlyTrend,
    skillsRanked,
    matchingRecords: matched
  };
}

// -----------------------------------------------------------------------------
// CSV and JSON Ingestion Parsers for Custom Data
// -----------------------------------------------------------------------------

export function parseCsvToJobRecords(csvText: string): JobRecord[] {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = splitCsvRow(headerLine).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const records: JobRecord[] = [];
  const dynamicDate = getDynamicDate(1);

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvRow(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    const title = getField(row, ['jobtitle', 'title', 'position', 'role', 'job', 'name']) || 'General Specialist';
    const company = getField(row, ['company', 'employer', 'organization', 'companyname']) || 'Enterprise Org';
    const category = getField(row, ['jobcategory', 'category', 'department', 'sector', 'industry', 'field']) || 'Technology';
    const seniority = getField(row, ['seniority', 'level', 'experience', 'tier']) || 'Senior';
    const modality = normalizeModality(getField(row, ['workplacemodality', 'modality', 'workplace', 'worktype', 'type']));
    const country = getField(row, ['country', 'nation', 'region']) || 'United States';
    const location = getField(row, ['location', 'city', 'joblocation']) || `${country}`;
    const rawSalary = getField(row, ['salaryavgusd', 'salary', 'salaryavg', 'compensation', 'pay', 'avg_salary']);
    const salary = parseNumericSalary(rawSalary) || 165000;
    const skills = getField(row, ['skillslist', 'skills', 'skill', 'technologies', 'keywords', 'competencies']) || 'Communication, Problem Solving';
    const datePosted = getField(row, ['dateposted', 'date', 'posteddate', 'posted', 'createdat']) || dynamicDate.dateStr;
    const isAI = isAiRole(title, category, skills);

    const d = new Date(datePosted);
    const parsedYear = isNaN(d.getFullYear()) ? dynamicDate.year : d.getFullYear();
    const parsedMonth = isNaN(d.getMonth()) ? dynamicDate.month : d.getMonth() + 1;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parsedMonth - 1] || 'Jan';

    records.push({
      Job_ID: getField(row, ['jobid', 'id', 'reqid', 'reference']) || `REQ-${10000 + i}`,
      Job_Title: title,
      Company: company,
      Job_Category: category,
      Seniority: seniority,
      Workplace_Modality: modality,
      Is_Remote: modality === 'Remote' ? 'Yes' : 'No',
      Is_AI_Job: isAI ? 'Yes' : 'No',
      Country: country,
      Location: location,
      Date_Posted: datePosted,
      Year: parsedYear,
      Month: parsedMonth,
      Month_Name: monthName,
      Year_Month: `${parsedYear}-${String(parsedMonth).padStart(2, '0')}`,
      Quarter: `Q${Math.floor((parsedMonth - 1) / 3) + 1}`,
      Employment_Type: 'Full-Time',
      Has_Salary: 'Yes',
      Salary_Min_USD: Math.round(salary * 0.9),
      Salary_Max_USD: Math.round(salary * 1.1),
      Salary_Avg_USD: salary,
      Skills_List: skills,
      Skill_Count: skills.split(',').length
    });
  }

  return records;
}

function splitCsvRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function getField(row: Record<string, string>, possibleKeys: string[]): string {
  for (const k of possibleKeys) {
    if (row[k] !== undefined && row[k] !== '') {
      return row[k];
    }
  }
  return '';
}

function normalizeModality(val: string): 'Remote' | 'Hybrid' | 'On-site' {
  const lower = (val || '').toLowerCase();
  if (lower.includes('remote') || lower.includes('virtual') || lower.includes('wfh')) return 'Remote';
  if (lower.includes('hybrid') || lower.includes('flexible')) return 'Hybrid';
  return 'On-site';
}

function parseNumericSalary(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;
  // If annual salary is given in k (e.g. 150)
  if (num < 1000) return Math.round(num * 1000);
  return Math.round(num);
}

function isAiRole(title: string, category: string, skills: string): boolean {
  const text = `${title} ${category} ${skills}`.toLowerCase();
  return text.includes('ai') || text.includes('machine learning') || text.includes('deep learning') || text.includes('llm') || text.includes('pytorch') || text.includes('neural');
}
