import { TestBed } from '@angular/core/testing';
import { CreditService } from './credit';

describe('creditCredit', () => {
  let service: CreditService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [CreditService]});
    service = TestBed.inject(CreditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
