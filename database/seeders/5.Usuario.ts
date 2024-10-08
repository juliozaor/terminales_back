import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { DateTime } from 'luxon'
import TblUsuarios from 'App/Infraestructura/Datos/Entidad/Usuario'
import { ROLES } from 'App/Dominio/DiccionarioAutorizacion'
import { v4 } from 'uuid'


export default class extends BaseSeeder {
  public async run () {
    await TblUsuarios.createMany([
        {
            nombre: 'Super administrador',
            clave: '$bcrypt$v=98$r=10$SVkH7OC3YnSS6r5n+/L+9w$V9CKtEmH282nBDPHb8fa43laPN/dojE',//Super23+
            correo: 'ingnovaott@gmail.com',
            fechaNacimiento: DateTime.now(),
            identificacion: '11111111',
            idRol: ROLES.SUPER,
            usuario: '11111111',
            id: v4() 
        }
    ])
  }
}
