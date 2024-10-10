import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_vehiculos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('trv_id')
      table.integer('trv_codigo_unico_ruta').references('rcr_codigo_unico_ruta').inTable('tbl_ruta_codigo_rutas')
      table.integer('trv_clase_vehiculo_id').references('tcv_id').inTable('tbl_clase_vehiculos')
      table.boolean('trv_estado').defaultTo(true)
      table.timestamp('trv_creacion', { useTz: true })
      table.timestamp('trv_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
