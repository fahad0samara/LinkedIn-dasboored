"""
2026 Global Job Market Analysis - Step 1: Data Inspection Script
Inspects the raw 2026 all-industry job dataset schema, data types, missing values, duplicates, and column utility.
"""

import csv
import json
from collections import Counter
from datetime import datetime

def inspect_dataset(file_path="data/raw/jobs_2026_raw.csv"):
    print("=" * 80)
    print("2026 GLOBAL ALL-INDUSTRY JOB DATASET: DATA QUALITY & SCHEMA INSPECTION REPORT")
    print("=" * 80)
    
    rows = []
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        for r in reader:
            rows.append(r)
            
    total_rows = len(rows)
    total_cols = len(headers)
    
    print(f"\n[1] BASIC DATASET DIMENSIONS:")
    print(f"  • Total Records (Rows)   : {total_rows:,}")
    print(f"  • Total Columns          : {total_cols}")
    print(f"  • Column Names           : {', '.join(headers)}")
    
    # Check data types & missing values
    print(f"\n[2] COLUMN DATA TYPES & COMPLETENESS:")
    print(f"  {'-'*75}")
    print(f"  {'Column Name':<20} | {'Inferred Type':<15} | {'Null Count':<12} | {'Fill Rate %':<10}")
    print(f"  {'-'*75}")
    
    null_counts = {col: 0 for col in headers}
    for r in rows:
        for col in headers:
            val = r.get(col, "").strip()
            if not val or val.lower() in ["none", "null", "n/a", ""]:
                null_counts[col] += 1
                
    for col in headers:
        null_cnt = null_counts[col]
        fill_rate = ((total_rows - null_cnt) / total_rows) * 100
        # Inferred type
        if "salary" in col and "currency" not in col and "interval" not in col:
            inferred = "Numeric / Float"
        elif "date" in col:
            inferred = "Date (YYYY-MM-DD)"
        elif col == "job_id":
            inferred = "String (Unique ID)"
        else:
            inferred = "String / Categorical"
        print(f"  {col:<20} | {inferred:<15} | {null_cnt:<12} | {fill_rate:>6.1f}%")
        
    # Duplicates check
    job_ids = [r["job_id"] for r in rows if r["job_id"]]
    unique_job_ids = set(job_ids)
    duplicate_ids_count = len(job_ids) - len(unique_job_ids)
    
    # Exact row duplicates
    serialized_rows = [tuple(sorted(r.items())) for r in rows]
    unique_rows = set(serialized_rows)
    exact_duplicate_rows = len(rows) - len(unique_rows)
    
    print(f"\n[3] DUPLICATE AUDIT:")
    print(f"  • Duplicate Job IDs      : {duplicate_ids_count}")
    print(f"  • Exact Duplicate Rows   : {exact_duplicate_rows}")
    
    # Cardinality & Range Checks
    companies = {r["company_name"] for r in rows if r["company_name"] and r["company_name"] != "Unknown Corp"}
    countries = {r["country"] for r in rows if r["country"] and r["country"] != "Unknown"}
    titles = {r["job_title"] for r in rows if r["job_title"]}
    locations = {r["location"] for r in rows if r["location"] and r["location"] != "N/A"}
    
    # Valid Dates
    valid_dates = []
    for r in rows:
        try:
            d = datetime.strptime(r["date_posted"], "%Y-%m-%d")
            valid_dates.append(d)
        except Exception:
            pass
            
    min_date = min(valid_dates).strftime("%Y-%m-%d") if valid_dates else "N/A"
    max_date = max(valid_dates).strftime("%Y-%m-%d") if valid_dates else "N/A"
    
    print(f"\n[4] DATASET CARDINALITY & COVERAGE:")
    print(f"  • Unique Companies       : {len(companies):,}")
    print(f"  • Unique Countries       : {len(countries):,}")
    print(f"  • Unique Job Titles      : {len(titles):,}")
    print(f"  • Unique Locations       : {len(locations):,}")
    print(f"  • Date Range             : {min_date} to {max_date}")
    
    # Salary Information
    has_salary_min = sum(1 for r in rows if r.get("salary_min", "").strip() != "")
    has_salary_max = sum(1 for r in rows if r.get("salary_max", "").strip() != "")
    print(f"\n[5] SPECIAL FEATURE AVAILABILITY:")
    print(f"  • Salary Information     : {has_salary_min:,} records ({has_salary_min/total_rows*100:.1f}%) contain explicit salary")
    print(f"  • Remote/Workplace Info  : {sum(1 for r in rows if r.get('workplace_type')):,} records ({100 - null_counts['workplace_type']/total_rows*100:.1f}%)")
    print(f"  • Seniority Information  : {sum(1 for r in rows if r.get('seniority_raw')):,} records ({100 - null_counts['seniority_raw']/total_rows*100:.1f}%) raw in ATS (inferrable from Title)")
    print(f"  • Job Description Field  : {'Yes - Full requirement text present for skill extraction' if 'job_description' in headers else 'No'}")
    
    # Example Records
    print(f"\n[6] EXAMPLE RAW RECORDS (First 2):")
    for idx, r in enumerate(rows[:2], 1):
        print(f"  --- Sample Record #{idx} ---")
        for k, v in r.items():
            truncated = (v[:75] + "...") if len(v) > 75 else v
            print(f"    {k:<18}: {truncated}")
            
    # Power BI Column Utility Assessment
    print(f"\n[7] POWER BI COLUMN UTILITY ASSESSMENT:")
    print(f"  • Highly Useful for Power BI Dimensions & Measures:")
    print(f"    - job_id              → Primary Key / Total Jobs measure (DISTINCTCOUNT)")
    print(f"    - job_title           → Top Job Titles & Seniority derivation")
    print(f"    - company_name        → DimCompany / Total Companies measure")
    print(f"    - location & country  → DimLocation / Geographic maps and slicers")
    print(f"    - workplace_type      → Is_Remote flag (Yes/No/Unknown)")
    print(f"    - department          → Feedstock for normalized Job_Category")
    print(f"    - salary_min & max    → Average / Median Salary measures (USD)")
    print(f"    - date_posted         → DimDate / Time intelligence trends")
    print(f"    - job_description     → Source for Skill parsing & AI job validation")
    print(f"  • Exclude / Flatten from Final Star Schema:")
    print(f"    - Raw unparsed description (keep in raw, extract normalized DimSkill)")
    print(f"    - Redundant raw interval / currency columns once converted to annual USD")
    print("=" * 80)

if __name__ == "__main__":
    inspect_dataset()
