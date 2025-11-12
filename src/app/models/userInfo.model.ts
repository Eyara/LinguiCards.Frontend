export interface UserInfo {
    level: number;
    xp: number;
    dailyXp: number;
    xpToNextLevel: number;
    languageStats: LanguageStat[];
}

export interface LanguageStat {
    languageName: string;
    totalWords: number;
    learnedWords: number;
    learnedPercent: number;
    totalTrainingDays: number;
}
