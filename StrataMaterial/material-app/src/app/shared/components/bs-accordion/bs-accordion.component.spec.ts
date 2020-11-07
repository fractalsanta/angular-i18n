import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsAccordionComponent } from './bs-accordion.component';

describe('BsAccordionComponent', () => {
  let component: BsAccordionComponent;
  let fixture: ComponentFixture<BsAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
