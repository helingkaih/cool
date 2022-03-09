import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitComponent } from './unit.component';

describe('UnitComponent', () => {
  let component: UnitComponent;
  let fixture: ComponentFixture<UnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitComponent);
    component = fixture.componentInstance;
    console.log('component', component)
    expect(component.num === 1).toBeTruthy();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
