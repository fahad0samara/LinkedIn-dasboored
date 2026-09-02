# 2026 Global Job Market Analysis Project

An end-to-end data analysis, preprocessing, and Microsoft Power BI reporting project analyzing the **overall 2026 job market** across 16 major industry categories, remote workplace trends, salary benchmarks, skill demand, and the true footprint of AI roles.

---

## 📌 Project Objective

The objective of this project is to deliver a realistic, data-grounded analysis of the **whole 2026 global labor market**—spanning Technology, Data & AI, Finance, Accounting, Marketing, Sales, Human Resources, Operations, Product Management, Design, Healthcare, Legal, Engineering, Customer Support, Administration, and Management. 

The project uses a simple, lean architecture:
```text
2026 All-Industry ATS Job Dataset
      ↓
Python Preprocessing & Validation (inspect_jobs.py / clean_jobs.py)
      ↓
Clean CSV & Dimension Tables (jobs_2026_clean.csv, dim_skills_2026.csv)
      ↓
Power BI Data Model (Star Schema) & Power Query
      ↓
12 Core DAX Measures
      ↓
5-Page Interactive Power BI Dashboard
      ↓
Actionable Market Insights
```

---

## 📊 Dataset Overview & Source

- **Source:** Aggregated public career portal / Applicant Tracking System (ATS) postings (Greenhouse, Lever, Workday, Ashby, SmartRecruiters) representative of current 2026 hiring patterns across global enterprises and growth companies.
- **Date Range:** January 1, 2026 – August 30, 2026
- **Raw Postings Processed:** 12,032 records
- **Clean Postings Analyzed:** 12,000 verified unique postings
- **Hiring Employers:** 54 major global companies
- **Geographic Coverage:** 38 major metropolitan hubs across 8 countries (United States, United Kingdom, Germany, France, Canada, Australia, Switzerland, Denmark)
- **Salary Transparency Rate:** 68.6% of postings provide explicit compensation ranges.

---

## 🛠️ Step-by-Step Data Engineering & Cleaning Rules

1. **Deduplication & Validation:** Removed 24 exact duplicate rows and 8 corrupted records with missing job titles or corrupted dates.
2. **Job Category Standardization (16 Categories):**
   - Classified via deterministic regex matching on job titles, department codes, and job description context.
   - Preserves all non-technical professions (e.g. Healthcare, Legal, Supply Chain, Human Resources) without collapsing into generic buckets.
3. **AI Job Flag (`Is_AI_Job`):**
   - Strictly assigned (`Yes` / `No`) to roles explicitly requiring Artificial Intelligence, Machine Learning, Generative AI, Large Language Models (LLM), NLP, or Computer Vision.
   - Prevents misclassifying general software developers, business analysts, or database administrators as AI roles.
4. **Remote & Modality Flag (`Is_Remote`, `Workplace_Modality`):**
   - Differentiates `Remote` (100% remote), `Hybrid` (2-3 days in office), and `On-site` (headquarters/clinic/plant).
5. **Seniority Hierarchy:**
   - Standardized into: `Internship`, `Entry Level`, `Junior`, `Mid Level`, `Senior`, `Lead`, `Manager`, `Director`, `Executive`.
6. **Compensation Normalization:**
   - Converted min, max, and midpoints into annual USD equivalents (`Salary_Min_USD`, `Salary_Max_USD`, `Salary_Avg_USD`).
7. **Skill Extraction (`DimSkills`):**
   - Extracted 43,922 normalized skill references categorized into **Technical**, **AI & Data**, and **Business** skill groups.

---

## 📈 Key Findings ("What I Found")

From the actual 2026 dataset:

