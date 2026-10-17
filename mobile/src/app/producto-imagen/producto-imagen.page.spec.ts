import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoImagenPage } from './producto-imagen.page';

describe('ProductoImagenPage', () => {
  let component: ProductoImagenPage;
  let fixture: ComponentFixture<ProductoImagenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoImagenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
