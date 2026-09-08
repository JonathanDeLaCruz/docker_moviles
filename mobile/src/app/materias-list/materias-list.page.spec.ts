import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MateriasListPage } from './materias-list.page';

describe('MateriasListPage', () => {
  let component: MateriasListPage;
  let fixture: ComponentFixture<MateriasListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriasListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
