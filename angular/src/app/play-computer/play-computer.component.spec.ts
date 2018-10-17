import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayComputerComponent } from './play-computer.component';

describe('PlayComputerComponent', () => {
  let component: PlayComputerComponent;
  let fixture: ComponentFixture<PlayComputerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayComputerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayComputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
