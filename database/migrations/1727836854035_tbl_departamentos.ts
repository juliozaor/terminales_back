import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_departamentos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tdp_id')
      table.string('tdp_codigo_departamento').unique()
      table.string('tdp_nombre')
      table.timestamp('tdp_creacion', { useTz: true })
      table.timestamp('tdp_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
