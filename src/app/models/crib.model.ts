export interface CribResponseModel {
  id: number;
  languageid: number;
  cribDescriptions: CribDescriptionResponseModel[];
}

export interface CribDescriptionResponseModel {
  id: number;
  header: string;
  description: string;
  order: number;
  type: number;
}

export interface IrregularVerbModel {
  id: number;
  baseForm: string;
  pastSimple: string;
  pastParticiple: string;
  languageId: number;
}