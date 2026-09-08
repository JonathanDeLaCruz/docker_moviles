import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosListPage } from './productos-list.page';

describe('ProductosListPage', () => {
  let component: ProductosListPage;
  let fixture: ComponentFixture<ProductosListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
