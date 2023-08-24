import { Component, OnInit, ViewChild } from '@angular/core';
import { Country } from 'src/app/shared/Country';
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
  countriesList: Country[] = [];
  countries = new MatTableDataSource<Country>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private fetchCountryService: FetchCountriesService,
    private _liveAnnouncer: LiveAnnouncer,
    private localStorageCountriesService: LocalStorageCountriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCountries();
    console.log(this.localStorageCountriesService.getStoredCountries());
    console.log(this.localStorageCountriesService.getStoredBorders());
  }

  getCountries(): void {
    this.fetchCountryService
      .getCountries()
      .pipe(take(1))
      .subscribe((countries: Country[]) => {
        this.countriesList = countries;
        this.countries.data = countries;
        this.countries.paginator = this.paginator;
        this.countries.sort = this.sort;
        this.localStorageCountriesService.checkAllStoredCountries(
          this.countries.data
        );
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.countries.filter = filterValue.trim().toLowerCase();
  }

  storeCountries(storedCountries: Country[]) {
    this.localStorageCountriesService.storeSelectedCountries(storedCountries);
  }
  toggleAndStoreCountries(country: Country) {
    let storedCountries: Country[] =
      this.localStorageCountriesService.getStoredCountries();
    let storedBorders: Country[] =
      this.localStorageCountriesService.getStoredBorders()
        ? this.localStorageCountriesService.getStoredBorders()
        : [];
    const countryBorders = this.getBordersByCountry(
      this.countriesList,
      country.borders
    );
    if (country.isChecked) {
      storedCountries.push(country);
      storedBorders = storedBorders.concat(countryBorders);
    } else {
      storedCountries.splice(
        storedCountries.findIndex((item) => item.cca3 === country.cca3),
        1
      );
      this.deleteBorders(storedBorders, countryBorders);
    }

    this.storeCountries(storedCountries);
    this.storeBorders(storedBorders);
  }
  getBordersByCountry(list: Country[], cca3s: string[]) {
    if (!cca3s) return [];
    return list.filter((country) => cca3s.includes(country.cca3));
  }

  storeBorders(borders: Country[]) {
    this.localStorageCountriesService.storeSelectedBorders(borders);
  }

  deleteBorders(storedBorders: Country[], countryBorders: Country[]) {
    for (const border of countryBorders) {
      let index = storedBorders.findIndex((item) => item.cca3 === border.cca3);
      storedBorders.splice(index, 1);
    }
  }

  showCountryBorders(country: Country) {
    let storedBorders: Country[] =
      this.localStorageCountriesService.getStoredBorders()
        ? this.localStorageCountriesService.getStoredBorders()
        : [];
    let clickedBordersCountriesList: Country[];
    clickedBordersCountriesList = this.getDialogBorderData(
      this.getBordersByCountry(this.countriesList, country.borders),
      this.getBordersByCountry(storedBorders, country.borders)
    );
    this.dialog.open(BordersTableComponent, {
      data: { borders: clickedBordersCountriesList,name:country.name },
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
}
