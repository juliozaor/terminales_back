import { Paginador } from '../../Paginador';
import { RepositorioVerificador } from 'App/Dominio/Repositorios/RepositorioVerificador';

export class ServicioVerificador{
  constructor (private repositorio: RepositorioVerificador) { }
  async listar(param: any, id: string): Promise<{}>{
    return this.repositorio.listar(param, id)
  }

}
