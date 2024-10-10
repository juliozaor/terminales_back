import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_empresa_vias'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('rev_id')
      table.integer('rev_codigo_unico_ruta').references('rcr_codigo_unico_ruta').inTable('tbl_ruta_codigo_rutas')
      table.string('rev_codigo_via')
      table.string('rev_via')
      table.timestamp('rev_creacion', { useTz: true })
      table.timestamp('rev_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
