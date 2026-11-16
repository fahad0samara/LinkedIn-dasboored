import React, { useState, useRef } from 'react';
import { 
  Upload, Database, FileText, Plus, CheckCircle2, 
  AlertCircle, Download, Trash2, X
} from 'lucide-react';
import { JobRecord } from '../types';
import { parseCsvToJobRecords, setCustomDataset, isUsingCustomDataset, getActiveDatasetName, getDynamicDate } from '../data/jobDataEngine';
import { Language, useTranslation, translateCategory, translateSeniority, translateModality } from '../utils/i18n';

interface DatasetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetUpdated: () => void;
  language?: Language;
}

export const DatasetImportModal: React.FC<DatasetImportModalProps> = ({
  isOpen,
  onClose,
  onDatasetUpdated,
  language = 'ar'
}) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'presets' | 'add-single'>('upload');
  const [pastedCsv, setPastedCsv] = useState<string>('');
  const [previewRecords, setPreviewRecords] = useState<JobRecord[] | null>(null);
  const [datasetName, setDatasetName] = useState<string>(language === 'ar' ? 'مجموعة بيانات مخصصة' : 'Custom Upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single job form state
  const [singleJob, setSingleJob] = useState({
    title: '',
    company: '',
    category: 'Technology',
    seniority: 'Senior',
    modality: 'Remote' as 'Remote' | 'Hybrid' | 'On-site',
    country: 'United States',
    location: 'San Francisco, CA, United States',
    salary: 185000,
    skills: 'React, TypeScript, Node.js, AWS',
    isAi: false
  });

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setDatasetName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            // Transform JSON array
            const dynamicDate = getDynamicDate(1);
            const records: JobRecord[] = parsed.map((item, idx) => {
              const modality = item.Workplace_Modality || item.modality || 'Remote';
              return {
                Job_ID: item.Job_ID || item.id || `REQ-${10000 + idx}`,
                Job_Title: item.Job_Title || item.title || 'Specialist',
                Company: item.Company || item.company || 'Enterprise Corp',
                Job_Category: item.Job_Category || item.category || 'Technology',
                Seniority: item.Seniority || item.seniority || 'Senior',
                Workplace_Modality: modality,
                Is_Remote: item.Is_Remote || (modality === 'Remote' ? 'Yes' : 'No'),
                Is_AI_Job: item.Is_AI_Job || 'No',
                Country: item.Country || item.country || 'United States',
                Location: item.Location || item.location || 'United States',
                Date_Posted: item.Date_Posted || item.date || dynamicDate.dateStr,
                Year: item.Year || dynamicDate.year,
                Month: item.Month || dynamicDate.month,
                Month_Name: item.Month_Name || dynamicDate.monthName,
                Year_Month: item.Year_Month || dynamicDate.yearMonth,
                Quarter: item.Quarter || dynamicDate.quarter,
                Employment_Type: item.Employment_Type || 'Full-Time',
                Has_Salary: 'Yes',
                Salary_Min_USD: item.Salary_Min_USD || 150000,
                Salary_Max_USD: item.Salary_Max_USD || 200000,
                Salary_Avg_USD: item.Salary_Avg_USD || item.salary || 175000,
                Skills_List: item.Skills_List || item.skills || 'Communication, Problem Solving',
                Skill_Count: (item.Skills_List || item.skills || '').split(',').length
              };
            });
            setPreviewRecords(records);
          } else {
            setErrorMessage(language === 'ar' ? 'يجب أن يكون ملف JSON مصفوفة من السجلات.' : 'JSON file must be an array of job records.');
          }
        } else {
          // Parse CSV
          const records = parseCsvToJobRecords(text);
          if (records.length === 0) {
            setErrorMessage(language === 'ar' ? 'تعذر قراءة صفوف صالحة من ملف CSV. يرجى التحقق من التنسيق.' : 'Could not parse any valid job rows from CSV. Please check formatting.');
          } else {
            setPreviewRecords(records);
          }
        }
      } catch (err: any) {
        setErrorMessage(language === 'ar' ? `خطأ أثناء قراءة الملف: ${err.message}` : `Error parsing file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleParsePastedCsv = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!pastedCsv.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى لصق محتوى CSV صالح يحتوي على صف الرؤوس.' : 'Please paste valid CSV content with a header row.');
      return;
    }
    const records = parseCsvToJobRecords(pastedCsv);
    if (records.length === 0) {
      setErrorMessage(language === 'ar' ? 'تعذر استخراج سجلات وظائف صالحة من النص الملصق.' : 'Could not parse valid job records from pasted text.');
    } else {
      setPreviewRecords(records);
    }
  };

  const handleApplyDataset = () => {
    if (!previewRecords || previewRecords.length === 0) return;
    setCustomDataset(previewRecords, datasetName);
    setSuccessMessage(language === 'ar' ? `تم تحميل ${previewRecords.length.toLocaleString('ar-EG')} وظيفة مخصصة بنجاح!` : `Successfully loaded ${previewRecords.length.toLocaleString()} custom job postings!`);
    setTimeout(() => {
      onDatasetUpdated();
      onClose();
    }, 400);
  };

  const handleResetToDefault = () => {
    setCustomDataset(null, language === 'ar' ? 'مجموعة البيانات العالمية الافتراضية' : 'Default Global Dataset');
    setPreviewRecords(null);
    setSuccessMessage(language === 'ar' ? 'تمت استعادة مجموعة البيانات العالمية القياسية.' : 'Reset to master default global dataset.');
    setTimeout(() => {
      onDatasetUpdated();
      onClose();
    }, 300);
  };

  const handleAddSingleJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleJob.title || !singleJob.company) {
      setErrorMessage(language === 'ar' ? 'يرجى ملء المسمى الوظيفي واسم الشركة.' : 'Please provide at least a Job Title and Company.');
      return;
    }

    const dynamicDate = getDynamicDate(0);
    const newRecord: JobRecord = {
      Job_ID: `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
      Job_Title: singleJob.title,
      Company: singleJob.company,
      Job_Category: singleJob.category,
      Seniority: singleJob.seniority,
      Workplace_Modality: singleJob.modality,
      Is_Remote: singleJob.modality === 'Remote' ? 'Yes' : 'No',
      Is_AI_Job: singleJob.isAi ? 'Yes' : 'No',
      Country: singleJob.country,
      Location: singleJob.location,
      Date_Posted: dynamicDate.dateStr,
      Year: dynamicDate.year,
      Month: dynamicDate.month,
      Month_Name: dynamicDate.monthName,
      Year_Month: dynamicDate.yearMonth,
      Quarter: dynamicDate.quarter,
      Employment_Type: 'Full-Time',
      Has_Salary: 'Yes',
      Salary_Min_USD: Math.round(singleJob.salary * 0.9),
      Salary_Max_USD: Math.round(singleJob.salary * 1.15),
      Salary_Avg_USD: singleJob.salary,
      Skills_List: singleJob.skills,
      Skill_Count: singleJob.skills.split(',').length
    };

    setPreviewRecords([newRecord, ...(previewRecords || [])]);
    setSuccessMessage(language === 'ar' ? `تمت إضافة "${singleJob.title}" إلى قائمة المعاينة!` : `Added "${singleJob.title}" to preview queue!`);
    setSingleJob({
      ...singleJob,
      title: '',
      company: ''
    });
  };

  const handleDownloadSampleCsv = () => {
    const sample = `Job_ID,Job_Title,Company,Job_Category,Seniority,Workplace_Modality,Is_Remote,Is_AI_Job,Country,Location,Salary_Min_USD,Salary_Max_USD,Salary_Avg_USD,Skills_List
REQ-90001,Principal AI Architect,Microsoft,Data & AI,Executive,Remote,Yes,Yes,United States,"Redmond, WA, United States",240000,320000,280000,"PyTorch, Transformers, Azure, System Architecture"
REQ-90002,Senior React Engineer,Stripe,Technology,Senior,Remote,Yes,No,United States,"San Francisco, CA, United States",170000,210000,190000,"React, TypeScript, GraphQL, Next.js"
REQ-90003,Quantitative Risk Lead,Goldman Sachs,Finance,Lead,Hybrid,No,Yes,United States,"New York, NY, United States",180000,240000,210000,"Python, C++, Risk Modeling, Financial Analytics"
REQ-90004,Lead Bioinformatics Scientist,Pfizer,Healthcare,Lead,On-site,No,Yes,United States,"Boston, MA, United States",160000,200000,180000,"Genomics, Python, R, Clinical Data"`;

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sample_PowerBI_Job_Data_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded bg-[#118dff] flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">{language === 'ar' ? 'إدارة واستيراد مصادر البيانات' : 'Data Source & Dataset Manager'}</h2>
              <p className="text-xs text-slate-300">
                {language === 'ar' ? 'المصدر النشط الحالي:' : 'Current active feed:'} <span className="text-sky-300 font-semibold">{getActiveDatasetName()}</span>
                {isUsingCustomDataset() && <span className="ml-1.5 rtl:ml-0 rtl:mr-1.5 px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] uppercase font-bold tracking-wider">{language === 'ar' ? 'مخصص' : 'Custom'}</span>}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#118dff] text-[#118dff] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'رفع ملف CSV / JSON' : 'Upload CSV / JSON'}</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
              activeTab === 'paste'
                ? 'border-[#118dff] text-[#118dff] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'لصق نص CSV' : 'Paste CSV Text'}</span>
          </button>

          <button
            onClick={() => setActiveTab('add-single')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors cursor-pointer ${
              activeTab === 'add-single'
                ? 'border-[#118dff] text-[#118dff] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إضافة وظيفة مفردة' : 'Add Single Posting'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {/* TAB 1: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#118dff] bg-slate-50 hover:bg-sky-50/50 rounded-lg p-6 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-[#118dff] mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-800">
                  {language === 'ar' ? 'انقر لاختيار ملف CSV أو JSON' : 'Click to choose a CSV or JSON file'}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'ar' ? 'يدعم جداول التصدير القياسية من ATS وLinkedIn وWorkday وGreenhouse' : 'Supports standard ATS, LinkedIn, Workday, or Greenhouse job export spreadsheets'}
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.json"
                  className="hidden" 
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>{language === 'ar' ? 'هل تحتاج نموذجاً تجريبياً؟' : 'Need an example file format?'}</span>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="text-[#118dff] hover:underline font-semibold flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تحميل نموذج CSV تجريبي' : 'Download Sample CSV Template'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE CSV */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'الصق قيم CSV المفصولة بفواصل (مع صف العناوين)' : 'Paste Comma-Separated Values (with Header)'}
                </label>
                <textarea
                  rows={6}
                  value={pastedCsv}
                  onChange={(e) => setPastedCsv(e.target.value)}
                  placeholder={`Job_Title,Company,Job_Category,Seniority,Workplace_Modality,Country,Salary_Avg_USD,Skills_List\n"Senior Backend Developer","Stripe","Technology","Senior","Remote","United States",180000,"Go, SQL, AWS"\n"Data Scientist","Pfizer","Data & AI","Mid Level","Hybrid","United States",165000,"Python, Machine Learning"`}
                  className="w-full text-xs font-mono p-3 border border-slate-300 rounded focus:ring-1 focus:ring-[#118dff] focus:border-[#118dff] outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleParsePastedCsv}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'تحليل ومعاينة النص' : 'Parse & Preview Text'}
              </button>
            </div>
          )}

          {/* TAB 3: ADD SINGLE RECORD */}
          {activeTab === 'add-single' && (
            <form onSubmit={handleAddSingleJob} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('col_jobTitle')} *</label>
                  <input
                    type="text"
                    required
                    value={singleJob.title}
                    onChange={(e) => setSingleJob({ ...singleJob, title: e.target.value })}
                    placeholder="e.g. Senior Cloud Architect"
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('col_company')} *</label>
                  <input
                    type="text"
                    required
                    value={singleJob.company}
                    onChange={(e) => setSingleJob({ ...singleJob, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('slicerCategory')}</label>
                  <select
                    value={singleJob.category}
                    onChange={(e) => setSingleJob({ ...singleJob, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="Technology">{translateCategory('Technology', language)}</option>
                    <option value="Data & AI">{translateCategory('Data & AI', language)}</option>
                    <option value="Finance">{translateCategory('Finance', language)}</option>
                    <option value="Healthcare">{translateCategory('Healthcare', language)}</option>
                    <option value="Marketing">{translateCategory('Marketing', language)}</option>
                    <option value="Sales">{translateCategory('Sales', language)}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('slicerSeniority')}</label>
                  <select
                    value={singleJob.seniority}
                    onChange={(e) => setSingleJob({ ...singleJob, seniority: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="Entry Level">{translateSeniority('Entry Level', language)}</option>
                    <option value="Mid Level">{translateSeniority('Mid Level', language)}</option>
                    <option value="Senior">{translateSeniority('Senior', language)}</option>
                    <option value="Lead">{translateSeniority('Lead', language)}</option>
                    <option value="Manager">{translateSeniority('Manager', language)}</option>
                    <option value="Director">{translateSeniority('Director', language)}</option>
                    <option value="Executive">{translateSeniority('Executive', language)}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('slicerModality')}</label>
                  <select
                    value={singleJob.modality}
                    onChange={(e: any) => setSingleJob({ ...singleJob, modality: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="Remote">{t('mod_remote')}</option>
                    <option value="Hybrid">{t('mod_hybrid')}</option>
                    <option value="On-site">{t('mod_onsite')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{language === 'ar' ? 'الراتب السنوي (USD)' : 'Salary Avg (USD)'}</label>
                  <input
                    type="number"
                    value={singleJob.salary}
                    onChange={(e) => setSingleJob({ ...singleJob, salary: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{language === 'ar' ? 'المهارات المطلوبة (مفصولة بفواصل)' : 'Skills (Comma separated)'}</label>
                  <input
                    type="text"
                    value={singleJob.skills}
                    onChange={(e) => setSingleJob({ ...singleJob, skills: e.target.value })}
                    placeholder="e.g. React, TypeScript, Python"
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-1">
                <input
                  type="checkbox"
                  id="isAiCheckbox"
                  checked={singleJob.isAi}
                  onChange={(e) => setSingleJob({ ...singleJob, isAi: e.target.checked })}
                  className="rounded text-[#118dff] cursor-pointer"
                />
                <label htmlFor="isAiCheckbox" className="text-slate-700 font-medium cursor-pointer">
                  {language === 'ar' ? 'تصنيف كوظيفة متخصصة في الذكاء الاصطناعي (AI Role)' : 'Classify as specialized AI/ML job'}
                </label>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إضافة إلى قائمة المعاينة' : 'Add to Preview List'}
              </button>
            </form>
          )}

          {/* Preview Table */}
          {previewRecords && previewRecords.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
              <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>
                  {language === 'ar'
                    ? `معاينة السجلات الجاهزة للإدراج (${previewRecords.length.toLocaleString('ar-EG')} سجل)`
                    : `Ingestion Preview (${previewRecords.length.toLocaleString()} records loaded)`}
                </span>
                <span className="text-[10px] text-slate-500">{language === 'ar' ? 'أول 5 سجلات معروضة' : 'Showing first 5 rows'}</span>
              </div>
              <div className="overflow-x-auto max-h-48 text-xs">
                <table className="w-full text-left rtl:text-right border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b text-[11px]">
                    <tr>
                      <th className="p-2">{t('col_jobTitle')}</th>
                      <th className="p-2">{t('col_company')}</th>
                      <th className="p-2">{t('col_category')}</th>
                      <th className="p-2">{t('col_modality')}</th>
                      <th className="p-2 text-right rtl:text-left">{t('col_salary')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {previewRecords.slice(0, 5).map((r) => (
                      <tr key={r.Job_ID} className="hover:bg-slate-50">
                        <td className="p-2 font-medium text-slate-800">{r.Job_Title}</td>
                        <td className="p-2 text-slate-600">{r.Company}</td>
                        <td className="p-2 text-slate-600">{translateCategory(r.Job_Category, language)}</td>
                        <td className="p-2 text-slate-600">{translateModality(r.Workplace_Modality, language)}</td>
                        <td className="p-2 text-right rtl:text-left font-mono font-bold text-emerald-700">
                          ${(r.Salary_Avg_USD || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {isUsingCustomDataset() && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استعادة قاعدة البيانات الافتراضية' : 'Restore Default Dataset'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleApplyDataset}
              disabled={!previewRecords || previewRecords.length === 0}
              className="px-4 py-1.5 rounded bg-[#118dff] hover:bg-[#0078d4] text-white text-xs font-bold transition-colors disabled:opacity-40 flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تطبيق البيانات على اللوحة' : 'Apply Dataset to Dashboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
