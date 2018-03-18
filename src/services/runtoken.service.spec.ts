import { TestBed, inject } from '@angular/core/testing';

import { RunTokenService } from './runtoken.service';
import {Web3Service} from './services'

describe('RunTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RunTokenService, Web3Service]
    });
  });

  it('should be created', inject([RunTokenService], (service: RunTokenService) => {
    expect(service).toBeTruthy();
  }));
});
