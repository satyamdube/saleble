import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermOfSaleComponent } from './term-of-sale.component';

describe('TermOfSaleComponent', () => {
  let component: TermOfSaleComponent;
  let fixture: ComponentFixture<TermOfSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermOfSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermOfSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
