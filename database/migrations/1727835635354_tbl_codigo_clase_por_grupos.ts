import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_codigo_clase_por_grupos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('cpg_id')
      table.string('cpg_descripcion', 30)
      table.boolean('cpg_estado').defaultTo(true)
      table.timestamp('cpg_creacion', { useTz: true })
      table.timestamp('cpg_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
