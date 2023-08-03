import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivyComponent } from './privy.component';

describe('PrivyComponent', () => {
  let component: PrivyComponent;
  let fixture: ComponentFixture<PrivyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivyComponent]
    });
    fixture = TestBed.createComponent(PrivyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
