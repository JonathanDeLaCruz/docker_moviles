import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosFormPage } from './productos-form.page';

describe('ProductosFormPage', () => {
  let component: ProductosFormPage;
  let fixture: ComponentFixture<ProductosFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
