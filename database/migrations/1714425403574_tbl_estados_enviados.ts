import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_estados_enviados'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('env_id')
      table.bigInteger('env_estado').references('est_id').inTable('tbl_estados')
      table.integer('env_vigilado_id').references('usn_id').inTable('tbl_usuarios')
      table.timestamp('env_creado', { useTz: true })
      table.timestamp('env_actualizado', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
