import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosViewPage } from './productos-view.page';

describe('ProductosViewPage', () => {
  let component: ProductosViewPage;
  let fixture: ComponentFixture<ProductosViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
