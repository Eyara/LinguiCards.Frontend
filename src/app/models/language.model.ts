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

