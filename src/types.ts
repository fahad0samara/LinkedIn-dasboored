export interface JobRecord {
  Job_ID: string;
  Job_Title: string;
  Company: string;
  Job_Category: string;
  Seniority: string;
  Workplace_Modality: 'Remote' | 'Hybrid' | 'On-site';
  Is_Remote: 'Yes' | 'No' | 'Unknown';
  Is_AI_Job: 'Yes' | 'No';
  Country: string;
  Location: string;
  Date_Posted: string;
  Year: number;
  Month: number;
  Month_Name: string;
  Year_Month: string;
  Quarter: string;
  Employment_Type: string;
  Has_Salary: 'Yes' | 'No';
  Salary_Min_USD?: number;
  Salary_Max_USD?: number;
  Salary_Avg_USD?: number;
  Skills_List: string;
  Skill_Count: number;
}

export interface SkillItem {
  skill: string;
  count: number;
  category: 'Technical' | 'AI & Data' | 'Business';
  type: string;
  pct_of_jobs: number;
}

export interface DaxMeasure {
  name: string;
  category: string;
  formula: string;
  calculation: string;
  whyNeeded: string;
  whereUsed: string;
}

export interface MarketMetrics {
  total_jobs: number;
  total_companies: number;
  total_locations: number;
  total_countries: number;
  ai_jobs: number;
  ai_job_percentage: number;
  non_ai_jobs: number;
  non_ai_job_percentage: number;
  remote_jobs: number;
  remote_job_percentage: number;
  hybrid_job_percentage: number;
  onsite_job_percentage: number;
  salary_disclosure_percentage: number;
  salary_records_count: number;
  overall_average_salary_usd: number;
  overall_median_salary_usd: number;
  ai_average_salary_usd: number;
  ai_median_salary_usd: number;
  non_ai_average_salary_usd: number;
  non_ai_median_salary_usd: number;
  ai_salary_premium_pct: number;
  top_category: string;
  top_category_share_pct: number;
  top_country: string;
  top_country_share_pct: number;
  top_skill: string;
  top_skill_count: number;
  top_skill_percentage: number;
}
