import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.scss'],
  standalone: false
})
export class PaginacionComponent implements OnChanges {

  @Input() total: number = 0;
  @Input() porPagina: number = 10;
  @Input() paginaActual: number = 1;
  @Input() maxPaginasVisibles: number = 5;

  @Output() paginaCambio = new EventEmitter<number>();

  totalPaginas: number = 0;
  paginasVisibles: number[] = [];

  ngOnChanges(): void {
    this.totalPaginas = Math.ceil(
      this.total / this.porPagina
    );

    this.calcularPaginasVisibles();
  }

  private calcularPaginasVisibles(): void {
    if (this.totalPaginas === 0) {
      this.paginasVisibles = [];
      return;
    }

    const mitad = Math.floor(
      this.maxPaginasVisibles / 2
    );

    let inicio = Math.max(
      1,
      this.paginaActual - mitad
    );

    let fin = Math.min(
      this.totalPaginas,
      inicio + this.maxPaginasVisibles - 1
    );

    inicio = Math.max(
      1,
      fin - this.maxPaginasVisibles + 1
    );

    this.paginasVisibles = [];

    for (let pagina = inicio; pagina <= fin; pagina++) {
      this.paginasVisibles.push(pagina);
    }
  }

  cambiarPagina(pagina: number): void {
    if (
      pagina < 1 ||
      pagina > this.totalPaginas ||
      pagina === this.paginaActual
    ) {
      return;
    }

    this.paginaCambio.emit(pagina);
  }

  anterior(): void {
    this.cambiarPagina(
      this.paginaActual - 1
    );
  }

  siguiente(): void {
    this.cambiarPagina(
      this.paginaActual + 1
    );
  }
}
