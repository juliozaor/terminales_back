import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_empresa_vias'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('rev_id')
      table.integer('rev_id_ruta').references('trt_id').inTable('tbl_rutas')
      table.integer('rev_codigo_via', 8)
      table.string('rev_via')
      table.timestamp('rev_creacion', { useTz: true })
      table.timestamp('rev_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
