import os
import json
import csv
import random
from datetime import datetime, timedelta

os.makedirs('data/raw', exist_ok=True)
os.makedirs('data/processed', exist_ok=True)
os.makedirs('notebooks', exist_ok=True)
os.makedirs('scripts', exist_ok=True)
os.makedirs('powerbi', exist_ok=True)

# Generate a high-quality, realistic 2026 all-industry job dataset (10,000 diverse records across all 16 categories)
random.seed(42)

companies = [
    ("Google", "Technology", "United States"),
    ("Microsoft", "Technology", "United States"),
    ("Apple", "Technology", "United States"),
    ("Amazon", "Technology", "United States"),
    ("NVIDIA", "Technology", "United States"),
    ("Meta", "Technology", "United States"),
    ("Salesforce", "Technology", "United States"),
    ("Stripe", "Finance", "United States"),
    ("JPMorgan Chase", "Finance", "United States"),
    ("Goldman Sachs", "Finance", "United States"),
    ("Morgan Stanley", "Finance", "United States"),
    ("Deloitte", "Accounting", "United Kingdom"),
    ("PwC", "Accounting", "United Kingdom"),
    ("KPMG", "Accounting", "Germany"),
    ("Ernst & Young", "Accounting", "United States"),
    ("Pfizer", "Healthcare", "United States"),
    ("Novartis", "Healthcare", "Switzerland"),
    ("AstraZeneca", "Healthcare", "United Kingdom"),
    ("Siemens", "Engineering", "Germany"),
    ("Bosch", "Engineering", "Germany"),
    ("Schneider Electric", "Engineering", "France"),
    ("Nike", "Marketing", "United States"),
    ("L'Oréal", "Marketing", "France"),
    ("Unilever", "Operations", "United Kingdom"),
    ("Procter & Gamble", "Operations", "United States"),
    ("McKinsey & Company", "Management", "United States"),
    ("Boston Consulting Group", "Management", "United States"),
    ("Bain & Company", "Management", "United States"),
    ("HubSpot", "Marketing", "United States"),
    ("Zendesk", "Customer Support", "United States"),
    ("Datadog", "Technology", "United States"),
    ("Snowflake", "Data & AI", "United States"),
    ("OpenAI", "Data & AI", "United States"),
    ("Anthropic", "Data & AI", "United States"),
    ("Cohere", "Data & AI", "Canada"),
    ("Mistral AI", "Data & AI", "France"),
    ("Palantir", "Data & AI", "United States"),
    ("CrowdStrike", "Technology", "United States"),
    ("Shopify", "Technology", "Canada"),
    ("Atlassian", "Technology", "Australia"),
    ("Canva", "Design", "Australia"),
    ("Figma", "Design", "United States"),
    ("Clifford Chance", "Legal", "United Kingdom"),
    ("Baker McKenzie", "Legal", "United States"),
    ("Latham & Watkins", "Legal", "United States"),
    ("Mayo Clinic", "Healthcare", "United States"),
    ("NHS", "Healthcare", "United Kingdom"),
    ("UnitedHealth Group", "Healthcare", "United States"),
    ("Target", "Operations", "United States"),
    ("DHL Group", "Operations", "Germany"),
    ("Maersk", "Operations", "Denmark"),
    ("Workday", "Human Resources", "United States"),
    ("ADP", "Human Resources", "United States"),
    ("Mercer", "Human Resources", "United States"),
]

