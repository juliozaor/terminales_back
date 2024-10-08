import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_nodos_despachos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tnd_id')
      table.integer('tnd_id_ruta').references('trt_id').inTable('tbl_rutas')
      table.integer('tnd_codigo_nodo').references('tnd_id').inTable('tbl_nodos')
      table.integer('tnd_paradas_id').references('tps_id').inTable('tbl_paradas')
      table.boolean('tnd_estado').defaultTo(true)
      table.timestamp('tnd_creacion', { useTz: true })
      table.timestamp('tnd_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
