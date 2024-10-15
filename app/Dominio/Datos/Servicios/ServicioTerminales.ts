import { RespuestaRutas } from 'App/Dominio/Dto/RespuestaRutas';
import { Paginador } from '../../Paginador';
import { RepositorioTerminales } from 'App/Dominio/Repositorios/RepositorioTerminales';

export class ServicioTerminales{
  constructor (private repositorio: RepositorioTerminales) { }

  async visualizarRutas(param: any, id: number): Promise<{rutas: RespuestaRutas[], paginacion: Paginador}>{
    return this.repositorio.visualizarRutas(param, id)
  }

  async numeroTotalRutasPorUsuario(id: number): Promise<any>{
    return this.repositorio.numeroTotalRutasPorUsuario(id)
  }

  // async obtenerAseguradora(id:number): Promise<Aseguradora>{
  //   return this.repositorio.obtenerAseguradora(id)
  // }
  // async crearAseguradora(aseguradora: Aseguradora): Promise<Aseguradora>{
  //   return this.repositorio.crearAseguradora(aseguradora)
  // }
  // async actualizarAseguradoraAll(aseguradora:Aseguradora): Promise<Aseguradora>{
  //   return this.repositorio.actualizarAseguradoraAll(aseguradora)
  // }
  // async eliminarAseguradora(id:number): Promise<{message: string}>{
  //   return this.repositorio.eliminarAseguradora(id)
  // }

}
