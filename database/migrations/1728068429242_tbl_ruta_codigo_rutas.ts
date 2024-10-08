import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_codigo_rutas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('rcr_id')
      table.integer('rcr_codigo_ruta')
      table.integer('rcr_id_ruta')
      table.timestamp('rcr_creacion', { useTz: true })
      table.timestamp('rcr_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
