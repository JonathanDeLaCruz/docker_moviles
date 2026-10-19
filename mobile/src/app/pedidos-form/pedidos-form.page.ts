import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { centavos, dinero, importe, LineaGuardar, PedidosService } from '../services/pedidos';
type Fila = FormGroup<{ id: FormControl<number | null>; producto: FormControl<number | null>; cantidad: FormControl<number | null>; precio_unitario: FormControl<string | null> }>;
@Component({ selector: 'app-pedidos-form', templateUrl: './pedidos-form.page.html', standalone: false })
export class PedidosFormPage {
  id?: number; anteriores: number[] = []; cargando = true; guardando = false; mensaje = '';
  clientes: { id: number; nombre: string }[] = []; productos: { id: number; nombre: string; precio: string }[] = [];
  estados = ['pendiente', 'entregado', 'cancelado'];
  form = this.fb.group({ cliente: [0, Validators.min(1)], estado: ['pendiente', Validators.required], observaciones: [''], detalles: this.fb.array<Fila>([]) });
  get filas(): FormArray<Fila> { return this.form.controls.detalles; }
  private seleccion = new Map<Fila, number>();
  constructor(private fb: FormBuilder, private servicio: PedidosService, private route: ActivatedRoute, private router: Router) {}
  async ngOnInit(): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id'); this.id = id === null ? undefined : Number(id);
      const catalogos = await this.servicio.catalogos(); this.clientes = catalogos.clientes; this.productos = catalogos.productos;
      if (this.id === undefined) this.agregar();
      else {
        const p = await this.servicio.detalle(this.id);
        this.form.patchValue({ cliente: p.cliente.id, estado: p.estado, observaciones: p.observaciones ?? '' });
        this.anteriores = p.detalles.map(l => l.id);
        for (const l of p.detalles) this.agregar({ id: l.id, producto: l.producto.id, cantidad: l.cantidad, precio_unitario: l.precio_unitario });
      }
    } catch { this.mensaje = 'No se pudieron cargar el pedido y sus catálogos.'; }
    finally { this.cargando = false; }
  }
  agregar(linea?: LineaGuardar): void {
    const fila = this.fb.group({ id: [linea?.id ?? 0], producto: [linea?.producto ?? 0, Validators.min(1)], cantidad: [linea?.cantidad ?? 1, [Validators.required, Validators.min(1), Validators.max(9999), Validators.pattern(/^\d+$/)]], precio_unitario: [linea?.precio_unitario ?? '0.00', [Validators.required, Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)]] });
    this.filas.push(fila); this.seleccion.set(fila, linea?.producto ?? 0);
  }
  quitar(i: number): void { this.seleccion.delete(this.filas.at(i)); this.filas.removeAt(i); }
  seleccionar(i: number, id: number): void {
    const fila = this.filas.at(i);
    if (this.seleccion.get(fila) === Number(id)) return;
    const producto = this.productos.find(p => p.id === Number(id));
    fila.patchValue({ precio_unitario: producto?.precio ?? '0.00' }); this.seleccion.set(fila, Number(id));
  }
  subtotal(i: number): string {
    try { const l = this.filas.at(i).getRawValue(); return dinero(Number(l.cantidad) * centavos(l.precio_unitario ?? '0.00')); } catch { return '—'; }
  }
  get total(): string { try { return dinero(importe(this.filas.getRawValue().map(l => ({ cantidad: Number(l.cantidad), precio_unitario: l.precio_unitario ?? '0.00' })))); } catch { return '—'; } }
  async guardar(): Promise<void> {
    if (this.guardando || this.cargando) return;
    this.mensaje = '';
    if (this.form.invalid || !this.filas.length) { this.form.markAllAsTouched(); this.mensaje = 'Elige cliente y productos; usa cantidades enteras de 1 a 9999. Agrega al menos un renglón.'; return; }
    this.guardando = true;
    try {
      const v = this.form.getRawValue();
      const id = await this.servicio.guardar({ cliente: Number(v.cliente), estado: v.estado!, observaciones: v.observaciones?.trim() || null,
        detalles: v.detalles.map(l => ({ ...(l.id ? { id: Number(l.id) } : {}), producto: Number(l.producto), cantidad: Number(l.cantidad), precio_unitario: String(l.precio_unitario) })) }, this.id, this.anteriores);
      await this.router.navigateByUrl('/tabs/pedidos/detalle/' + id, { replaceUrl: true });
    } catch (e: any) { this.mensaje = e.response ? 'No se pudo guardar. Revisa productos repetidos, datos y conexión.' : e.message; }
    finally { this.guardando = false; }
  }
}
