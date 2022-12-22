import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceintViewProductsComponent } from './receint-view-products.component';

describe('ReceintViewProductsComponent', () => {
  let component: ReceintViewProductsComponent;
  let fixture: ComponentFixture<ReceintViewProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceintViewProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceintViewProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
