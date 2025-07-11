
export enum ViewMode {
  Welcome,
  Camera,
  Loading,
  Results,
  Error,
}

export type Category = 'top' | 'recommended' | 'interesting' | 'caution' | 'avoid';

export interface AnalysisItem {
  category: Category;
  dishName: string;
  reasoning: string;
  suggestion?: string;
}

export interface AnalysisResult {
  analysis: AnalysisItem[];
}
