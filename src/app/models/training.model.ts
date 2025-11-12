export interface TrainingModel {
  id: number;
  isCorrectAnswer: boolean;
  passiveLearned: number;
  activeLearned: number;
  trainingId: string;
  wordId: number;
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