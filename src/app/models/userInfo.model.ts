export interface UserInfo {
    level: number;
    xp: number;
    dailyXp: number;
    xpToNextLevel: number;
    languageStats: LanguageStats[];
}

export interface LanguageStats {
    languageName: string;
    totalWords: number;
    learnedWords: number;
    learnedPercent: number;
    totalTrainingDays: number;
}
