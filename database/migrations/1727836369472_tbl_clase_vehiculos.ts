import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_clase_vehiculos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tcv_id')
      table.string('tcv_descripcion', 30)
      table.integer('tcv_clase_por_grupo_id').references('cpg_id').inTable('tbl_codigo_clase_por_grupos')
      table.boolean('tcv_estado').defaultTo(true)
      table.timestamp('tcv_creacion', { useTz: true })
      table.timestamp('tcv_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
