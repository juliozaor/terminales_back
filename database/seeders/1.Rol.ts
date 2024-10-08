import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { v4 as uuid } from "uuid"
import TblRoles from 'App/Infraestructura/Datos/Entidad/Autorizacion/Rol'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    await TblRoles.createMany([
      {
        id: '001',
        nombre: 'super',
        estado: true,
        actualizacion: DateTime.now(),
        creacion: DateTime.now(),
      },
      {
        id: '002',
        nombre: 'administrador',
        estado: true,
        actualizacion: DateTime.now(),
        creacion: DateTime.now(),
      },
      {
        id: '003',
        nombre: 'vigilado',
        estado: true,
        actualizacion: DateTime.now(),
        creacion: DateTime.now(),
      },

    ])
  }
}
