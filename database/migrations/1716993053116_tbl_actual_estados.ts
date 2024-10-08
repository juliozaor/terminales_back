import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_actual_estados'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tae_id')
      table.integer('tae_vigilado_id').references('usn_id').inTable('tbl_usuarios')
      table.integer('tae_estado_id').references('est_id').inTable('tbl_estados')
      table.timestamp('tae_creacion', { useTz: true })
      table.timestamp('tae_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
