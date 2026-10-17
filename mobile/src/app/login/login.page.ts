import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
@Component({ selector: 'app-login', templateUrl: './login.page.html', styleUrls: ['./login.page.scss'], standalone: false })
export class LoginPage {
  form: FormGroup;
  enviando = false;
  mensaje = '';
  constructor(fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  }
  async ingresar(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando = true;
    this.mensaje = '';
    try {
      await this.auth.ingresar(this.form.value.email, this.form.value.password);
      const destino = new URLSearchParams(location.search).get('returnUrl');
      await this.router.navigateByUrl(destino?.startsWith('/') && !destino.startsWith('//') ? destino : '/tabs/productos', { replaceUrl: true });
      this.form.reset();
    } catch { this.mensaje = 'No fue posible iniciar sesión. Revisa tus datos y el acceso al servidor.'; }
    finally { this.enviando = false; }
  }
}
