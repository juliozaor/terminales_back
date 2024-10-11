import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_habilitadas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('trh_id')
      table.integer('trh_codigo_unico_ruta').references('rcr_codigo_unico_ruta').inTable('tbl_ruta_codigo_rutas')
      table.string('trh_resolucion')
      table.string('trh_resolucion_actual')
      table.string('trh_fecha')
      table.string('trh_direccion_territorial')
      table.string('trh_documento')
      table.string('trh_nombre_original')
      table.string('trh_ruta_archivo')
      table.integer('corresponde', 1)
      table.timestamp('trh_creacion', { useTz: true })
      table.timestamp('trh_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
