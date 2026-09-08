export type DomainId = 'statistical' | 'technical' | 'governance' | 'managerial';
export type Competency = { id: string; name: string; domain: DomainId; description: string; };
export type RoleDefinition = { id: string; title: string; description: string; requiredCompetencies: Record<string, number>; };

export const DOMAINS: Record<DomainId, { name: string; description: string; color: string }> = {
  statistical: { name: 'Statistical System', description: 'Core statistical methodologies, survey designs, and national standards for official statistics.', color: 'hsl(172 47% 22%)' },
  technical: { name: 'Technical & Data Science', description: 'Programming, data analytics, database querying, data visualization, and AI/ML tools.', color: 'hsl(197 45% 35%)' },
  governance: { name: 'Digital Governance', description: 'Government cloud standards, data privacy, cybersecurity, and digital public infrastructure.', color: 'hsl(215 50% 40%)' },
  managerial: { name: 'Behavioural & Managerial', description: 'Public leadership, project management, communications, and decision ethics.', color: 'hsl(30 48% 38%)' },
};

export const COMPETENCIES: Competency[] = [
  { id: 'stat_survey_design', name: 'Survey Design', domain: 'statistical', description: 'Designing national census and sample survey questionnaires, sampling frames, and schedules.' },
  { id: 'stat_sampling', name: 'Sampling Techniques', domain: 'statistical', description: 'Stratified sampling, cluster sampling, probability proportional to size (PPS), and estimation methods.' },
  { id: 'stat_national_accounts', name: 'National Accounts', domain: 'statistical', description: 'Compilation of GDP, GVA, input-output tables, and System of National Accounts (SNA 2008) standards.' },
  { id: 'stat_price_stats', name: 'Price Statistics', domain: 'statistical', description: 'Consumer Price Index (CPI), Wholesale Price Index (WPI), inflation metrics, and price index weighting.' },
  { id: 'stat_labour_stats', name: 'Labour Statistics', domain: 'statistical', description: 'Periodic Labour Force Survey (PLFS) methodologies, worker population ratios, and unemployment metrics.' },
  { id: 'stat_agri_stats', name: 'Agricultural Statistics', domain: 'statistical', description: 'Crop area estimation, yield estimation, land use statistics, and agricultural census frameworks.' },
  { id: 'stat_ind_stats', name: 'Industrial Statistics', domain: 'statistical', description: 'Annual Survey of Industries (ASI), Index of Industrial Production (IIP), and economic census.' },
  { id: 'stat_sdg', name: 'SDG Indicators', domain: 'statistical', description: 'National Indicator Framework (NIF) for Sustainable Development Goals monitoring and reporting.' },
  { id: 'stat_metadata', name: 'Metadata Standards', domain: 'statistical', description: 'SDMX (Statistical Data and Metadata eXchange) and DDI standards for statistical data documentation.' },
  { id: 'stat_data_quality', name: 'Data Quality Assurance', domain: 'statistical', description: 'Data validation rules, error detection, imputation methods, and official data audit procedures.' },
  { id: 'tech_python', name: 'Python Programming', domain: 'technical', description: 'Data wrangling, automated processing, Pandas, NumPy, and scripting for statistical analysis.' },
  { id: 'tech_sql', name: 'SQL & Database Querying', domain: 'technical', description: 'Relational databases, complex SQL joins, analytical queries, aggregation, and data warehousing.' },
  { id: 'tech_r', name: 'R Statistical Software', domain: 'technical', description: 'Statistical modeling, econometrics, ggplot2 visualization, and survey package estimation in R.' },
  { id: 'tech_stata', name: 'Stata', domain: 'technical', description: 'Econometric analysis, regression diagnostics, panel data analysis, and micro-data manipulation.' },
  { id: 'tech_spss', name: 'SPSS', domain: 'technical', description: 'Cross-tabulation, parametric & non-parametric statistical tests, and survey data management.' },
  { id: 'tech_sas', name: 'SAS', domain: 'technical', description: 'Enterprise statistical reporting, macro programming, and large dataset handling.' },
  { id: 'tech_gis', name: 'GIS & Spatial Analytics', domain: 'technical', description: 'Geographic Information Systems, spatial data mapping, QGIS, and geo-referenced survey mapping.' },
  { id: 'tech_datavis', name: 'Data Visualization', domain: 'technical', description: 'Dashboard design, PowerBI/Tableau/Matplotlib charts, story-telling with statistical data.' },
  { id: 'tech_aiml', name: 'AI & Machine Learning', domain: 'technical', description: 'Predictive modeling, automated data cleaning, NLP for survey responses, and machine learning.' },
  { id: 'tech_cloud', name: 'Cloud Computing', domain: 'technical', description: 'Managing statistical pipelines on MeghRaj government cloud, serverless batch computing.' },
  { id: 'tech_api', name: 'APIs & Data Pipelines', domain: 'technical', description: 'RESTful API integration, automated data ingest pipelines, and JSON/XML data parsing.' },
  { id: 'tech_opendata', name: 'Open Data & Metadata', domain: 'technical', description: 'Publishing machine-readable datasets on data.gov.in, open license frameworks, and anonymization.' },
  { id: 'gov_cybersec', name: 'Cybersecurity', domain: 'governance', description: 'Government IT security guidelines, data encryption, CERT-In compliance, and secure data storage.' },
  { id: 'gov_privacy', name: 'Data Privacy & Protection', domain: 'governance', description: 'Digital Personal Data Protection (DPDP) Act compliance, anonymization, and confidentiality rules.' },
  { id: 'gov_digisig', name: 'Digital Signatures & Auth', domain: 'governance', description: 'eSign, Aadhaar-based auth, and PKI infrastructure for official statistical release verification.' },
  { id: 'gov_govcloud', name: 'Government Cloud (MeghRaj)', domain: 'governance', description: 'Deployment standards and compliance for NIC/MeghRaj infrastructure.' },
  { id: 'gov_dpi', name: 'Digital Public Infrastructure', domain: 'governance', description: 'Integrating India Stack, DigiLocker, and open government data architecture.' },
  { id: 'mgt_leadership', name: 'Public Leadership', domain: 'managerial', description: 'Leading statistical teams, inter-departmental coordination, and organizational direction.' },
  { id: 'mgt_comm', name: 'Statistical Communication', domain: 'managerial', description: 'Communicating complex statistical findings to policymakers, media, and the public.' },
  { id: 'mgt_proj_mgt', name: 'Project Management', domain: 'managerial', description: 'Managing census/survey projects, field operations, timelines, budgets, and deliverable tracking.' },
  { id: 'mgt_ethics', name: 'Public Ethics & Integrity', domain: 'managerial', description: 'Adhering to UN Fundamental Principles of Official Statistics and national professional ethics.' },
  { id: 'mgt_decision', name: 'Evidence-Based Decision Making', domain: 'managerial', description: 'Translating statistical insights into policy recommendations and scheme evaluations.' },
  { id: 'mgt_change', name: 'Change Management', domain: 'managerial', description: 'Guiding digital transformation in statistical offices and adopting modern IT workflows.' },
];

