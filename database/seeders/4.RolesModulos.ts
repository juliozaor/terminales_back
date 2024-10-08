import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { v4 as uuid } from "uuid"
import {  MODULOS, ROLES } from 'App/Dominio/DiccionarioAutorizacion'
import Database from '@ioc:Adonis/Lucid/Database'


export default class extends BaseSeeder {
  public async run () {
    await Database
    .table('tbl_roles_modulos')
    .multiInsert([
        {
          rom_id: uuid(),
          rom_rol_id: ROLES.SUPER,
          rom_modulo_id: MODULOS.USUARIO,
        },{
          rom_id: uuid(),
          rom_rol_id: ROLES.SUPER,
          rom_modulo_id: MODULOS.POLIZAS,
        },
    ])
  }
}
