import { CountryModel } from "./country.model";

export interface LanguageModel {
    id: number;
    name: string;
    imgSrc: string;
    editMode: boolean;
    countries: CountryModel[];
}