import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_dias'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tds_id')
      table.string('tds_descripcion', 30)
      table.boolean('tds_estado').defaultTo(true)
      table.timestamp('tds_creacion', { useTz: true })
      table.timestamp('tds_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
