"""
2026 Global Job Market Analysis - Step 2 to 7: Data Cleaning, Enrichment & Standardization Pipeline
Prepares clean datasets for Power BI import:
- data/processed/jobs_2026_clean.csv (Fact table)
- data/processed/dim_skills_2026.csv (Bridge / Dimension table)
- data/processed/job_market_summary_metrics.json (Verified statistical metrics)
"""

import csv
import json
import re
import statistics
from collections import Counter
from datetime import datetime

# 1. Job Category Classification Rules (Step 3)
CATEGORY_RULES = {
    "Data & AI": [
        "data scientist", "data analyst", "data engineer", "machine learning", "ml engineer",
        "ai engineer", "ai research", "generative ai", "llm", "nlp", "computer vision",
        "deep learning", "business intelligence", "bi developer", "analytics engineer", "big data"
    ],
    "Technology": [
        "software", "developer", "frontend", "backend", "full stack", "fullstack", "devops",
        "cloud", "site reliability", "sre", "infrastructure", "qa", "quality assurance",
        "security", "cybersecurity", "sysadmin", "systems engineer", ".net", "java", "c++",
        "embedded", "solutions architect", "database administrator", "dba", "web developer"
    ],
    "Finance": [
        "financial", "finance", "investment", "treasury", "banking", "portfolio", "risk analyst",
        "fp&a", "wealth management", "credit analyst", "actuary"
    ],
    "Accounting": [
        "accountant", "accounting", "auditor", "audit", "tax", "controller", "bookkeeper",
        "accounts payable", "accounts receivable", "payroll"
    ],
    "Marketing": [
        "marketing", "seo", "sem", "content strategist", "brand", "growth marketer",
        "social media", "copywriter", "market research", "communications specialist", "cmo"
    ],
    "Sales": [
        "sales", "account executive", "sdr", "bdr", "business development", "key account",
        "sales engineer", "account manager", "commercial director"
    ],
    "Human Resources": [
        "human resources", "hr ", "hr generalist", "recruiter", "talent acquisition",
        "people operations", "people partner", "compensation", "benefits specialist"
    ],
    "Operations": [
        "operations", "supply chain", "logistics", "procurement", "buyer", "inventory",
        "process improvement", "facilities", "fulfillment"
    ],
    "Product": [
        "product manager", "product owner", "technical product", "associate product",
        "head of product", "vp product", "group product manager"
    ],
    "Design": [
        "designer", "ui/ux", "ux designer", "ui designer", "product designer",
        "graphic designer", "design director", "design systems", "visual designer"
    ],
    "Healthcare": [
        "nurse", "rn ", "clinical", "physician", "doctor", "medical", "pharmacy",
        "pharmacist", "therapist", "healthcare", "patient"
    ],
    "Legal": [
        "counsel", "attorney", "lawyer", "legal", "compliance officer", "paralegal",
        "contract specialist", "general counsel", "intellectual property"
    ],
    "Engineering": [
        "mechanical engineer", "electrical engineer", "civil engineer", "structural engineer",
        "chemical engineer", "hardware engineer", "manufacturing engineer", "robotics",
        "cad", "pcb", "environmental engineer"
    ],
    "Customer Support": [
        "customer support", "customer success", "technical support", "support specialist",
        "client services", "helpdesk", "customer service"
    ],
    "Administration": [
        "executive assistant", "admin assistant", "administrative", "office coordinator",
        "receptionist", "office manager"
    ],
    "Management": [
        "general manager", "management consultant", "chief of staff", "strategy director",
        "managing director", "corporate development"
    ]
}

# 2. AI Job Classification Rules (Step 4) - Strict boundary
AI_JOB_KEYWORDS = [
    r"\bai\b", r"artificial intelligence", r"machine learning", r"\bml\b",
    r"generative ai", r"\bgenai\b", r"\bllm\b", r"large language model",
    r"\bnlp\b", r"natural language processing", r"computer vision",
    r"deep learning", r"ai research", r"ai engineer", r"ml engineer",
    r"prompt engineer", r"ai ethics", r"ai architect"
]

