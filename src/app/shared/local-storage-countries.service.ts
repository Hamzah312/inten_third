import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Country } from './Country';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageCountriesService {
  private storedCountries: Country[] = JSON.parse(
    localStorage.getItem('selectedCountries')!
  );

  constructor() {}

  storeSelectedCountries(selectedCountries: Country[]) {
    localStorage.setItem(
      'selectedCountries',
      JSON.stringify(selectedCountries)
    );
  }

  getStoredCountries(): Country[] {
    return this.storedCountries;
  }
  checkAllStoredCountries(countries: Country[]) {
    for (const country of countries) {
      if (this.storedCountries.some(storedCountry => storedCountry.cca3 === country.cca3)) {
        country.isChecked=true;
      }
    }
  }

  storeSelectedBorders(borders:Country[]){
    localStorage.setItem(
      'selectedBorders',
      JSON.stringify(borders)
    );
  }
  getStoredBorders(): Country[]{
    return JSON.parse(localStorage.getItem('selectedBorders')!);
  }
}
