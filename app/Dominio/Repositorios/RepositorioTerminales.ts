/* eslint-disable @typescript-eslint/semi */
import { Aseguradora } from '../Datos/Entidades/Aseguradora';
import { RespuestaRutas } from '../Dto/RespuestaRutas';
import { Paginador } from '../Paginador';

export interface RepositorioTerminales {
  visualizarRutas(param: any, id: number): Promise<{ rutas: RespuestaRutas[], paginacion: Paginador }>
  numeroTotalRutasPorUsuario(id: number): Promise<any>;
  // obtenerAseguradora(id:number): Promise<Aseguradora>
  // crearAseguradora(aseguradora: Aseguradora): Promise<Aseguradora>
  // actualizarAseguradoraAll(aseguradora:Aseguradora): Promise<Aseguradora>
}
