import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_tipo_despachos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('ttd_id')
      table.string('ttd_descripcion', 30)
      table.boolean('ttd_estado').defaultTo(true)
      table.timestamp('ttd_creacion', { useTz: true })
      table.timestamp('ttd_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
