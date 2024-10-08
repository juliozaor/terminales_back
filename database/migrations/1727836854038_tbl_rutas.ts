import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_rutas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('trt_id')
      table.integer('trt_codigo_ruta', 6)
      table.string('trt_codigo_cp_origen').references('tcp_codigo_centro_poblado').inTable('tbl_centro_poblados')
      table.string('trt_codigo_cp_destino').references('tcp_codigo_centro_poblado').inTable('tbl_centro_poblados')
      table.string('trt_ida_vuelta', 1)
      table.integer('trt_directo',1)
      table.boolean('trt_estado').defaultTo(true)
      table.timestamp('trt_creacion', { useTz: true })
      table.timestamp('trt_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
