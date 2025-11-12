export interface LanguageCreateModel {
  name: string;
  languageDictionaryId: number;
}

export interface LanguageResponseModel {
  id: number;
  name: string;
  url: string;
  userId: number;
  languageDictionaryId: number;
}

export interface LanguageModel extends LanguageResponseModel {
  editMode: boolean;
}

export interface DictionarExtendedyModel {
  id: number;
  name: string;
  url: string;
}

export interface WordOfTheDay {
  name: string;
  translatedName: string;
}

export interface LanguageStatisticsModel {
  activeLearnedPercent: number;
  passiveLearnedPercent: number;
  activeAverageAccuracy: number;
  passiveAverageAccuracy: number;
  activeAverageLearnedPercent: number;
  passiveAverageLearnedPercent: number;
  learnedWords: number;
  totalWords: number;
  totalTrainingDays: number;
  wordOfTheDay: WordOfTheDay;
  bestActiveWordsByAccuracy: string[];
  bestPassiveWordsByAccuracy: string[];
  worstActiveWordsByAccuracy: string[];
  worstPassiveWordsByAccuracy: string[];
}

