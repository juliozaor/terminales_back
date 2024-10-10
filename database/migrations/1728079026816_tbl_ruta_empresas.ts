import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_empresas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tre_id')
      table.integer('tre_id_usuario').references('usn_id').inTable('tbl_usuarios')
      table.integer('tre_codigo_unico_ruta').references('rcr_codigo_unico_ruta').inTable('tbl_ruta_codigo_rutas')
      table.boolean('tre_estado').defaultTo(true)
      table.timestamp('tre_creacion', { useTz: true })
      table.timestamp('tre_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
