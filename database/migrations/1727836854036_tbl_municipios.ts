import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_municipios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tms_id')
      table.string('tms_departamento_codigo').references('tdp_codigo_departamento').inTable('tbl_departamentos')
      table.string('tms_codigo_municipio').unique()
      table.string('tms_nombre')
      table.timestamp('tms_creacion', { useTz: true })
      table.timestamp('tms_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
