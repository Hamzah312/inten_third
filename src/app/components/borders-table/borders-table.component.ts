import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Country } from 'src/app/shared/models/Country.interface';
import { DialogData } from 'src/app/shared/models/DialogData.interface';

@Component({
  selector: 'app-borders-table',
  templateUrl: './borders-table.component.html',
  styleUrls: ['./borders-table.component.css'],
})
export class BordersTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'cca3', 'region'];

  bordersList!: MatTableDataSource<Country>;
  countryName!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.bordersList = new MatTableDataSource<Country>();
    this.countryName = this.data.name;
    this.bordersList.data = this.data.borders;
  }
}