# 3. Seniority Classification Rules (Step 6)
SENIORITY_RULES = [
    ("Internship", [r"intern\b", r"internship", r"trainee", r"co-op", r"apprentice"]),
    ("Entry Level", [r"entry[\s\-]level", r"associate\b", r"graduate", r"junior level", r"level 1", r"level i\b", r"l1\b"]),
    ("Junior", [r"junior\b", r"jr\b", r"jr\."]),
    ("Executive", [r"vp\b", r"vice president", r"c-level", r"chief\b", r"cmo\b", r"cto\b", r"cfo\b", r"ceo\b", r"cro\b", r"general counsel", r"partner\b"]),
    ("Director", [r"director\b", r"head of\b"]),
    ("Manager", [r"manager\b", r"management\b", r"controller\b"]),
    ("Lead", [r"lead\b", r"principal\b", r"staff\b", r"architect\b"]),
    ("Senior", [r"senior\b", r"sr\b", r"sr\.", r"level 3", r"level iii\b", r"l3\b", r"level 4", r"level iv\b", r"l4\b", r"specialist\b"]),
    ("Mid Level", [r"mid[\s\-]level", r"level 2", r"level ii\b", r"l2\b", r"intermediate\b"])
]

# 4. Standard Skills Dictionary (Step 7)
SKILL_PATTERNS = {
    # Technical Programming & Tools
    "Python": (r"\bpython\b", "Technical", "Programming Language"),
    "Java": (r"\bjava\b(?!script)", "Technical", "Programming Language"),
    "JavaScript": (r"\bjavascript\b|\bjs\b|\btypescript\b|\bts\b", "Technical", "Programming Language"),
    "SQL": (r"\bsql\b|\bpostgresql\b|\bmysql\b|\boracle\b", "Technical", "Database / Query"),
    "C++": (r"\bc\+\+\b", "Technical", "Programming Language"),
    "C#": (r"\bc#\b|\bc sharp\b", "Technical", "Programming Language"),
    ".NET": (r"\b\.net\b|\bdotnet\b", "Technical", "Framework"),
    "React": (r"\breact\b|\breactjs\b", "Technical", "Framework / UI"),
    "Git": (r"\bgit\b|\bgithub\b|\bgitlab\b", "Technical", "Version Control"),
    "Linux": (r"\blinux\b|\bunix\b", "Technical", "Operating System"),
    "Docker": (r"\bdocker\b|\bcontainers\b", "Technical", "DevOps & Cloud"),
    "Kubernetes": (r"\bkubernetes\b|\bk8s\b", "Technical", "DevOps & Cloud"),
    "AWS": (r"\baws\b|\bamazon web services\b", "Technical", "Cloud"),
    "Azure": (r"\bazure\b|\bmicrosoft azure\b", "Technical", "Cloud"),
    "GCP": (r"\bgcp\b|\bgoogle cloud\b", "Technical", "Cloud"),
    "SolidWorks": (r"\bsolidworks\b|\bcad\b|\bautocad\b", "Technical", "Engineering CAD"),
    "Snowflake": (r"\bsnowflake\b", "Technical", "Data Warehouse"),
    
    # AI & Data
    "Machine Learning": (r"machine learning|\bml\b", "AI & Data", "AI/ML"),
    "Deep Learning": (r"deep learning|\bneural networks?\b", "AI & Data", "AI/ML"),
    "PyTorch": (r"\bpytorch\b", "AI & Data", "AI/ML Framework"),
    "TensorFlow": (r"\btensorflow\b|\bkeras\b", "AI & Data", "AI/ML Framework"),
    "LLM": (r"\bllm\b|\bllms\b|large language models?", "AI & Data", "Generative AI"),
    "Generative AI": (r"generative ai|\bgenai\b", "AI & Data", "Generative AI"),
    "NLP": (r"\bnlp\b|natural language processing", "AI & Data", "AI/ML"),
    "Computer Vision": (r"computer vision|\bcv\b", "AI & Data", "AI/ML"),
    "Tableau": (r"\btableau\b", "AI & Data", "BI & Analytics"),
    "Power BI": (r"power bi|\bpowerbi\b", "AI & Data", "BI & Analytics"),
    
    # Business & Operations
    "Excel": (r"\bexcel\b|\bspreadsheets?\b", "Business", "Productivity"),
    "Salesforce": (r"\bsalesforce\b|\bsfdc\b", "Business", "CRM"),
    "SAP": (r"\bsap\b|\berp\b", "Business", "Enterprise Software"),
    "Workday": (r"\bworkday\b|\bhris\b", "Business", "HR Tech"),
    "Zendesk": (r"\bzendesk\b", "Business", "Customer Support Tech"),
    "Figma": (r"\bfigma\b", "Business", "Design"),
    "Project Management": (r"project management|\bpmp\b|\bagile\b|\bscrum\b|\bjira\b", "Business", "Methodology"),
    "Leadership": (r"leadership|\bpeople management\b|\bstrategic planning\b", "Business", "Management"),
    "Communication": (r"communication|stakeholder management|cross-functional", "Business", "Soft Skill"),
    "Financial Modeling": (r"financial modeling|financial reporting|valuation", "Business", "Finance")
}

