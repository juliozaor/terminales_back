/* eslint-disable @typescript-eslint/semi */
import { Rol } from '../Datos/Entidades/Autorizacion/Rol';
import { Paginador } from '../Paginador';

export interface RepositorioRol {
  obtenerRolporID(id: string): Promise<Rol>
 /*  guardarRol(rol: Rol): Promise<Rol> */
  obtenerRols(param: any): Promise<{rols: Rol[], paginacion: Paginador}>
}
