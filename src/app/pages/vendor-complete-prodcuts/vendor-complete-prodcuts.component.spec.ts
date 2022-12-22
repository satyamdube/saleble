import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCompleteProdcutsComponent } from './vendor-complete-prodcuts.component';

describe('VendorCompleteProdcutsComponent', () => {
  let component: VendorCompleteProdcutsComponent;
  let fixture: ComponentFixture<VendorCompleteProdcutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCompleteProdcutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCompleteProdcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
