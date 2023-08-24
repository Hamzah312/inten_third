import { BooleanInput } from "@angular/cdk/coercion";

export interface Country {
  disabled:BooleanInput;
  isChecked:BooleanInput;
  name: string;
  capital: string;
  cca3: string;
  population: Number;
  region: string;
  borders: string[];
}
