export interface UserInfo {
    languageStats: LanguageStats[];
}

export interface LanguageStats {
    languageName: string;
    totalWords: number;
    learnedWords: number;
    learnedPercent: number;
    totalTrainingDays: number;
}
