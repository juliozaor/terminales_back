
import { Paginador } from '../Paginador';

export interface RepositorioVerificador {
  listar(id: string, rol: string): Promise<{}>
}
