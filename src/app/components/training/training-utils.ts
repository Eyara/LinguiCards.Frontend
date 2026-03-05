import { TrainingType, WordTrainingModel } from '../../models/word.model';
import { TrainingRenderType } from '../../models/training.model';

export function getTrainingRenderType(word: WordTrainingModel): TrainingRenderType {
  if (word?.type === TrainingType.WordConnect) {
    return TrainingRenderType.Connection;
  } else if (needShowOptions(word)) {
    return TrainingRenderType.Options;
  }
  return TrainingRenderType.Input;
}

export function needShowOptions(word: WordTrainingModel | null): boolean {
  return word?.type === TrainingType.FromLearnLanguage || word?.type === TrainingType.FromNativeLanguage;
}

export function getCardName(word: WordTrainingModel | null): string {
  if (!word) return '';
  return word.type === TrainingType.FromLearnLanguage || word.type === TrainingType.WritingFromLearnLanguage
    ? word.name
    : word.translatedName;
}

export function getTargetWord(word: WordTrainingModel | null): string {
  if (!word) return '';
  return word.type === TrainingType.FromLearnLanguage || word.type === TrainingType.WritingFromLearnLanguage
    ? word.translatedName
    : word.name;
}

export function checkAnswer(word: WordTrainingModel | null, selectedOption: string, writtenTranslation: string): boolean {
  if (!word) return false;

  switch (word.type) {
    case TrainingType.FromLearnLanguage:
      return word.translatedName === selectedOption;
    case TrainingType.FromNativeLanguage:
      return word.name === selectedOption;
    case TrainingType.WritingFromLearnLanguage:
      return word.translatedName.toLowerCase().trim() === writtenTranslation.toLowerCase().trim();
    case TrainingType.WritingFromNativeLanguage:
      return word.name.toLowerCase().trim() === writtenTranslation.toLowerCase().trim();
    default:
      return false;
  }
}

export function getOptionCssClass(
  option: string,
  selectedOption: string,
  currentWord: WordTrainingModel
): string {
  if (currentWord?.translatedName && selectedOption === option) {
    const isCorrect =
      (currentWord.type === TrainingType.FromLearnLanguage && currentWord.translatedName === selectedOption) ||
      (currentWord.type !== TrainingType.FromLearnLanguage && currentWord.name === selectedOption);
    return isCorrect ? 'option-card--correct' : 'option-card--incorrect';
  }
  return '';
}
