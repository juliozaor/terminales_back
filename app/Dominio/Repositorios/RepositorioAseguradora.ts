/* eslint-disable @typescript-eslint/semi */
import { Aseguradora } from '../Datos/Entidades/Aseguradora';
import { Paginador } from '../Paginador';

export interface RepositorioAseguradora {
  obtenerAseguradoras(param: any): Promise<{aseguradoras: Aseguradora[], paginacion: Paginador}>
  obtenerAseguradora(id:number): Promise<Aseguradora>
  crearAseguradora(aseguradora: Aseguradora): Promise<Aseguradora>
  actualizarAseguradoraAll(aseguradora:Aseguradora): Promise<Aseguradora>
  eliminarAseguradora(id:number): Promise<{message: string}>
}
