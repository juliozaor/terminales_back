import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TblModulos from 'App/Infraestructura/Datos/Entidad/Autorizacion/Modulo'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run () {
    await TblModulos.createMany([
      {
        id: '001',
        nombre: 'usuarios',
        nombreMostrar: 'Crear usuarios',
        ruta:'/crear-usuarios',
        estado: true,
        actualizacion: DateTime.now(),
        creacion: DateTime.now(),
      },
      {
        id: '002',
        nombre: 'polizas',
        nombreMostrar: 'Administrar polizas',
        ruta:'/administrar-poliza',
        estado: true,
        actualizacion: DateTime.now(),
        creacion: DateTime.now(),
      }

    ])
  }
}
