import { TestBed } from '@angular/core/testing';

import { ValidateFileService } from './validate-file.service';

describe('ValidateFileService', () => {
  let service: ValidateFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
