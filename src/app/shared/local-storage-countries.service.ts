import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Country } from './models/Country.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageCountriesService {
  private storedCountries!: Country[];

  constructor() {
    this.storedCountries = JSON.parse(
      localStorage.getItem('selectedCountries')!
    );
  }

  storeSelectedCountries(selectedCountries: Country[]) {
    localStorage.setItem(
      'selectedCountries',
      JSON.stringify(selectedCountries)
    );
  }

  getStoredCountries(): Country[] {
    return this.storedCountries;
  }

  storeSelectedBorders(borders: Country[]) {
    localStorage.setItem('selectedBorders', JSON.stringify(borders));
  }
  getStoredBorders(): Country[] {
    return JSON.parse(localStorage.getItem('selectedBorders')!);
  }
}