def clean_and_transform_dataset(input_file="data/raw/jobs_2026_raw.csv",
                                output_jobs="data/processed/jobs_2026_clean.csv",
                                output_skills="data/processed/dim_skills_2026.csv",
                                output_metrics="data/processed/job_market_summary_metrics.json"):
    print("Starting Step 2-7 Data Cleaning & Transformation Pipeline...")
    
    raw_rows = []
    with open(input_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            raw_rows.append(r)
            
    print(f"Loaded {len(raw_rows):,} raw records from {input_file}")
    
    cleaned_jobs = []
    skill_rows = []
    seen_job_ids = set()
    seen_row_signatures = set()
    
    removed_corrupted = 0
    removed_duplicate_rows = 0
    removed_duplicate_ids = 0
    
    for r in raw_rows:
        job_id = r.get("job_id", "").strip()
        job_title = r.get("job_title", "").strip()
        company = r.get("company_name", "").strip()
        location = r.get("location", "").strip()
        country = r.get("country", "").strip()
        workplace_type = r.get("workplace_type", "").strip().lower()
        dept_raw = r.get("department", "").strip()
        seniority_raw = r.get("seniority_raw", "").strip()
        sal_min_str = r.get("salary_min", "").strip()
        sal_max_str = r.get("salary_max", "").strip()
        date_str = r.get("date_posted", "").strip()
        emp_type = r.get("employment_type", "").strip()
        desc = r.get("job_description", "").strip()
        
        # 1. Drop corrupted / empty records
        if not job_title or not company or company.lower() == "unknown corp" or not date_str or date_str == "2026-00-00":
            removed_corrupted += 1
            continue
            
        # 2. Drop exact duplicate rows
        sig = (job_title, company, location, date_str, sal_min_str, sal_max_str)
        if sig in seen_row_signatures:
            removed_duplicate_rows += 1
            continue
        seen_row_signatures.add(sig)
        
        # 3. Handle duplicate IDs
        if job_id in seen_job_ids:
            removed_duplicate_ids += 1
            continue
        seen_job_ids.add(job_id)
        
        # --- Clean & Standardize Dimensions ---
        # A. Job Title normalization
        clean_title = re.sub(r"\s+", " ", job_title).strip()
        title_lower = clean_title.lower()
        desc_lower = desc.lower()
        
        # B. Classify Job Category (Step 3)
        classified_category = "Other"
        matched = False
        
        # Check against title first (most accurate), then department
        for cat, keywords in CATEGORY_RULES.items():
            for kw in keywords:
                if re.search(r"\b" + re.escape(kw) + r"\b", title_lower):
                    classified_category = cat
                    matched = True
                    break
            if matched:
                break
                
        if not matched and dept_raw in CATEGORY_RULES:
            classified_category = dept_raw
            matched = True
            
        if not matched:
            for cat, keywords in CATEGORY_RULES.items():
                for kw in keywords:
                    if re.search(r"\b" + re.escape(kw) + r"\b", desc_lower[:120]):
                        classified_category = cat
                        matched = True
                        break
                if matched:
                    break
                    
        # C. Classify Is_AI_Job (Step 4)
        is_ai_job = "No"
        for kw_regex in AI_JOB_KEYWORDS:
            if re.search(kw_regex, title_lower):
                is_ai_job = "Yes"
                break
        if is_ai_job == "No":
            # Strict description check: Must have explicit AI/ML core title or explicit AI/ML requirement context
            if any(term in title_lower for term in ["scientist", "researcher", "architect", "engineer", "lead"]):
                if re.search(r"\b(generative ai|llm|deep learning|neural networks|pytorch|tensorflow|computer vision|nlp)\b", desc_lower):
                    # verify it's an AI focused role
                    if classified_category == "Data & AI" and ("ai" in title_lower or "learning" in title_lower or "vision" in title_lower or "nlp" in title_lower):
                        is_ai_job = "Yes"
                        
        # D. Classify Is_Remote (Step 5)
        is_remote = "Unknown"
        if workplace_type in ["remote", "fully_remote", "100% remote"] or "remote" in location.lower():
            is_remote = "Yes"
        elif workplace_type in ["on_site", "onsite", "in_office", "in office", "office"]:
            is_remote = "No"
        elif workplace_type in ["hybrid", "flexible"]:
            is_remote = "No" # Hybrid is physically location-bound
        else:
            is_remote = "Unknown"
            
        # Workplace Modality (for rich Power BI slicers: Remote, Hybrid, On-site)
        if "remote" in workplace_type or "remote" in location.lower():
            workplace_modality = "Remote"
        elif "hybrid" in workplace_type or "hybrid" in location.lower():
            workplace_modality = "Hybrid"
        else:
            workplace_modality = "On-site"
            
        # E. Classify Seniority (Step 6)
        seniority = "Unknown"
        # First check title with priority order
        for level, patterns in SENIORITY_RULES:
            for pat in patterns:
                if re.search(pat, title_lower):
                    seniority = level
                    break
            if seniority != "Unknown":
                break
                
        # If still unknown, check raw seniority from ATS
        if seniority == "Unknown" and seniority_raw:
            raw_s_lower = seniority_raw.lower()
            for level, patterns in SENIORITY_RULES:
                for pat in patterns:
                    if re.search(pat, raw_s_lower):
                        seniority = level
                        break
                if seniority != "Unknown":
                    break
            if seniority == "Unknown" and seniority_raw in ["Internship", "Entry Level", "Junior", "Mid Level", "Senior", "Lead", "Manager", "Director", "Executive"]:
                seniority = seniority_raw
                
        # Default mid level for standard untitled roles if not identifiable
        if seniority == "Unknown":
            seniority = "Mid Level"
            
        # F. Parse and Clean Salary Values (Step 2)
        sal_min_clean = None
        sal_max_clean = None
        sal_avg_clean = None
        has_salary_flag = "No"
        
        try:
            if sal_min_str:
                sal_min_clean = float(re.sub(r"[^\d.]", "", sal_min_str))
            if sal_max_str:
                sal_max_clean = float(re.sub(r"[^\d.]", "", sal_max_str))
                
            if sal_min_clean is not None and sal_max_clean is not None:
                sal_avg_clean = (sal_min_clean + sal_max_clean) / 2.0
                has_salary_flag = "Yes"
            elif sal_min_clean is not None:
                sal_avg_clean = sal_min_clean
                sal_max_clean = sal_min_clean
                has_salary_flag = "Yes"
            elif sal_max_clean is not None:
                sal_avg_clean = sal_max_clean
                sal_min_clean = sal_max_clean
                has_salary_flag = "Yes"
        except Exception:
            sal_min_clean = None
            sal_max_clean = None
            sal_avg_clean = None
            has_salary_flag = "No"
            
        # G. Standardize Location & Country
        clean_country = country if country and country != "Unknown" else "United States"
        clean_location = location if location and location != "N/A" else f"National ({clean_country})"
        
        # H. Parse Skills (Step 7)
        extracted_skills = []
        combined_text = f"{clean_title} {dept_raw} {desc}"
        for skill_name, (pat, category, skill_type) in SKILL_PATTERNS.items():
            if re.search(pat, combined_text, re.IGNORECASE):
                extracted_skills.append(skill_name)
                skill_rows.append({
                    "job_id": job_id,
                    "skill_name": skill_name,
                    "skill_category": category,
                    "skill_type": skill_type
                })
                
        primary_skills_str = "; ".join(extracted_skills) if extracted_skills else "General Professional Skills"
        
        # I. Parse Date & Year-Month for Power BI Time Intelligence
        try:
            p_date = datetime.strptime(date_str, "%Y-%m-%d")
            year_val = p_date.year
            month_val = p_date.month
            year_month = p_date.strftime("%Y-%m")
            month_name = p_date.strftime("%B")
            quarter = f"Q{(p_date.month - 1) // 3 + 1} {p_date.year}"
        except Exception:
            year_val = 2026
            month_val = 1
            year_month = "2026-01"
            month_name = "January"
            quarter = "Q1 2026"
            
        cleaned_jobs.append({
            "Job_ID": job_id,
            "Job_Title": clean_title,
            "Company": company,
            "Job_Category": classified_category,
            "Seniority": seniority,
            "Workplace_Modality": workplace_modality,
            "Is_Remote": is_remote,
            "Is_AI_Job": is_ai_job,
            "Country": clean_country,
            "Location": clean_location,
            "Date_Posted": date_str,
            "Year": year_val,
            "Month": month_val,
            "Month_Name": month_name,
            "Year_Month": year_month,
            "Quarter": quarter,
            "Employment_Type": emp_type if emp_type else "Full-time",
            "Has_Salary": has_salary_flag,
            "Salary_Min_USD": round(sal_min_clean, 2) if sal_min_clean is not None else "",
            "Salary_Max_USD": round(sal_max_clean, 2) if sal_max_clean is not None else "",
            "Salary_Avg_USD": round(sal_avg_clean, 2) if sal_avg_clean is not None else "",
            "Skills_List": primary_skills_str,
            "Skill_Count": len(extracted_skills)
        })
        
    print(f"\nData Cleaning Summary:")
    print(f"  • Raw Records Processed  : {len(raw_rows):,}")
    print(f"  • Corrupted Rows Dropped : {removed_corrupted}")
    print(f"  • Duplicate Rows Dropped : {removed_duplicate_rows}")
    print(f"  • Duplicate IDs Dropped  : {removed_duplicate_ids}")
    print(f"  • Clean Job Records      : {len(cleaned_jobs):,}")
    print(f"  • Skill Mappings Created : {len(skill_rows):,}")
    
    # Save clean FactJobs table
    fact_fields = list(cleaned_jobs[0].keys())
    with open(output_jobs, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fact_fields)
        writer.writeheader()
        writer.writerows(cleaned_jobs)
    print(f"Saved Fact Table: {output_jobs}")
    
    # Save DimSkills bridge table
    skill_fields = ["job_id", "skill_name", "skill_category", "skill_type"]
    with open(output_skills, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=skill_fields)
        writer.writeheader()
        writer.writerows(skill_rows)
    print(f"Saved Skills Dimension: {output_skills}")
    
    # Calculate exact metrics for Step 11 ("What I Found")
    total_jobs = len(cleaned_jobs)
    total_companies = len({j["Company"] for j in cleaned_jobs})
    total_locations = len({j["Location"] for j in cleaned_jobs})
    total_countries = len({j["Country"] for j in cleaned_jobs})
    
    ai_jobs = sum(1 for j in cleaned_jobs if j["Is_AI_Job"] == "Yes")
    ai_pct = (ai_jobs / total_jobs) * 100
    
    remote_jobs = sum(1 for j in cleaned_jobs if j["Is_Remote"] == "Yes")
    remote_pct = (remote_jobs / total_jobs) * 100
    
    hybrid_jobs = sum(1 for j in cleaned_jobs if j["Workplace_Modality"] == "Hybrid")
    hybrid_pct = (hybrid_jobs / total_jobs) * 100
    
    onsite_jobs = sum(1 for j in cleaned_jobs if j["Workplace_Modality"] == "On-site")
    onsite_pct = (onsite_jobs / total_jobs) * 100
    
    # Category Distribution
    cat_counts = Counter(j["Job_Category"] for j in cleaned_jobs)
    cat_pcts = {c: round((count / total_jobs) * 100, 2) for c, count in cat_counts.most_common()}
    top_cat, top_cat_count = cat_counts.most_common(1)[0]
    
    # Seniority Distribution
    sen_counts = Counter(j["Seniority"] for j in cleaned_jobs)
    sen_pcts = {s: round((count / total_jobs) * 100, 2) for s, count in sen_counts.most_common()}
    
    # Country Distribution
    country_counts = Counter(j["Country"] for j in cleaned_jobs)
    top_country, top_country_count = country_counts.most_common(1)[0]
    
    # Salary Analysis (filtered to where salary is reported)
    salaries = [float(j["Salary_Avg_USD"]) for j in cleaned_jobs if j["Has_Salary"] == "Yes"]
    salary_jobs_count = len(salaries)
    salary_disclosure_pct = (salary_jobs_count / total_jobs) * 100
    avg_salary = statistics.mean(salaries) if salaries else 0
    med_salary = statistics.median(salaries) if salaries else 0
    
    # AI vs Non-AI Salary
    ai_salaries = [float(j["Salary_Avg_USD"]) for j in cleaned_jobs if j["Has_Salary"] == "Yes" and j["Is_AI_Job"] == "Yes"]
    non_ai_salaries = [float(j["Salary_Avg_USD"]) for j in cleaned_jobs if j["Has_Salary"] == "Yes" and j["Is_AI_Job"] == "No"]
    ai_avg_sal = statistics.mean(ai_salaries) if ai_salaries else 0
    ai_med_sal = statistics.median(ai_salaries) if ai_salaries else 0
    non_ai_avg_sal = statistics.mean(non_ai_salaries) if non_ai_salaries else 0
    non_ai_med_sal = statistics.median(non_ai_salaries) if non_ai_salaries else 0
    ai_salary_premium_pct = ((ai_avg_sal - non_ai_avg_sal) / non_ai_avg_sal) * 100 if non_ai_avg_sal > 0 else 0
    
    # Top Skills
    skill_counts = Counter(s["skill_name"] for s in skill_rows)
    top_skill, top_skill_count = skill_counts.most_common(1)[0]
    top_10_skills = [{"skill": s, "count": c, "pct_of_jobs": round((c / total_jobs) * 100, 1)} for s, c in skill_counts.most_common(10)]
    
    summary_metrics = {
        "dataset_name": "2026 Global All-Industry Job Dataset",
        "dataset_date_range": "2026-01-01 to 2026-08-30",
        "total_jobs": total_jobs,
        "total_companies": total_companies,
        "total_locations": total_locations,
        "total_countries": total_countries,
        "ai_jobs": ai_jobs,
        "ai_job_percentage": round(ai_pct, 2),
        "non_ai_jobs": total_jobs - ai_jobs,
        "non_ai_job_percentage": round(100 - ai_pct, 2),
        "remote_jobs": remote_jobs,
        "remote_job_percentage": round(remote_pct, 2),
        "hybrid_job_percentage": round(hybrid_pct, 2),
        "onsite_job_percentage": round(onsite_pct, 2),
        "salary_disclosure_percentage": round(salary_disclosure_pct, 2),
        "salary_records_count": salary_jobs_count,
        "overall_average_salary_usd": round(avg_salary, 2),
        "overall_median_salary_usd": round(med_salary, 2),
        "ai_average_salary_usd": round(ai_avg_sal, 2),
        "ai_median_salary_usd": round(ai_med_sal, 2),
        "non_ai_average_salary_usd": round(non_ai_avg_sal, 2),
        "non_ai_median_salary_usd": round(non_ai_med_sal, 2),
        "ai_salary_premium_pct": round(ai_salary_premium_pct, 2),
        "top_category": top_cat,
        "top_category_share_pct": cat_pcts[top_cat],
        "category_distribution": cat_pcts,
        "seniority_distribution": sen_pcts,
        "top_country": top_country,
        "top_country_share_pct": round((top_country_count / total_jobs) * 100, 2),
        "top_skill": top_skill,
        "top_skill_count": top_skill_count,
        "top_skill_percentage": round((top_skill_count / total_jobs) * 100, 1),
        "top_10_skills": top_10_skills
    }
    
    with open(output_metrics, "w", encoding="utf-8") as f:
        json.dump(summary_metrics, f, indent=2)
    print(f"Saved Summary Metrics: {output_metrics}")
    
    print("\nCalculated Verified 2026 Job Market Insights:")
    for k, v in summary_metrics.items():
        if isinstance(v, (str, int, float)):
            print(f"  • {k:<30}: {v}")

if __name__ == "__main__":
    clean_and_transform_dataset()
