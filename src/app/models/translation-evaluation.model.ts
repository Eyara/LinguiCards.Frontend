export interface TranslationEvaluationResponse {
  accuracy: number;
  correctTranslation: string;
  minorIssues: string[];
  errors: string[];
  criticalErrors: string[];
} 