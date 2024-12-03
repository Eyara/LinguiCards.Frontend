export interface TrainingModel {
  id: number;
  isCorrectAnswer: boolean;
  passiveLearned: number;
  activeLearned: number;
  vocabularyType: number;
  changedOn: string;
  answer: string;
  correctAnswer: string;
}

export enum TrainingRenderType {
  Options,
  Input,
  Connection
}