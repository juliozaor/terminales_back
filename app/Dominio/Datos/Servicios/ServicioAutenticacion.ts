/* eslint-disable max-len */
import { GeneradorContrasena } from 'App/Dominio/GenerarContrasena/GenerarContrasena'
import { ServicioUsuarios } from './ServicioUsuarios'
import { ServicioAutenticacionJWT } from 'App/Dominio/Datos/Servicios/ServicioJWT'
import { Exception } from '@adonisjs/core/build/standalone'
import { RespuestaInicioSesion } from 'App/Dominio/Dto/RespuestaInicioSesion'
import { Usuario } from '../Entidades/Usuario'
import { Encriptador } from 'App/Dominio/Encriptacion/Encriptador'
import { RepositorioBloqueoUsuario } from 'App/Dominio/Repositorios/RepositorioBloqueoUsuario'
import { RegistroBloqueo } from '../Entidades/Usuarios/RegistroBloqueo'
import { v4 as uuid } from 'uuid'
import { RepositorioAutorizacion } from 'App/Dominio/Repositorios/RepositorioAutorizacion'
import { RepositorioUsuario } from 'App/Dominio/Repositorios/RepositorioUsuario'
import { EnviadorEmail } from 'App/Dominio/Email/EnviadorEmail'
import { RolDto } from 'App/Presentacion/Autenticacion/Dtos/RolDto'
import Env from '@ioc:Adonis/Core/Env';

export class ServicioAutenticacion {
  private servicioUsuario: ServicioUsuarios

  constructor(
    private encriptador: Encriptador,
    private enviadorEmail: EnviadorEmail,
    private repositorioBloqueo: RepositorioBloqueoUsuario,
    private repositorioAutorizacion: RepositorioAutorizacion,
    private repositorioUsuario: RepositorioUsuario,
  ) {
    this.servicioUsuario = new ServicioUsuarios(
      this.repositorioUsuario,
      new GeneradorContrasena(),
      this.encriptador,
      this.enviadorEmail
    )
  }

  public async cambiarClave(identificacion: string, clave: string, nuevaClave: string) {
    const usuario = await this.verificarUsuario(identificacion)
    if (usuario instanceof Usuario) {
      if (!(await this.encriptador.comparar(clave, usuario.clave))) {
        throw new Exception('Credenciales incorrectas, por favor intente recuperar contraseña con su correo registrado en Vigia', 400)
      }
      usuario.clave = nuevaClave
      usuario.claveTemporal = false;
      this.servicioUsuario.actualizarUsuario(usuario.id, usuario)
      return;
    }
    throw new Exception('Credenciales incorrectas, por favor intente recuperar contraseña con su correo registrado en Vigia', 400)
  }

  public async iniciarSesion(usuario: string, contrasena: string): Promise<RespuestaInicioSesion> {
    const usuarioVerificado = await this.verificarUsuario(usuario)
    
    let registroDeBloqueo: any
    if (Env.get("VIGIA") != 1) {
    registroDeBloqueo = await this.repositorioBloqueo.obtenerRegistroPorUsuario(usuarioVerificado.identificacion)
    if (!registroDeBloqueo) {
      registroDeBloqueo = await this.crearRegistroDeBloqueo(usuarioVerificado.identificacion)
    }
    if (registroDeBloqueo.elUsuarioEstaBloqueado()) {
      throw new Exception('El usuario se encuentra bloqueado por exceder el número de intentos de inicio de sesión, intente recuperar contraseña', 423)
    }
    if (!usuarioVerificado) {
      this.manejarIntentoFallido(registroDeBloqueo)
      throw new Exception('Credenciales incorrectas, por favor intente recuperar contraseña con su correo registrado en Vigia', 400)
    }
  }


    let isAuthenticated = false;
    try {
      if (Env.get("VIGIA") == 1) {
          isAuthenticated = true;
      } else if ((await this.encriptador.comparar(contrasena, usuarioVerificado.clave))) {
        isAuthenticated = true;
      }
    } catch (error) {      
      throw new Exception(error.lde_message, 400);
    }

    if (!isAuthenticated) {
      throw new Exception("Credenciales incorrectas", 400);
    }



    if (Env.get("VIGIA") != 1) {
       if (!await this.encriptador.comparar(contrasena, usuarioVerificado.clave)) {
         this.manejarIntentoFallido(registroDeBloqueo)
         throw new Exception('Credenciales incorrectas, por favor intente recuperar contraseña con su correo registrado en Vigia', 400)
        }
      }

  /*   if (!await this.encriptador.comparar(contrasena, usuarioVerificado.clave)) {
      this.manejarIntentoFallido(registroDeBloqueo)
      throw new Exception('Credenciales incorrectas, por favor intente recuperar contraseña con su correo registrado en Vigia', 400)
    } */

    const rolUsuario = await this.repositorioAutorizacion.obtenerRolConModulosYPermisos(usuarioVerificado.idRol)
    const token = ServicioAutenticacionJWT.generarToken({
      documento: usuarioVerificado.identificacion,
      idRol: usuarioVerificado.idRol,
      id: usuarioVerificado.id
    })



    return new RespuestaInicioSesion(
      {
        id: usuarioVerificado.id,
        usuario: usuarioVerificado.identificacion,
        nombre: usuarioVerificado.nombre,
        apellido: usuarioVerificado.apellido,
        telefono: usuarioVerificado.telefono,
        correo: usuarioVerificado.correo
      },
      token,
      new RolDto(rolUsuario),
      usuarioVerificado.claveTemporal)
  }

  public async verificarUsuario(usuario: string): Promise<Usuario> {
    const usuarioDB = await this.servicioUsuario.obtenerUsuarioPorUsuario(usuario)
    if (!usuarioDB) {
      throw new Exception('Credenciales incorrectas, por favor intente recuperar contraseña con su correo registrado en Vigia', 400)
    }
    return usuarioDB
  }

  private async crearRegistroDeBloqueo(identificacion: string): Promise<RegistroBloqueo> {
    const registro = new RegistroBloqueo(uuid(), identificacion, 0, false)
    return await this.repositorioBloqueo.crearRegistro(registro)
  }

  private async manejarIntentoFallido(registro: RegistroBloqueo): Promise<RegistroBloqueo> {
    registro.agregarIntentoFallido()
    return await this.repositorioBloqueo.actualizarRegistro(registro)
  }


}
