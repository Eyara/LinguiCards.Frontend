export interface LanguageCreateModel {
  name: string;
  languageDictionaryId: number;
}

export interface LanguageResponseModel extends LanguageCreateModel {
  id: number;
  name: string;
  url: string;
  languageDictionaryId: number;
}

export interface LanguageModel extends LanguageResponseModel {
  editMode: boolean;
}

export interface DictionarExtendedyModel {
  id: number;
  name: string;
  src: string;
}

export interface LanguageStatisticsModel {
  totalWords: number;
  learnedWords: number;
  activeLearnedPercent: number;
  passiveLearnedPercent: number;
  activeAverageLearnedPercent: number;
  passiveAverageLearnedPercent: number;
  activeAverageAccuracy: number;
  passiveAverageAccuracy: number;
  totalTrainingDays: number;
  wordOfTheDay: string;
  bestActiveWordsByAccuracy: string[];
  bestPassiveWordsByAccuracy: string[];
  worstActiveWordsByAccuracy: string[];
  worstPassiveWordsByAccuracy: string[];
}

