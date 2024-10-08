import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_paradas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tps_id')
      table.string('tps_codigo_cp').references('tcp_codigo_centro_poblado').inTable('tbl_centro_poblados')
      table.integer('tps_nodo_id').references('tnd_id').inTable('tbl_nodos')
      table.timestamp('tps_creacion', { useTz: true })
      table.timestamp('tps_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
