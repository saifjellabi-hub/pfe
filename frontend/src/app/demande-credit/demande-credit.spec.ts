import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCredit } from './demande-credit';

describe('DemandeCredit', () => {
  let component: DemandeCredit;
  let fixture: ComponentFixture<DemandeCredit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeCredit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeCredit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
