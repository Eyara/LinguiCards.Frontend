export interface CribResponseModel {
  id: number;
  name: string;
  cribDescriptions: CribDescriptionResponseModel[];
}

export interface CribDescriptionResponseModel {
  id: number;
  header: string;
  description: string;
  order: number;
  type: number;
}
