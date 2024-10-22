import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_rutas_direcciones'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('trd_id')
      table.integer('trd_id_ruta').references('trt_id').inTable('tbl_rutas')
      table.integer('trd_id_nodo').references('tnd_id').inTable('tbl_nodos')
      table.timestamp('trd_creacion', { useTz: true })
      table.timestamp('trd_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
