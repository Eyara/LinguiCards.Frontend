export interface WordViewModel extends WordModel {
  isEditMode: boolean;
}

export interface WordModel extends WordCreateModel {
  id: number;
  learnedPercent: number;
  languageId: number;
}

export interface WordCreateModel {
  name: string;
  translatedName: string;
}
