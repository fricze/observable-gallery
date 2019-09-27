import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePhotoComponent } from './active-photo.component';

describe('ActivePhotoComponent', () => {
  let component: ActivePhotoComponent;
  let fixture: ComponentFixture<ActivePhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
