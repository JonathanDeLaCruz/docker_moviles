import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return await auth.validarSesion()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
