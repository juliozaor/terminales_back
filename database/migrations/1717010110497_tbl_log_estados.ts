import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_log_estados'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tle_id')
      table.integer('tle_vigilado_id').references('usn_id').inTable('tbl_usuarios')
      table.integer('tle_estado_id').references('est_id').inTable('tbl_estados')
      table.timestamp('tle_creacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
