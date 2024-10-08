import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_horarios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('hrs_id')
      table.integer('hrs_dia_id').references('tds_id').inTable('tbl_dias')
      table.integer('hrs_codigo_ruta', 6).references('trt_id').inTable('tbl_rutas')
      table.dateTime('hrs_hora_salida')
      table.boolean('hrs_estado').defaultTo(true)
      table.timestamp('hrs_creacion', { useTz: true })
      table.timestamp('hrs_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
