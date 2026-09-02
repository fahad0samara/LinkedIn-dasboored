# Power BI Data Model & Dashboard Implementation Guide
**Project:** 2026 Global Job Market Analysis  
**Dataset:** 2026 All-Industry ATS Job Postings  

---

## 1. Data Model Architecture (Star Schema)

We recommend a lightweight Star Schema consisting of 1 Fact table and 2 Dimension/Bridge tables:

```text
       ┌──────────────┐
       │   DimDate    │
       │ (1:Many, 1-way)
       └──────┬───────┘
              │ [Date] = [Date_Posted]
              ▼
       ┌──────────────┐              ┌──────────────┐
       │   FactJobs   │◄────────────│  DimSkills   │
       │ (Primary Fact│ (1:Many, 2-way) (Skill Bridge│
       └──────────────┘ [Job_ID] = [job_id]          │
                                     └──────────────┘
```

### Table Relationships:
1. **`DimDate[Date]` 1 → `FactJobs[Date_Posted]` * (Single direction filter)**
2. **`FactJobs[Job_ID]` 1 → `DimSkills[job_id]` * (Bi-directional filter enabled for cross-filtering by skill)**

---

## 2. Dashboard Layout & Page-by-Page Visual Design

### Page 1: Job Market Overview
**Key Question:** *What does the 2026 global job market look like across industries?*
- **Header KPI Cards (Top Banner):**
  - Card 1: `[Total Jobs]` (e.g. 12,000)
  - Card 2: `[Total Companies]` (54 Hiring Organizations)
  - Card 3: `[Total Locations]` (38 Global Hubs across 8 Countries)
  - Card 4: `[Remote Job %]` (38.2%)
  - Card 5: `[AI Job %]` (5.0%)
- **Visual 1 (Horizontal Clustered Bar):** Postings by `Job_Category` (Sorted descending by `[Total Jobs]`).
- **Visual 2 (Map / Filled Map):** Global Job Density by `Country` and `Location`.
- **Visual 3 (Donut Chart):** Workplace Distribution (`Workplace_Modality`: Remote, Hybrid, On-site).
- **Visual 4 (Table / Top N):** Top 10 Job Titles by Volume with Average Salary callout.
- **Slicers (Top Right):** `Country`, `Job_Category`, `Date Range`.

---

### Page 2: Job Demand
**Key Question:** *Which specific job roles, seniority levels, and categories are companies hiring for?*
- **Visual 1 (Treemap / Bar Chart):** `Job_Category` Breakdown showing volume and share.
- **Visual 2 (Funnel / Column Chart):** `Seniority` Hierarchy Distribution (Entry Level, Junior, Mid Level, Senior, Lead, Manager, Director, Executive).
- **Visual 3 (100% Stacked Bar Chart):** Remote vs Hybrid vs On-site distribution by `Job_Category`.
- **Visual 4 (Matrix Table):** `Company` vs `Job_Category` with heatmapped cell backgrounds for hiring intensity.
- **Slicers:** `Seniority`, `Workplace_Modality`, `Employment_Type`.

---

### Page 3: Skills Demand
**Key Question:** *What competencies, programming languages, and tools are employers demanding in 2026?*
- **Visual 1 (Ranked Horizontal Bar):** Top 15 Overall Skills by `[Skill Postings Count]` using `DimSkills[skill_name]`.
- **Visual 2 (Grouped Column Chart):** Skills grouped by `DimSkills[skill_category]` (Technical vs AI & Data vs Business).
- **Visual 3 (Clustered Bar):** Most Requested Programming Languages (Python, SQL, JavaScript/TypeScript, Java, C++, C#/.NET).
- **Visual 4 (Matrix Heatmap):** `FactJobs[Job_Category]` on rows, `DimSkills[skill_name]` on columns, values = `[Skill Penetration %]`.
- **Slicers:** `skill_category`, `skill_type`, `Job_Category`.

---

### Page 4: Salary Analysis
**Key Question:** *What is the compensation landscape across seniority levels, categories, and geographies?*
- **Top Metrics:**
  - Card 1: `[Average Salary]` ($178,574 USD)
  - Card 2: `[Median Salary]` ($158,500 USD)
  - Card 3: `[Salary Disclosure %]` (68.6% Transparency rate)
- **Visual 1 (Box Plot / Column with Min/Max Error Bars):** Salary Range (`[Salary_Min_USD]`, `[Salary_Avg_USD]`, `[Salary_Max_USD]`) by `Job_Category`.
- **Visual 2 (Line / Stepped Chart):** Median Salary Progression by `Seniority` level.
- **Visual 3 (Bar Chart):** Average Salary by `Country` / `Location`.
- **Visual 4 (Scatter Plot):** Volume of Postings vs Average Salary by `Job_Category`.
- **Filter Note:** Explicitly filtered on `FactJobs[Has_Salary] = "Yes"`.

---

### Page 5: AI vs Overall Market
**Key Question:** *How significant is AI hiring compared with the overall 2026 job market?*
- **Top Comparative KPI Cards:**
  - Side A (AI Jobs): `[AI Jobs]` (596 roles | 5.0% of Market) | `[AI Average Salary]` ($249,305 USD)
  - Side B (Non-AI Jobs): `[Non-AI Jobs]` (11,404 roles | 95.0% of Market) | `[Non-AI Average Salary]` ($174,882 USD)
  - Differential: `[AI Salary Premium %]` (+42.6% wage premium)
- **Visual 1 (100% Stacked Bar):** AI vs Non-AI Share across each `Job_Category` (shows AI concentration primarily in Data & AI and Technology).
- **Visual 2 (Clustered Column):** Seniority Distribution Comparison (AI vs Non-AI).
- **Visual 3 (Clustered Bar):** Top Skills Demanded in AI Roles vs Overall Postings.
- **Visual 4 (Donut Chart):** Remote Work Adoption in AI roles vs Non-AI roles.

---

## 3. Power BI Color Palette
- **Primary Navy:** `#1E293B`
- **Accent Emerald / Data:** `#059669`
- **Secondary Slate:** `#64748B`
- **Highlight Amber:** `#D97706`
- **AI Focus Violet:** `#7C3AED`
- **Background Neutral:** `#F8FAFC`
