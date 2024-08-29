import { CountryModel } from "./country.model";

export interface LanguageModel {
    name: string;
    imgSrc: string;
    editMode: boolean;
    countries: CountryModel[];
}