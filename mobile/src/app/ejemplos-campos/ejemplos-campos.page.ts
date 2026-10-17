import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EjemploCrear, EjemploGuardado, EjemplosCamposService } from '../services/ejemplos-campos';

@Component({
  selector: 'app-ejemplos-campos',
  templateUrl: './ejemplos-campos.page.html',
  styleUrls: ['./ejemplos-campos.page.scss'],
  standalone: false
})
export class EjemplosCamposPage {
  readonly usarBotonFlotante = false;
  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/\S/)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    telefono: ['', Validators.pattern(/^[0-9+ ()-]{7,20}$/)],
    sitio_web: ['', [Validators.maxLength(100), Validators.pattern(/^https?:\/\/[^\s]+$/)]],
    descripcion: [''],
    edad: ['', [Validators.min(18), Validators.max(100), Validators.pattern(/^\d+$/)]],
    monto: ['', [Validators.required, Validators.min(0), Validators.max(99999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    tipo: ['', Validators.required],
    modalidad: ['presencial', Validators.required],
    tecnologias: this.fb.control<string[]>([]),
    canales: this.fb.group({ correo: [false], whatsapp: [false] }),
    acepta_terminos: [false, Validators.requiredTrue],
    recibir_avisos: [false],
    prioridad: [3, [Validators.min(0), Validators.max(10)]],
    fecha_evento: [''],
    hora_evento: ['']
  });
  enviando = false;
  mensaje = '';
  envio: EjemploCrear | null = null;
  guardado: EjemploGuardado | null = null;
  constructor(private fb: FormBuilder, private servicio: EjemplosCamposService) {}

  error(nombre: string): string {
    const control = this.form.get(nombre);
    if (!control?.touched || !control.errors) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Escribe un correo válido.';
    if (control.hasError('min')) return 'El mínimo es ' + control.errors['min'].min + '.';
    if (control.hasError('max')) return 'El máximo es ' + control.errors['max'].max + '.';
    if (control.hasError('maxlength')) return 'El texto supera la longitud permitida.';
    return 'Revisa el formato de este campo.';
  }
  async guardar(): Promise<void> {
    if (this.enviando || this.guardado) return;
    this.mensaje = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje = 'Revisa los campos marcados antes de guardar.';
      return;
    }
    const v = this.form.getRawValue();
    this.enviando = true;
    try {
      const origen = await this.servicio.obtenerOrigenApp();
      this.envio = {
      nombre: v.nombre!.trim(), correo: v.correo!.trim(),
      telefono: v.telefono?.trim() || null, sitio_web: v.sitio_web?.trim() || null,
      descripcion: v.descripcion?.trim() || null,
      edad: v.edad === '' || v.edad === null ? null : Number(v.edad), monto: Number(v.monto),
      tipo: v.tipo as EjemploCrear['tipo'], modalidad: v.modalidad as EjemploCrear['modalidad'], tecnologias: v.tecnologias ?? [],
      canales: [v.canales.correo ? 'correo' : '', v.canales.whatsapp ? 'whatsapp' : ''].filter(Boolean),
      acepta_terminos: !!v.acepta_terminos, recibir_avisos: !!v.recibir_avisos,
      prioridad: Number(v.prioridad), fecha_evento: v.fecha_evento || null,
      hora_evento: v.hora_evento ? v.hora_evento.slice(0, 5) + ':00' : null,
      estado: 'pendiente', origen: origen.id, fecha_envio: new Date().toISOString()
    };
      this.guardado = await this.servicio.crear(this.envio);
      this.mensaje = 'Ejemplo guardado correctamente.';
    } catch {
      this.mensaje = 'No fue posible guardar. Revisa la conexión y los permisos de la colección.';
    } finally { this.enviando = false; }
  }
  async consultarGuardado(): Promise<void> {
    if (!this.guardado || this.enviando) return;
    this.enviando = true;
    try {
      this.guardado = await this.servicio.obtener(this.guardado.id);
      this.mensaje = 'Registro recuperado desde Directus.';
    } catch { this.mensaje = 'No fue posible recuperar el registro guardado.'; }
    finally { this.enviando = false; }
  }
  nuevo(): void {
    if (this.enviando) return;
    this.form.reset({ nombre: '', correo: '', telefono: '', sitio_web: '', descripcion: '', edad: '', monto: '',
      tipo: '', modalidad: 'presencial', tecnologias: [], canales: { correo: false, whatsapp: false },
      acepta_terminos: false, recibir_avisos: false, prioridad: 3, fecha_evento: '', hora_evento: '' });
    this.guardado = null; this.envio = null; this.mensaje = '';
  }
}
