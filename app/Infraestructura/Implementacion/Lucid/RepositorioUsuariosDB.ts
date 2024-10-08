
import { Paginador } from 'App/Dominio/Paginador';
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB';
import { RepositorioUsuario } from 'App/Dominio/Repositorios/RepositorioUsuario';
import { Usuario } from 'App/Dominio/Datos/Entidades/Usuario';
import TblUsuarios from 'App/Infraestructura/Datos/Entidad/Usuario';
import { PayloadJWT } from '../../../Dominio/Dto/PayloadJWT';
export class RepositorioUsuariosDB implements RepositorioUsuario {
  async obtenerUsuarios (params: any): Promise<{usuarios: Usuario[], paginacion: Paginador}> {
    const usuarios: Usuario[] = []

    const consulta = TblUsuarios.query()
    if (params.rol) {
      consulta.where('usn_rol_id', params.rol)
    }
if(params.termino){
  consulta.andWhere(subquery => {
    subquery.orWhere('usn_correo', 'ilike', `%${params.termino}%`)
    subquery.orWhere('usn_nombre', 'ilike', `%${params.termino}%`)
    subquery.orWhere('usn_apellido', 'ilike', `%${params.termino}%`)
    subquery.orWhere('usn_identificacion', 'ilike', `%${params.termino}%`)
  })
}
    

    const usuariosDB = await consulta.orderBy('usn_nombre', 'asc').paginate(params.pagina, params.limite)

    usuariosDB.forEach(usuariosDB => {
      usuarios.push(usuariosDB.obtenerUsuario())
    })
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(usuariosDB)
    return {usuarios , paginacion}
  }

  async obtenerUsuarioPorId (id: string): Promise<Usuario> {
    const usuario = await TblUsuarios.findOrFail(id)
    return usuario.obtenerUsuario()
  }

  async obtenerUsuarioPorRol (rol: string): Promise<Usuario[]> {
    const usuarios: any[] = []
    const usuariosDB = await TblUsuarios.query().where('usn_rol_id', rol).orderBy('id', 'desc')
    usuariosDB.forEach(usuarioDB => {

      /* usuarios.push(usuariosDB.obtenerUsuario()) */
      usuarios.push({
        id: usuarioDB.id,
        nombre: usuarioDB.nombre,
        identificacion: usuarioDB.identificacion
      })
    })
    return usuarios
  }

  async obtenerUsuarioPorUsuario (nombreUsuario: string): Promise<Usuario | null>{
    const usuario = await TblUsuarios.query().where('usuario', '=', nombreUsuario).first()
    if(usuario){
      return usuario.obtenerUsuario()
    }
    return null
  }

  async guardarUsuario (usuario: Usuario): Promise<Usuario> {
    const usuarioExiste = await TblUsuarios.query().where('identificacion', usuario.identificacion).first();
    if(usuarioExiste){
      return usuarioExiste
      }
    let usuarioDB = new TblUsuarios()
    usuarioDB.establecerUsuarioDb(usuario)
    await usuarioDB.save()
    return usuarioDB
  }

  async actualizarUsuario (id: string, usuario: Usuario, payload?:PayloadJWT): Promise<Usuario> {
    let usuarioRetorno = await TblUsuarios.findOrFail(id)
    usuarioRetorno.estableceUsuarioConId(usuario)
    await usuarioRetorno.save()
    

    return usuarioRetorno
  }



}
