import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChancesComponent } from './chances.component';

describe('ChancesComponent', () => {
  let component: ChancesComponent;
  let fixture: ComponentFixture<ChancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
