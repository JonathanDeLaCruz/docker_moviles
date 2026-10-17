import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Campo, buscarColeccion, rutaColeccion } from '../catalogos/colecciones.config';
import { ColeccionesService, Registro } from '../services/colecciones';
@Component({ selector: 'app-colecciones-form', templateUrl: './colecciones-form.page.html', standalone: false })
export class ColeccionesFormPage implements OnInit {
  config = buscarColeccion(this.route.snapshot.data['coleccion']); base = rutaColeccion(this.config);
  form = new FormGroup<Record<string, FormControl>>({}); opciones: Record<string, Registro[]> = {};
  id?: number; cargando = true; guardando = false; mensaje = ''; listo = false;
  constructor(private route: ActivatedRoute, private router: Router, private servicio: ColeccionesService) {}
  async ionViewWillEnter(): Promise<void> {
    if (!this.listo) return;
    try {
      await Promise.all(this.config.campos.filter(c => c.relacion).map(async campo => { this.opciones[campo.clave] = await this.servicio.opciones(campo.relacion!); }));
    } catch (e) { this.mensaje = this.servicio.mensaje(e); }
  }
  async ngOnInit(): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id'); this.id = id === null ? undefined : Number(id);
      for (const campo of this.config.campos) {
        const reglas: ValidatorFn[] = [];
        if (campo.obligatorio) reglas.push(Validators.required);
        if (campo.obligatorio && ['text', 'textarea'].includes(campo.tipo)) reglas.push(Validators.pattern(/\S/));
        if (campo.longitud) reglas.push(Validators.maxLength(campo.longitud));
        if (campo.tipo === 'email') reglas.push(Validators.email);
        if (campo.tipo === 'url') reglas.push(Validators.pattern(/^https?:\/\/[^\s]+$/));
        if (campo.tipo === 'tel') reglas.push(Validators.pattern(/^[0-9+ ()-]{7,20}$/));
        if (campo.tipo === 'aceptacion') reglas.push(Validators.requiredTrue);
        if (campo.min !== undefined) reglas.push(Validators.min(campo.min));
        if (campo.max !== undefined) reglas.push(Validators.max(campo.max));
        if (campo.entero) reglas.push(Validators.pattern(/^\d+$/));
        if (campo.clave === 'monto') reglas.push(Validators.pattern(/^\d+(\.\d{1,2})?$/));
        this.form.addControl(campo.clave, new FormControl(campo.inicial ?? (campo.tipo === 'boolean' ? false : ''), reglas));
      }
      await Promise.all(this.config.campos.filter(c => c.relacion).map(async campo => { this.opciones[campo.clave] = await this.servicio.opciones(campo.relacion!); }));
      if (this.id !== undefined) {
        const registro = await this.servicio.detalle(this.config, this.id);
        for (const campo of this.config.campos) {
          const valor = registro[campo.clave];
          this.form.controls[campo.clave].setValue(campo.relacion ? valor?.id ?? null : valor ?? campo.inicial ?? '');
        }
      }
      this.listo = true;
    } catch (e) { this.mensaje = this.servicio.mensaje(e); }
    finally { this.cargando = false; }
  }
  error(campo: Campo): string {
    const control = this.form.controls[campo.clave];
    if (!control.touched || !control.invalid) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Escribe un correo válido.';
    if (control.hasError('maxlength')) return 'Máximo ' + campo.longitud + ' caracteres.';
    if (control.hasError('min')) return 'El mínimo es ' + campo.min + '.';
    if (control.hasError('max')) return 'El máximo es ' + campo.max + '.';
    return 'Revisa el formato de este campo.';
  }
  marcar(campo: Campo, valor: string, checked: boolean): void {
    const control = this.form.controls[campo.clave]; const valores: string[] = control.value ?? [];
    control.setValue(checked ? [...new Set([...valores, valor])] : valores.filter(v => v !== valor));
  }
  async guardar(): Promise<void> {
    if (this.guardando || !this.listo) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); this.mensaje = 'Revisa los campos marcados.'; return; }
    this.guardando = true; this.mensaje = '';
    try {
      const datos: Registro = {};
      for (const campo of this.config.campos) {
        const valor = this.form.controls[campo.clave].value;
        datos[campo.clave] = valor === '' || valor === null || valor === undefined ? null
          : campo.tipo === 'number' || campo.tipo === 'range' || campo.relacion ? Number(valor)
          : campo.tipo === 'time' ? String(valor).slice(0, 5) + ':00'
          : typeof valor === 'string' ? valor.trim() : valor;
      }
      const registro = await this.servicio.guardar(this.config, datos, this.id);
      await this.router.navigateByUrl(this.base + '/detalle/' + registro['id'], { replaceUrl: true });
    } catch (e) { this.mensaje = this.servicio.mensaje(e); }
    finally { this.guardando = false; }
  }
}
