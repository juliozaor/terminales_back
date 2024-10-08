import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_habilitadas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('trh_id')
      table.integer('trh_id_ruta').references('trt_id').inTable('tbl_rutas')
      table.string('trh_resolucion')
      table.string('trh_resolucion_actual')
      table.dateTime('trh_fecha')
      table.string('trh_direccion_territorial')
      table.string('trh_documento')
      table.string('trh_nombre_original')
      table.string('trh_ruta_archivo')
      table.integer('corresponde', 1).defaultTo(1)
      table.timestamp('trh_creacion', { useTz: true })
      table.timestamp('trh_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
