import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatCredit } from './resultat-credit';

describe('ResultatCredit', () => {
  let component: ResultatCredit;
  let fixture: ComponentFixture<ResultatCredit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatCredit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatCredit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
