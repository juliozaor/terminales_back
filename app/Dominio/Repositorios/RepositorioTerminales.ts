/* eslint-disable @typescript-eslint/semi */
import { Aseguradora } from '../Datos/Entidades/Aseguradora';
import { Nodo } from '../Datos/Entidades/Nodo';
import { Ruta } from '../Datos/Entidades/Ruta';
import { RespuestaClases } from '../Dto/RespuestaClases';
import { RespuestaParadas } from '../Dto/RespuestaParadas';
import { RespuestaRutas } from '../Dto/RespuestaRutas';
import { Paginador } from '../Paginador';

export interface RepositorioTerminales {
  visualizarRutas(param: any, id: number): Promise<{ rutas: RespuestaRutas[], paginacion: Paginador }>
  visualizarParadasPorRuta(param: any, id: number): Promise<{ paradas: RespuestaParadas[], paginacion: Paginador }>
  visualizarClasesPorRuta(param: any, id: number): Promise<{ clases: RespuestaClases[], paginacion: Paginador }>
  numeroTotalRutasPorUsuario(id: number): Promise<any>;
  guardarDireccion(nodo: Nodo): Promise<any>
  guardarRuta(ruta: RespuestaRutas, id: number): Promise<any>
  // actualizarAseguradoraAll(aseguradora:Aseguradora): Promise<Aseguradora>
}
