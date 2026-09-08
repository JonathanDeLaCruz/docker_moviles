import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosListPage } from './usuarios-list.page';

describe('UsuariosListPage', () => {
  let component: UsuariosListPage;
  let fixture: ComponentFixture<UsuariosListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
