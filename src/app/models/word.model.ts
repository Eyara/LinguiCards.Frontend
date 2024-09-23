export interface WordViewModel extends WordModel {
  editMode: EditMode;
}

export enum EditMode {
  None,
  Update,
  Create
}

export enum TrainingType {
  FromLearnLanguage,
  FromNativeLanguage,
  Writing,
  Sentence
}

export interface WordTrainingModel extends WordModel {
  type: TrainingType;
  options: string[];
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
