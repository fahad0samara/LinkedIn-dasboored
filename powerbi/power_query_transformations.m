// ==============================================================================
// 2026 GLOBAL JOB MARKET ANALYSIS - POWER QUERY (M) IMPORT & TRANSFORMATIONS
// Paste into Power Query Advanced Editor for instant automated ingestion
// ==============================================================================

// ------------------------------------------------------------------------------
// QUERY 1: FactJobs (Primary Fact Table)
// ------------------------------------------------------------------------------
let
    // 1. Source CSV file path (Update path or use Web.Contents / local directory)
    Source = Csv.Document(File.Contents("C:\2026-job-market-analysis\data\processed\jobs_2026_clean.csv"), [Delimiter=",", Columns=23, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    
    // 2. Set strict data types
    #"Changed Types" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"Job_ID", type text},
        {"Job_Title", type text},
        {"Company", type text},
        {"Job_Category", type text},
        {"Seniority", type text},
        {"Workplace_Modality", type text},
        {"Is_Remote", type text},
        {"Is_AI_Job", type text},
        {"Country", type text},
        {"Location", type text},
        {"Date_Posted", type date},
        {"Year", Int64.Type},
        {"Month", Int64.Type},
        {"Month_Name", type text},
        {"Year_Month", type text},
        {"Quarter", type text},
        {"Employment_Type", type text},
        {"Has_Salary", type text},
        {"Salary_Min_USD", type number},
        {"Salary_Max_USD", type number},
        {"Salary_Avg_USD", type number},
        {"Skills_List", type text},
        {"Skill_Count", Int64.Type}
    }),
    
    // 3. Clean nulls & filter blank IDs
    #"Filtered Valid Records" = Table.SelectRows(#"Changed Types", each ([Job_ID] <> null and [Job_ID] <> ""))
in
    #"Filtered Valid Records"


// ------------------------------------------------------------------------------
// QUERY 2: DimSkills (Normalized Bridge / Dimension Table)
// ------------------------------------------------------------------------------
let
    Source = Csv.Document(File.Contents("C:\2026-job-market-analysis\data\processed\dim_skills_2026.csv"), [Delimiter=",", Columns=4, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Types" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"job_id", type text},
        {"skill_name", type text},
        {"skill_category", type text},
        {"skill_type", type text}
    })
in
    #"Changed Types"


// ------------------------------------------------------------------------------
// QUERY 3: DimDate (Calendar Table for Time Intelligence)
// ------------------------------------------------------------------------------
let
    StartDate = #date(2026, 1, 1),
    EndDate = #date(2026, 12, 31),
    DayCount = Duration.Days(Duration.From(EndDate - StartDate)) + 1,
    DateList = List.Dates(StartDate, DayCount, #duration(1, 0, 0, 0)),
    #"Table From List" = Table.FromList(DateList, Splitter.SplitByNothing(), {"Date"}, null, ExtraValues.Error),
    #"Changed Type" = Table.TransformColumnTypes(#"Table From List",{{"Date", type date}}),
    #"Added Year" = Table.AddColumn(#"Changed Type", "Year", each Date.Year([Date]), Int64.Type),
    #"Added Month" = Table.AddColumn(#"Added Year", "Month", each Date.Month([Date]), Int64.Type),
    #"Added Month Name" = Table.AddColumn(#"Added Month", "Month Name", each Date.MonthName([Date]), type text),
    #"Added Year-Month" = Table.AddColumn(#"Added Month Name", "Year-Month", each Date.ToText([Date], "yyyy-MM"), type text),
    #"Added Quarter" = Table.AddColumn(#"Added Year-Month", "Quarter", each "Q" & Text.From(Date.QuarterOfYear([Date])) & " " & Text.From(Date.Year([Date])), type text),
    #"Added Day of Week" = Table.AddColumn(#"Added Quarter", "Day of Week", each Date.DayOfWeekName([Date]), type text)
in
    #"Added Day of Week"
