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
  WordConnect,
  Sentence
}

export interface WordTrainingModel extends WordModel {
  type: TrainingType;
  options: string[];
  trainingId: string;
  connectionTargets: string[];
  connectionMatches: WordConnection[];
}

export interface WordConnection {
  id: number;
  name: string;
  translatedName: string;
  type: TrainingType;
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
