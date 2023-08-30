import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Country } from './models/Country.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { LocalStorageCountriesService } from './local-storage-countries.service';
import { SelectionModel } from '@angular/cdk/collections';
@Injectable({
  providedIn: 'root',
})
export class FetchCountriesService {
  private countriesUrl = 'https://restcountries.com/v3.1/all';
  constructor(
    private http: HttpClient,
    private localStorageCountriesService: LocalStorageCountriesService
  ) {}
  getCountries(): Observable<Country[]> {
    return this.http.get(this.countriesUrl).pipe(
      map((response: any) => {
        const fetchedCountries = response.map((country: any) => ({
          isChecked: false,
          name: country.name.common,
          cca3: country.cca3,
          capital: country.capital ? country.capital[0] : '',
          population: Number.parseInt(country.population),
          region: country.region,
          borders: country.borders,
        }));
        return fetchedCountries;
      }),
      catchError((error: any) => {
        console.error('An error occurred in fetching data');
        const storedCountries =
          this.localStorageCountriesService.getStoredCountries();
        storedCountries.map((storedCountry) => (storedCountry.disabled = true));
        return of(storedCountries);
      })
    );
  }
}
