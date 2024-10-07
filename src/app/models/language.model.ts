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
  activeLearnedPercent: number;
  passiveLearnedPercent: number;
  activeAverageAccuracy: number;
  passiveAverageAccuracy: number;
  totalTrainingDays: number;
  bestActiveWordsByAccuracy: string[];
  bestPassiveWordsByAccuracy: string[];
  worstActiveWordsByAccuracy: string[];
  worstPassiveWordsByAccuracy: string[];
}

