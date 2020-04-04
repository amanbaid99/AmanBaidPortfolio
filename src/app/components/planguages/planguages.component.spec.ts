import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanguagesComponent } from './planguages.component';

describe('PlanguagesComponent', () => {
  let component: PlanguagesComponent;
  let fixture: ComponentFixture<PlanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
