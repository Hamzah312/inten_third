import { Component, OnInit, ViewChild } from '@angular/core';
import { Country } from 'src/app/shared/models/Country.interface';
import { FetchCountriesService } from 'src/app/shared/fetch-countries.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LocalStorageCountriesService } from 'src/app/shared/local-storage-countries.service';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BordersTableComponent } from '../borders-table/borders-table.component';
@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css'],
})
export class CountriesListComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'cca3',
    'capital',
    'population',
    'region',
    'border',
  ];
  countriesDataSource!: MatTableDataSource<Country>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private fetchCountryService: FetchCountriesService,
    private _liveAnnouncer: LiveAnnouncer,
    private localStorageCountriesService: LocalStorageCountriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.countriesDataSource = new MatTableDataSource<Country>();
    this.getCountries();
  }

  getCountries(): void {
    this.fetchCountryService
      .getCountries()
      .pipe(take(1))
      .subscribe((countries: Country[]) => {
        this.countriesDataSource.data = countries;
        this.countriesDataSource.paginator = this.paginator;
        this.countriesDataSource.sort = this.sort;
        this.checkAllStoredCountries(
          this.countriesDataSource.data,
          this.localStorageCountriesService.getStoredCountries()
        );
      });
  }

  announceSortChange(sortState: Sort) {
    const announcement = sortState.direction
      ? `Sorted ${sortState.direction}ending`
      : 'Sorting cleared';
    this._liveAnnouncer.announce(announcement);
  }

  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.countriesDataSource.filter = filterValue.trim().toLowerCase();
  }

  storeCountriesInLocalStorage(storedCountries: Country[]) {
    this.localStorageCountriesService.storeSelectedCountries(storedCountries);
  }

  checkAllStoredCountries(countries: Country[], storedCountries: Country[]) {
    countries.map((country) => {
      if (
        storedCountries.some(
          (storedCountry) => storedCountry.cca3 === country.cca3
        )
      ) {
        country.isChecked = true;
      }
    });
  }
  toggleAndStoreCountries(country: Country) {
    const storedCountries: Country[] =
      this.localStorageCountriesService.getStoredCountries();

    let storedBorders: Country[] =
      this.localStorageCountriesService.getStoredBorders() ?? [];

    const countryBorders = this.getBordersByCountry(
      this.countriesDataSource.data,
      country.borders
    );
    if (country.isChecked) {
      storedCountries.push(country);
      this.addBorders(storedBorders, countryBorders);
    } else {
      storedCountries.splice(
        storedCountries.findIndex((item) => item.cca3 === country.cca3),
        1
      );
      this.deleteBorders(storedBorders, countryBorders, storedCountries);
    }

    this.storeCountriesInLocalStorage(storedCountries);
    this.storeBordersInLocalStorage(storedBorders);
  }
  addBorders(storedBorders: Country[], countryBorders: Country[]) {
    for (const border of countryBorders) {
      if (!storedBorders.some((el) => el.cca3 === border.cca3))
        storedBorders.push(border);
    }
  }
  getBordersByCountry(list: Country[], cca3s: string[]) {
    if (!cca3s) return [];
    return list.filter((country) => cca3s.includes(country.cca3));
  }

  storeBordersInLocalStorage(borders: Country[]) {
    this.localStorageCountriesService.storeSelectedBorders(borders);
  }

  deleteBorders(
    storedBorders: Country[],
    countryBorders: Country[],
    storedCountries: Country[]
  ) {
    for (const border of countryBorders) {
      if (this.isBorderInUse(border, storedCountries)) {
        storedBorders = storedBorders.filter(
          (item) => item.cca3 !== border.cca3
        );
      }
    }
  }

  showCountryBorders(country: Country) {
    const storedBorders: Country[] =
      this.localStorageCountriesService.getStoredBorders() ?? [];

    const clickedBordersCountriesList: Country[] = this.getDialogBorderData(
      this.getBordersByCountry(this.countriesDataSource.data, country.borders),
      this.getBordersByCountry(storedBorders, country.borders)
    );

    this.dialog.open(BordersTableComponent, {
      data: { borders: clickedBordersCountriesList, name: country.name },
    });
  }

  getDialogBorderData(
    bordersFromCountriesList: Country[],
    bordersFromStorage: Country[]
  ) {
    let len1 = bordersFromCountriesList.length;
    let len2 = bordersFromStorage.length;
    return len1 >= len2 ? bordersFromCountriesList : bordersFromStorage;
  }

  isBorderInUse(country: Country, storedCountries: Country[]) {
    let count = 0;
    for (const storedCountry of storedCountries) {
      if (count > 1) {
        return true;
      }
      for (const storedCountryBorder of storedCountry.borders) {
        if (storedCountryBorder === country.cca3) {
          count++;
        }
      }
    }
    return false;
  }
}
