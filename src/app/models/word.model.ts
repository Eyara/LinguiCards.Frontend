export interface WordViewModel extends WordModel {
  editMode: EditMode;
}

export enum EditMode {
  None,
  Update,
  Create
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
