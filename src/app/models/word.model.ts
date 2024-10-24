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
  WritingFromLearnLanguage,
  WritingFromNativeLanguage,
  Sentence
}

export interface WordTrainingModel extends WordModel {
  type: TrainingType;
  options: string[];
  trainingId: string;
}

export interface WordModel extends WordCreateModel {
  id: number;
  activeLearnedPercent: number;
  passiveLearnedPercent: number;
  languageId: number;
}

export interface WordCreateModel {
  name: string;
  translatedName: string;
}
