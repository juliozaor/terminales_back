/* eslint-disable @typescript-eslint/semi */
import { Aseguradora } from '../Datos/Entidades/Aseguradora';
import { RespuestaClases } from '../Dto/RespuestaClases';
import { RespuestaParadas } from '../Dto/RespuestaParadas';
import { RespuestaRutas } from '../Dto/RespuestaRutas';
import { Paginador } from '../Paginador';

export interface RepositorioTerminales {
  visualizarRutas(param: any, id: number): Promise<{ rutas: RespuestaRutas[], paginacion: Paginador }>
  visualizarParadasPorRuta(param: any, id: number): Promise<{ paradas: RespuestaParadas[], paginacion: Paginador }>
  visualizarClasesPorRuta(param: any, id: number): Promise<{ clases: RespuestaClases[], paginacion: Paginador }>
  numeroTotalRutasPorUsuario(id: number): Promise<any>;
  // obtenerAseguradora(id:number): Promise<Aseguradora>
  // crearAseguradora(aseguradora: Aseguradora): Promise<Aseguradora>
  // actualizarAseguradoraAll(aseguradora:Aseguradora): Promise<Aseguradora>
}
