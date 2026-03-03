import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationCredit } from './simulation-credit';

describe('SimulationCredit', () => {
  let component: SimulationCredit;
  let fixture: ComponentFixture<SimulationCredit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationCredit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationCredit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
