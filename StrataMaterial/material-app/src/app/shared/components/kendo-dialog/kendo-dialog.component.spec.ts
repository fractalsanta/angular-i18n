import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KendoDialogComponent } from './kendo-dialog.component';

describe('KendoDialogComponent', () => {
  let component: KendoDialogComponent;
  let fixture: ComponentFixture<KendoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KendoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KendoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