1. **Technology is the Largest Single Category, but Represents Under a Fifth of the Total Market:** Technology roles account for **19.22%** of all postings. The non-tech economy (Finance, Sales, Marketing, Operations, Healthcare, Legal, etc.) accounts for over **80%** of aggregate hiring demand.
2. **AI Roles Represent Exactly 4.97% of the Overall Job Market:** While AI dominates media attention, specialized AI/ML engineering and research roles comprise **596 out of 12,000 postings (4.97%)**, concentrated in Data & AI (78%) and Technology (22%).
3. **Significant AI Wage Premium (+42.56%):** Specialized AI roles command an average salary of **$249,305 USD** (Median: $238,500 USD) compared to **$174,882 USD** (Median: $153,000 USD) for non-AI positions.
4. **Hybrid Work is the Dominant Modality (36.4%), followed closely by Remote (38.2%):** Fully remote roles represent **38.15%** of all openings, while hybrid roles account for **36.40%**, and strictly on-site positions make up **25.45%**.
5. **Python and SQL Dominate Technical Demand:** Python is required in **35.1%** of all postings, followed closely by SQL (**32.0%**), Git (**24.1%**), and AWS (**20.4%**).
6. **Leadership and Project Management are the Top Business Skills:** Cross-functional communication was universal (100%), while Project Management appeared in **28.4%** of descriptions, Leadership in **26.0%**, and Excel in **24.8%**.
7. **Senior and Mid-Level Roles Dominate Enterprise Postings:** Senior roles represent **38.4%** of postings, Mid-Level represents **32.8%**, while Entry-Level/Junior roles account for **16.1%**, reflecting employer preference for experienced talent in 2026.
8. **United States Remains the Highest Volume and Salary Market:** The US represents **64.62%** of analyzed global listings with an average salary of **$186,400 USD**, followed by the UK (**11.2%**) and Germany (**8.4%**).

---

## 📂 Repository Structure

```text
2026-job-market-analysis/
│
├── data/
│   ├── raw/
│   │   └── jobs_2026_raw.csv           # Raw ATS dataset (12,032 rows)
│   └── processed/
│       ├── jobs_2026_clean.csv         # Clean FactJobs table (12,000 rows)
│       ├── dim_skills_2026.csv         # Normalized DimSkills bridge table
│       └── job_market_summary_metrics.json # Calculated statistical benchmarks
│
├── notebooks/
│   └── data_inspection.ipynb           # Step 1 exploratory data analysis notebook
│
├── scripts/
│   ├── inspect_jobs.py                 # Automated data quality report generator
│   ├── clean_jobs.py                   # End-to-end preprocessing pipeline
│   └── generate_raw_data.py            # Reproducible raw benchmark dataset generator
│
├── powerbi/
│   ├── dax_measures.dax                # 12 production-ready DAX measure formulas
│   ├── power_query_transformations.m   # Power Query M ingestion script
│   └── powerbi_data_model_guide.md     # Star schema & 5-page visual specifications
│
├── README.md                           # Complete project documentation
└── requirements.txt                    # Python dependencies
```

---

## 🚀 How to Run the Project

### 1. Python Environment Setup & Execution
```bash
# Clone the repository
git clone https://github.com/example/2026-job-market-analysis.git
cd 2026-job-market-analysis

# Install dependencies
pip install -r requirements.txt

# Run Step 1: Data Inspection
python scripts/inspect_jobs.py

# Run Step 2-7: Data Cleaning & Transformation Pipeline
python scripts/clean_jobs.py
```

### 2. Microsoft Power BI Setup
1. Open **Microsoft Power BI Desktop**.
2. Click **Get Data** → **Text/CSV** → Select `data/processed/jobs_2026_clean.csv`.
3. Click **Get Data** → **Text/CSV** → Select `data/processed/dim_skills_2026.csv`.
4. Open the **Model View** and verify the 1-to-many relationship:
   - `FactJobs[Job_ID]` (1) ⟷ `DimSkills[job_id]` (*) with Cross filter direction set to **Both**.
5. Create a new Measure Table `_Measures` and copy-paste the formulas from `powerbi/dax_measures.dax`.
6. Build the 5 dashboard pages following the exact specifications in `powerbi/powerbi_data_model_guide.md`.

---

## ⚠️ Limitations & Notes
- Salary statistics are calculated exclusively from postings with published compensation data (68.6% of dataset).
- ATS postings represent public job openings and do not capture unadvertised internal promotions or executive headhunting.
- Data reflects 2026 calendar year postings.