job_templates = {
    "Technology": [
        ("Software Engineer", "Mid Level", ["Python", "Java", "Docker", "Git", "Kubernetes", "AWS"]),
        ("Senior Full Stack Developer", "Senior", ["JavaScript", "React", "Python", "Docker", "AWS", "Git"]),
        ("DevOps Engineer", "Mid Level", ["AWS", "Docker", "Kubernetes", "Git", "Python", "Azure"]),
        ("Staff Backend Engineer", "Lead", ["Java", "Go", "Kubernetes", "AWS", "Docker", "Git"]),
        ("Cloud Infrastructure Architect", "Director", ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Leadership"]),
        ("Frontend Engineer", "Mid Level", ["JavaScript", "React", "Git"]),
        (".NET Core Developer", "Senior", [".NET", "C#", "Azure", "SQL", "Git"]),
        ("C++ Embedded Systems Engineer", "Senior", ["C++", "Git", "Linux"]),
        ("Junior Web Developer", "Junior", ["JavaScript", "React", "Git", "HTML", "CSS"]),
        ("Engineering Manager", "Manager", ["Leadership", "Project Management", "Git", "Communication"]),
        ("Security Operations Analyst", "Mid Level", ["Python", "AWS", "Git", "Linux"]),
        ("Site Reliability Engineer", "Senior", ["Python", "Kubernetes", "Docker", "GCP", "Git"]),
    ],
    "Data & AI": [
        ("Data Analyst", "Mid Level", ["SQL", "Excel", "Python", "Tableau", "Power BI", "Communication"]),
        ("Senior Data Scientist", "Senior", ["Python", "SQL", "Machine Learning", "Deep Learning", "PyTorch", "AWS"]),
        ("Machine Learning Engineer", "Mid Level", ["Python", "Machine Learning", "PyTorch", "TensorFlow", "Docker", "Git"]),
        ("AI Research Scientist", "Senior", ["Python", "PyTorch", "Deep Learning", "LLM", "Generative AI", "NLP"]),
        ("Generative AI Solutions Architect", "Lead", ["Python", "LLM", "Generative AI", "AWS", "Azure", "Leadership"]),
        ("Lead Data Engineer", "Lead", ["Python", "SQL", "AWS", "Azure", "Docker", "Kubernetes", "Leadership"]),
        ("Computer Vision Engineer", "Senior", ["Python", "PyTorch", "Computer Vision", "Deep Learning", "C++"]),
        ("NLP Engineer", "Mid Level", ["Python", "NLP", "LLM", "PyTorch", "Machine Learning"]),
        ("Business Intelligence Developer", "Mid Level", ["SQL", "Power BI", "Excel", "Data Modeling"]),
        ("Data Science Intern", "Internship", ["Python", "SQL", "Machine Learning"]),
        ("Director of AI & Advanced Analytics", "Director", ["Leadership", "Machine Learning", "Generative AI", "Project Management"]),
        ("Analytics Engineer", "Mid Level", ["SQL", "Python", "dbt", "Git", "Snowflake"]),
    ],
    "Finance": [
        ("Financial Analyst", "Mid Level", ["Excel", "Financial Modeling", "Communication", "SQL"]),
        ("Senior Investment Associate", "Senior", ["Excel", "Financial Modeling", "Leadership", "Valuation"]),
        ("Corporate Finance Manager", "Manager", ["Excel", "Leadership", "Project Management", "Financial Reporting"]),
        ("Risk Analyst", "Mid Level", ["Excel", "Python", "SQL", "Risk Management"]),
        ("VP of Global Finance", "Executive", ["Leadership", "Strategic Planning", "Financial Modeling", "Executive Communication"]),
        ("Treasury Analyst", "Junior", ["Excel", "SAP", "Communication"]),
    ],
    "Accounting": [
        ("Staff Accountant", "Junior", ["Excel", "SAP", "QuickBooks", "Communication"]),
        ("Senior Auditor", "Senior", ["Excel", "Audit Standards", "Project Management", "Leadership"]),
        ("Tax Manager", "Manager", ["Excel", "Tax Compliance", "Leadership", "Communication"]),
        ("Controller", "Director", ["Leadership", "SAP", "Excel", "Financial Reporting"]),
        ("Accounts Payable Specialist", "Entry Level", ["Excel", "SAP", "Communication"]),
    ],
    "Marketing": [
        ("Digital Marketing Specialist", "Mid Level", ["Google Analytics", "SEO", "Salesforce", "Communication"]),
        ("Content Marketing Manager", "Manager", ["Content Strategy", "Communication", "Project Management", "Leadership"]),
        ("Brand Strategist", "Senior", ["Communication", "Market Research", "Project Management"]),
        ("Growth Marketing Lead", "Lead", ["SQL", "Google Analytics", "Python", "Leadership", "A/B Testing"]),
        ("Social Media Coordinator", "Entry Level", ["Communication", "Copywriting", "Canva"]),
        ("Chief Marketing Officer (CMO)", "Executive", ["Leadership", "Strategic Planning", "Communication"]),
    ],
    "Sales": [
        ("Sales Development Representative (SDR)", "Entry Level", ["Salesforce", "Communication", "Cold Outreach"]),
        ("Account Executive", "Mid Level", ["Salesforce", "Negotiation", "Communication", "Pipeline Management"]),
        ("Enterprise Sales Director", "Director", ["Salesforce", "Leadership", "Negotiation", "Executive Communication"]),
        ("Key Account Manager", "Manager", ["Salesforce", "Communication", "Relationship Management", "Leadership"]),
        ("Sales Operations Analyst", "Mid Level", ["Salesforce", "Excel", "SQL", "Communication"]),
    ],
    "Human Resources": [
        ("HR Generalist", "Mid Level", ["HRIS", "Workday", "Communication", "Employee Relations"]),
        ("Senior Technical Recruiter", "Senior", ["Talent Acquisition", "Communication", "Sourcing", "LinkedIn Recruiter"]),
        ("Head of People & Culture", "Director", ["Leadership", "HR Strategy", "Workday", "Communication"]),
        ("Compensation & Benefits Analyst", "Mid Level", ["Excel", "Workday", "Data Analysis", "Communication"]),
        ("HR Assistant", "Entry Level", ["Communication", "HRIS", "Excel"]),
    ],
    "Operations": [
        ("Operations Manager", "Manager", ["Project Management", "Leadership", "Process Improvement", "Excel"]),
        ("Supply Chain Analyst", "Mid Level", ["SAP", "Excel", "SQL", "Logistics"]),
        ("Logistics Coordinator", "Entry Level", ["Communication", "SAP", "Excel"]),
        ("Director of Global Supply Chain", "Director", ["Leadership", "SAP", "Strategic Sourcing", "Project Management"]),
        ("Business Process Specialist", "Senior", ["Process Mapping", "Project Management", "Communication"]),
    ],
    "Product": [
        ("Associate Product Manager", "Junior", ["Product Discovery", "Communication", "Jira", "SQL"]),
        ("Senior Product Manager", "Senior", ["Product Strategy", "Project Management", "Leadership", "SQL", "Communication"]),
        ("Group Product Manager", "Lead", ["Leadership", "Product Vision", "Roadmapping", "Strategic Planning"]),
        ("VP of Product Management", "Executive", ["Leadership", "Product Strategy", "Executive Communication"]),
        ("Technical Product Manager", "Senior", ["SQL", "Python", "API Design", "Project Management", "Leadership"]),
    ],
    "Design": [
        ("UI/UX Designer", "Mid Level", ["Figma", "Design Systems", "Prototyping", "User Research"]),
        ("Senior Product Designer", "Senior", ["Figma", "User Research", "Design Systems", "Leadership"]),
        ("Brand & Graphic Designer", "Mid Level", ["Adobe Creative Suite", "Figma", "Typography", "Communication"]),
        ("Design Director", "Director", ["Leadership", "Design Systems", "Strategic Vision", "Communication"]),
        ("Design Systems Specialist", "Senior", ["Figma", "CSS", "Design Tokens", "Git"]),
    ],
    "Healthcare": [
        ("Registered Nurse (RN) - ICU", "Mid Level", ["Clinical Care", "Patient Safety", "Critical Care", "Communication"]),
        ("Clinical Research Associate", "Mid Level", ["GCP/ICH", "Clinical Protocols", "Data Collection", "Communication"]),
        ("Medical Director", "Director", ["Clinical Governance", "Leadership", "Medical Research", "Communication"]),
        ("Healthcare Data Coordinator", "Junior", ["Epic EHR", "Excel", "Medical Terminology", "Communication"]),
        ("Pharmacy Operations Specialist", "Mid Level", ["Pharmacy Systems", "Compliance", "Communication"]),
    ],
    "Legal": [
        ("Corporate Counsel - Commercial Contracts", "Senior", ["Contract Negotiation", "Legal Compliance", "Communication"]),
        ("Compliance Officer", "Mid Level", ["Regulatory Compliance", "Risk Management", "Audit", "Communication"]),
        ("Senior Intellectual Property Attorney", "Senior", ["Patent Law", "IP Strategy", "Legal Writing", "Negotiation"]),
        ("Legal Operations Specialist", "Mid Level", ["Legal Tech", "Project Management", "Excel", "Contract Management"]),
        ("General Counsel", "Executive", ["Leadership", "Corporate Governance", "Executive Advisory", "Risk Management"]),
    ],
    "Engineering": [
        ("Mechanical Design Engineer", "Mid Level", ["SolidWorks", "CAD", "Thermal Analysis", "Project Management"]),
        ("Electrical Engineer", "Senior", ["PCB Design", "Circuit Analysis", "AutoCAD", "Git"]),
        ("Civil & Structural Project Engineer", "Senior", ["AutoCAD", "Structural Analysis", "Project Management", "Leadership"]),
        ("Manufacturing Process Engineer", "Mid Level", ["Lean Six Sigma", "Process Optimization", "AutoCAD", "Excel"]),
        ("Robotics Systems Engineer", "Senior", ["Python", "C++", "ROS", "Robotics", "Linux", "Git"]),
    ],
    "Customer Support": [
        ("Customer Success Manager", "Mid Level", ["Zendesk", "Salesforce", "Customer Retention", "Communication"]),
        ("Technical Support Specialist", "Junior", ["Zendesk", "Troubleshooting", "SQL", "Communication"]),
        ("Director of Global Support", "Director", ["Leadership", "Zendesk", "KPI Tracking", "Customer Experience"]),
        ("Support Operations Lead", "Lead", ["Zendesk", "Process Optimization", "Excel", "Communication"]),
    ],
    "Administration": [
        ("Executive Assistant to C-Suite", "Senior", ["Calendar Management", "Executive Communication", "Travel Logistics", "Confidentiality"]),
        ("Office Operations Coordinator", "Entry Level", ["Communication", "Vendor Management", "Excel", "Scheduling"]),
        ("Administrative Specialist", "Mid Level", ["Office 365", "Documentation", "Communication", "Organization"]),
    ],
    "Management": [
        ("General Manager", "Director", ["P&L Management", "Leadership", "Strategic Planning", "Operations Management"]),
        ("Senior Management Consultant", "Senior", ["Strategic Analysis", "Financial Modeling", "Executive Communication", "Project Management"]),
        ("Director of Strategy & Corporate Development", "Director", ["M&A", "Financial Modeling", "Leadership", "Strategic Planning"]),
        ("Chief of Staff", "Executive", ["Strategic Execution", "Leadership", "Cross-functional Coordination", "Executive Communication"]),
    ]
}

locations_by_country = {
    "United States": [
        "San Francisco, CA, United States",
        "New York, NY, United States",
        "Austin, TX, United States",
        "Seattle, WA, United States",
        "Boston, MA, United States",
        "Chicago, IL, United States",
        "Los Angeles, CA, United States",
        "Remote - US",
        "Denver, CO, United States",
        "Atlanta, GA, United States"
    ],
    "United Kingdom": [
        "London, United Kingdom",
        "Manchester, United Kingdom",
        "Edinburgh, United Kingdom",
        "Cambridge, United Kingdom",
        "Remote - UK"
    ],
    "Germany": [
        "Berlin, Germany",
        "Munich, Germany",
        "Frankfurt, Germany",
        "Hamburg, Germany",
        "Remote - Germany"
    ],
    "Canada": [
        "Toronto, ON, Canada",
        "Vancouver, BC, Canada",
        "Montreal, QC, Canada",
        "Ottawa, ON, Canada",
        "Remote - Canada"
    ],
    "Australia": [
        "Sydney, Australia",
        "Melbourne, Australia",
        "Brisbane, Australia",
        "Remote - Australia"
    ],
    "France": [
        "Paris, France",
        "Lyon, France",
        "Toulouse, France",
        "Remote - France"
    ],
    "Switzerland": [
        "Zurich, Switzerland",
        "Geneva, Switzerland",
        "Basel, Switzerland"
    ],
    "Singapore": [
        "Singapore",
        "Remote - Singapore"
    ],
    "Japan": [
        "Tokyo, Japan",
        "Osaka, Japan"
    ],
    "Netherlands": [
        "Amsterdam, Netherlands",
        "Rotterdam, Netherlands",
        "Utrecht, Netherlands"
    ],
    "Denmark": [
        "Copenhagen, Denmark",
        "Aarhus, Denmark"
    ]
}

start_date = datetime(2026, 1, 1)
end_date = datetime(2026, 8, 30)
days_diff = (end_date - start_date).days

# Base salary ranges in USD by seniority and category
category_salary_multipliers = {
    "Technology": 1.15,
    "Data & AI": 1.25,
    "Finance": 1.18,
    "Accounting": 0.95,
    "Marketing": 0.92,
    "Sales": 1.05,
    "Human Resources": 0.88,
    "Operations": 0.90,
    "Product": 1.22,
    "Design": 1.02,
    "Healthcare": 1.08,
    "Legal": 1.30,
    "Engineering": 1.10,
    "Customer Support": 0.72,
    "Administration": 0.68,
    "Management": 1.35,
    "Other": 0.85
}

seniority_base_salaries = {
    "Internship": (35000, 55000),
    "Entry Level": (55000, 78000),
    "Junior": (65000, 92000),
    "Mid Level": (95000, 140000),
    "Senior": (135000, 195000),
    "Lead": (165000, 235000),
    "Manager": (150000, 220000),
    "Director": (200000, 310000),
    "Executive": (280000, 480000),
    "Unknown": (90000, 140000)
}

# Generate 12,000 raw job records
raw_records = []
categories = list(job_templates.keys())

# Weight categories realistically for an all-industry job market
cat_weights = [
    0.20, # Technology
    0.11, # Data & AI
    0.09, # Finance
    0.07, # Accounting
    0.08, # Marketing
    0.09, # Sales
    0.06, # Human Resources
    0.07, # Operations
    0.05, # Product
    0.04, # Design
    0.06, # Healthcare
    0.03, # Legal
    0.07, # Engineering
    0.04, # Customer Support
    0.03, # Administration
    0.04  # Management
]

for i in range(1, 12001):
    job_id = f"ats_2026_{i:06d}"
    cat = random.choices(categories, weights=cat_weights, k=1)[0]
    template = random.choice(job_templates[cat])
    title, seniority_expected, skills = template
    
    # Introduce small realistic title variations (e.g. "Senior", "Lead", "II", "III", "Remote")
    workplace_choice = random.choices(["remote", "hybrid", "on_site"], weights=[0.28, 0.42, 0.30], k=1)[0]
    
    comp_obj = random.choice(companies)
    company_name = comp_obj[0]
    origin_country = comp_obj[2]
    
    if origin_country in locations_by_country:
        loc = random.choice(locations_by_country[origin_country])
        country = origin_country
    else:
        country = "United States"
        loc = random.choice(locations_by_country["United States"])
        
    if "Remote" in loc:
        workplace_choice = "remote"
        
    post_date = start_date + timedelta(days=random.randint(0, days_diff))
    post_date_str = post_date.strftime("%Y-%m-%d")
    
    # Salary availability (~68% have disclosed salary, realistic for 2026 transparency laws)
    has_salary = random.random() < 0.68
    if has_salary:
        base_low, base_high = seniority_base_salaries.get(seniority_expected, (80000, 130000))
        mult = category_salary_multipliers.get(cat, 1.0)
        # Extra premium if AI/ML role
        is_ai_role = any(k in title.lower() for k in ["ai", "machine learning", "generative ai", "llm", "nlp", "computer vision", "deep learning"])
        if is_ai_role:
            mult *= 1.15
        
        salary_min = int(base_low * mult * random.uniform(0.92, 1.05))
        salary_max = int(base_high * mult * random.uniform(0.95, 1.10))
        # Ensure round figures like real postings
        salary_min = round(salary_min, -3)
        salary_max = round(salary_max, -3)
        salary_currency = "USD"
        salary_interval = "yearly"
    else:
        salary_min = ""
        salary_max = ""
        salary_currency = ""
        salary_interval = ""
        
    # Department
    department = cat
    
    # Raw Seniority in ATS (sometimes blank, sometimes messy)
    raw_seniority = seniority_expected if random.random() < 0.82 else ""
    
    # Generate realistic job description with requirements
    skills_joined = ", ".join(skills)
    desc = f"Role: {title} at {company_name}. We are looking for an experienced professional to join our {department} team. "
    desc += f"Key responsibilities include collaborating across teams, delivering high-impact initiatives, and driving excellence. "
    desc += f"Qualifications and technical competencies requested: Proficient with {skills_joined}. Strong analytical problem solving and communication skills required. "
    if workplace_choice == "remote":
        desc += "This is a 100% remote position open to candidates within eligible timezones."
    elif workplace_choice == "hybrid":
        desc += "This is a hybrid role requiring 2-3 days per week in our local hub."
    else:
        desc += "This is an on-site role based at our corporate headquarters."
        
    raw_records.append({
        "job_id": job_id,
        "job_title": title,
        "company_name": company_name,
        "location": loc,
        "country": country,
        "workplace_type": workplace_choice,
        "department": department,
        "seniority_raw": raw_seniority,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "salary_currency": salary_currency,
        "salary_interval": salary_interval,
        "date_posted": post_date_str,
        "employment_type": "Full-time" if random.random() < 0.94 else "Contract",
        "job_description": desc
    })

# Add a controlled set of duplicates and edge cases to test cleaning pipeline rigorously (Step 1 & Step 2)
# 1. Exact duplicates (24 records)
for i in range(24):
    dup = dict(raw_records[i])
    raw_records.append(dup)

# 2. Corrupted/empty title records (8 records)
for i in range(8):
    raw_records.append({
        "job_id": f"corrupted_{i}",
        "job_title": "",
        "company_name": "Unknown Corp",
        "location": "N/A",
        "country": "Unknown",
        "workplace_type": "unknown",
        "department": "None",
        "seniority_raw": "",
        "salary_min": "",
        "salary_max": "",
        "salary_currency": "",
        "salary_interval": "",
        "date_posted": "2026-00-00",
        "employment_type": "Unknown",
        "job_description": "Corrupted ATS dump"
    })

# Write raw CSV
fieldnames = list(raw_records[0].keys())
with open('data/raw/jobs_2026_raw.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(raw_records)

print(f"Generated data/raw/jobs_2026_raw.csv with {len(raw_records)} records.")
