import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_centro_poblados'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tcp_id')
      table.string('tcp_codigo_centro_poblado').unique()
      table.string('tcp_nombre')
      table.string('tcp_codigo_municipio').references('tms_codigo_municipio').inTable('tbl_municipios')
      table.timestamp('tcp_creacion', { useTz: true })
      table.timestamp('tcp_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
