import { TestBed } from '@angular/core/testing';

import { LocalStorageCountriesService } from './local-storage-countries.service';

describe('LocalStorageCountiresService', () => {
  let service: LocalStorageCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
