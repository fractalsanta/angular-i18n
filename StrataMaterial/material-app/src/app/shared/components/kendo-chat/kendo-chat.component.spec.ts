import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KendoChatComponent } from './kendo-chat.component';

describe('KendoChatComponent', () => {
  let component: KendoChatComponent;
  let fixture: ComponentFixture<KendoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KendoChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KendoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
