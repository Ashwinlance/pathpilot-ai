export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type GeneratedMCQ = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: DifficultyLevel;
  concept: string;
  competencyId: string;
  competencyName: string;
  sourceMaterial: string;
  status?: 'accepted' | 'edited' | 'pending';
};

export type ExtractedMaterial = {
  title: string;
  fileName: string;
  fileType: 'PDF' | 'PPT' | 'DOC' | 'TXT';
  fileSize: string;
  rawText: string;
  concepts: string[];
  detectedCompetencies: { id: string; name: string }[];
  isDemo: boolean;
};

export interface IMCQGenerator {
  generateQuestions(material: ExtractedMaterial): Promise<GeneratedMCQ[]>;
}

export const SAMPLE_MATERIALS: ExtractedMaterial[] = [
  {
    title: 'SQL Fundamentals for Official Data Analysis',
    fileName: 'MoSPI_SQL_Guide_2024.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    rawText: 'Relational databases store official statistical tables. The SELECT clause queries columns. The WHERE clause filters survey records. JOIN combines tables using primary keys. GROUP BY aggregates national data.',
    concepts: ['SELECT & WHERE Filtering', 'SQL JOIN Operations', 'GROUP BY & Aggregations', 'Primary Keys & Indexing'],
    detectedCompetencies: [
      { id: 'tech_sql', name: 'SQL & Database Querying' },
      { id: 'stat_data_quality', name: 'Data Quality Assurance' },
    ],
    isDemo: true,
  },
  {
    title: 'Python for Survey Automation & Data Science',
    fileName: 'Python_MoSPI_Automation.pptx',
    fileType: 'PPT',
    fileSize: '4.1 MB',
    rawText: 'Python script automation for sample survey schedules. Pandas DataFrames read micro-data CSVs. Functions package analysis logic. Lambda functions and dictionary maps transform survey data fields.',
    concepts: ['Pandas DataFrames', 'Python Functions', 'Dictionary Data Structures', 'File I/O & Automation'],
    detectedCompetencies: [
      { id: 'tech_python', name: 'Python Programming' },
      { id: 'tech_api', name: 'APIs & Data Pipelines' },
    ],
    isDemo: true,
  },
];

export class DemoMCQGenerator implements IMCQGenerator {
  async generateQuestions(material: ExtractedMaterial): Promise<GeneratedMCQ[]> {
    if (material.title.includes('SQL')) {
      return [
        { id: 'q_sql_1', question: 'Which SQL clause is used to filter individual survey records before aggregation?', options: ['HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'], correctAnswer: 1, explanation: 'The WHERE clause filters rows prior to grouping, whereas HAVING filters aggregated groups.', difficulty: 'Beginner', concept: 'SELECT & WHERE Filtering', competencyId: 'tech_sql', competencyName: 'SQL & Database Querying', sourceMaterial: material.title, status: 'accepted' },
        { id: 'q_sql_2', question: 'When combining state-level census tables with district lookup codes, which JOIN type retains all state records even if district codes are missing?', options: ['INNER JOIN', 'LEFT OUTER JOIN', 'CROSS JOIN', 'FULL OUTER JOIN'], correctAnswer: 1, explanation: 'LEFT OUTER JOIN preserves all rows from the left (state) table regardless of matches in the right table.', difficulty: 'Intermediate', concept: 'SQL JOIN Operations', competencyId: 'tech_sql', competencyName: 'SQL & Database Querying', sourceMaterial: material.title, status: 'accepted' },
        { id: 'q_sql_3', question: 'Which SQL aggregate function combined with GROUP BY calculates the total GDP contribution per sector?', options: ['COUNT()', 'SUM()', 'AVG()', 'MAX()'], correctAnswer: 1, explanation: 'SUM() computes the mathematical total of numeric values within each GROUP BY sector category.', difficulty: 'Beginner', concept: 'GROUP BY & Aggregations', competencyId: 'tech_sql', competencyName: 'SQL & Database Querying', sourceMaterial: material.title, status: 'accepted' },
        { id: 'q_sql_4', question: 'How do index structures optimize statistical database performance on large survey tables?', options: ['By compressing stored data on disk', 'By providing B-tree lookup paths to minimize disk I/O scanning', 'By automatically encrypting user records', 'By removing duplicate rows during queries'], correctAnswer: 1, explanation: 'Database indexes create efficient lookup structures (like B-trees) that reduce the rows scanned during query execution.', difficulty: 'Advanced', concept: 'Primary Keys & Indexing', competencyId: 'tech_sql', competencyName: 'SQL & Database Querying', sourceMaterial: material.title, status: 'accepted' },
      ];
    }

    return [
      { id: 'q_py_1', question: 'Which Pandas method reads an official survey CSV dataset into a DataFrame?', options: ['pd.open_csv()', 'pd.read_csv()', 'pd.parse_csv()', 'pd.load_csv()'], correctAnswer: 1, explanation: 'pd.read_csv() is the standard Pandas function for importing CSV data into a DataFrame.', difficulty: 'Beginner', concept: 'Pandas DataFrames', competencyId: 'tech_python', competencyName: 'Python Programming', sourceMaterial: material.title, status: 'accepted' },
      { id: 'q_py_2', question: 'What is the primary benefit of packaging survey cleaning logic into reusable Python functions?', options: ['It decreases code execution memory to zero', 'It allows modular re-use, consistent error handling, and cleaner pipeline code', 'It forces Python to compile into binary C code', 'It prevents variables from changing types'], correctAnswer: 1, explanation: 'Functions modularize code, preventing repetition and making survey pipelines reliable and readable.', difficulty: 'Intermediate', concept: 'Python Functions', competencyId: 'tech_python', competencyName: 'Python Programming', sourceMaterial: material.title, status: 'accepted' },
      { id: 'q_py_3', question: 'Which key-value data structure in Python is best suited for storing district code mapping dictionaries?', options: ['List', 'Tuple', 'Dictionary ({})', 'Set'], correctAnswer: 2, explanation: 'Python dictionaries ({}) map unique key identifiers to corresponding values with O(1) average lookup time.', difficulty: 'Beginner', concept: 'Dictionary Data Structures', competencyId: 'tech_python', competencyName: 'Python Programming', sourceMaterial: material.title, status: 'accepted' },
    ];
  }
}

export const mcqGenerator = new DemoMCQGenerator();