export const DEMO_ROLES: RoleDefinition[] = [
  { id: 'stat_analyst', title: 'Statistical Analyst', description: 'Responsible for compiling statistical reports, survey data validation, and basic Python & SQL analytics.', requiredCompetencies: { tech_python: 70, tech_sql: 70, stat_survey_design: 65, stat_national_accounts: 60, stat_data_quality: 75, tech_datavis: 65, gov_privacy: 60, mgt_ethics: 70 } },
  { id: 'stat_officer', title: 'Statistical Officer (SSO / JSO)', description: 'Oversees field survey execution, sampling validation, National Accounts processing, and team reporting.', requiredCompetencies: { stat_survey_design: 85, stat_sampling: 80, stat_national_accounts: 75, stat_data_quality: 85, tech_python: 60, tech_sql: 65, tech_r: 55, mgt_proj_mgt: 75, mgt_comm: 70, gov_privacy: 70 } },
  { id: 'data_analyst', title: 'Data Analyst (Official Statistics)', description: 'Focuses on deep data processing, database querying, automated ETL pipelines, and interactive visualization dashboards.', requiredCompetencies: { tech_python: 85, tech_sql: 85, tech_datavis: 80, tech_api: 75, tech_aiml: 60, stat_data_quality: 70, gov_privacy: 65, mgt_proj_mgt: 60 } },
  { id: 'research_officer', title: 'Research Officer (Econometrics & Policy)', description: 'Conducts macro-economic modeling, price statistics analysis, SDG indicator tracking, and policy impact assessments.', requiredCompetencies: { stat_national_accounts: 85, stat_price_stats: 80, stat_sdg: 80, tech_r: 75, tech_stata: 70, tech_python: 65, mgt_decision: 85, mgt_comm: 80 } },
  { id: 'dir_datascience', title: 'Director (Data Science & AI)', description: 'Strategic leadership for modernizing statistical systems, cloud architecture, AI/ML adoption, and digital governance.', requiredCompetencies: { tech_aiml: 85, tech_cloud: 80, tech_python: 80, gov_dpi: 85, gov_cybersec: 80, gov_privacy: 85, mgt_leadership: 90, mgt_proj_mgt: 85, mgt_change: 85 } },
];

export function getCompetencyById(id: string): Competency | undefined { return COMPETENCIES.find(c => c.id === id); }
export function getRoleById(id: string): RoleDefinition { return DEMO_ROLES.find(r => r.id === id) ?? DEMO_ROLES[0]; }
