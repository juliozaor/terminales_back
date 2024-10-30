/* eslint-disable @typescript-eslint/semi */
import { ClaseVehiculo } from '../Datos/Entidades/ClaseVehiculo';
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
  guardarRuta(ruta: RespuestaRutas, id: number): Promise<RespuestaRutas>
  guardar(arregloTerminales: any[], id: number): Promise<any>
  guardarParadas(parada: RespuestaParadas): Promise<RespuestaParadas>
  guardarClases(clase: ClaseVehiculo): Promise<RespuestaClases>
  enviarSt(param: any, id: number): Promise<any>
}
