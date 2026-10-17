import { Routes } from '@angular/router';
export function rutasColeccion(ruta: string, coleccion: string): Routes {
  const data = { coleccion };
  return [
    { path: ruta + '/formulario/:id', data, loadChildren: () => import('../colecciones-form/colecciones-form.module').then(m => m.ColeccionesFormPageModule) },
    { path: ruta + '/formulario', data, loadChildren: () => import('../colecciones-form/colecciones-form.module').then(m => m.ColeccionesFormPageModule) },
    { path: ruta + '/detalle/:id', data, loadChildren: () => import('../colecciones-view/colecciones-view.module').then(m => m.ColeccionesViewPageModule) },
    { path: ruta, data, loadChildren: () => import('../colecciones-list/colecciones-list.module').then(m => m.ColeccionesListPageModule) }
  ];
}
