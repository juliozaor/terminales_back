import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_nodos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tnd_id')
      table.integer('tnd_despacho_id').references('ttd_id').inTable('tbl_tipo_despachos')
      table.string('tnd_descripcion', 500)
      table.string('tnd_direccion', 500)
      table.string('tnd_codigo_cp').references('tcp_codigo_centro_poblado').inTable('tbl_centro_poblados')
      table.boolean('tnd_estado').defaultTo(true)
      table.timestamp('tnd_creacion', { useTz: true })
      table.timestamp('tnd_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
