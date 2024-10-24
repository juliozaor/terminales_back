import { RespuestaRutas } from 'App/Dominio/Dto/RespuestaRutas';
import { Paginador } from '../../Paginador';
import { RepositorioTerminales } from 'App/Dominio/Repositorios/RepositorioTerminales';
import { RespuestaParadas } from 'App/Dominio/Dto/RespuestaParadas';
import { RespuestaClases } from 'App/Dominio/Dto/RespuestaClases';

export class ServicioTerminales{
  constructor (private repositorio: RepositorioTerminales) { }

  async visualizarRutas(param: any, id: number): Promise<{rutas: RespuestaRutas[], paginacion: Paginador}>{
    return this.repositorio.visualizarRutas(param, id)
  }

  async visualizarParadasPorRuta(param: any, id: number): Promise<{paradas: RespuestaParadas[], paginacion: Paginador}>{
    return this.repositorio.visualizarParadasPorRuta(param, id)
  }

  async visualizarClasesPorRuta(param: any, id: number): Promise<{clases: RespuestaClases[], paginacion: Paginador}>{
    return this.repositorio.visualizarClasesPorRuta(param, id)
  }

  async numeroTotalRutasPorUsuario(id: number): Promise<any>{
    return this.repositorio.numeroTotalRutasPorUsuario(id)
  }

  async guardarDireccion(param: any) {
    return this.repositorio.guardarDireccion(param)
  }

  async guardarRuta(param: any, id: number) {
    return this.repositorio.guardarRuta(param, id)
  }

  async guardarRutas(param: any, id: number) {
    return this.repositorio.guardarRutas(param, id)
  }
}
