import { Paginador } from '../../Paginador';
import { RepositorioAseguradora } from 'App/Dominio/Repositorios/RepositorioAseguradora';
import { Aseguradora } from '../Entidades/Aseguradora';

export class ServicioAseguradora{
  constructor (private repositorio: RepositorioAseguradora) { }

  async obtenerAseguradoras(param: any): Promise<{aseguradoras: Aseguradora[], paginacion: Paginador}>{
    return this.repositorio.obtenerAseguradoras(param)
  }
  async obtenerAseguradora(id:number): Promise<Aseguradora>{
    return this.repositorio.obtenerAseguradora(id)
  }
  async crearAseguradora(aseguradora: Aseguradora): Promise<Aseguradora>{
    return this.repositorio.crearAseguradora(aseguradora)
  }
  async actualizarAseguradoraAll(aseguradora:Aseguradora): Promise<Aseguradora>{
    return this.repositorio.actualizarAseguradoraAll(aseguradora)
  }
  async eliminarAseguradora(id:number): Promise<{message: string}>{
    return this.repositorio.eliminarAseguradora(id)
  }

}
