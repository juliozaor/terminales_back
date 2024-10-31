import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_solicitudes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('sol_id')
      table.integer('sol_vigilado_id')
      table.string('sol_verificador_id')
      table.integer('sol_estado_vigilado')
      table.timestamp('sol_fecha_eviost')
      table.integer('sol_estado_veri')
      table.timestamp('sol_fecha_eviost_veri')
      table.string('sol_asignador_id')
      table.timestamp('sol_fecha_asignacion')
      table.boolean('sol_asignada').defaultTo(false)
      table.timestamp('sol_creacion', { useTz: true })
      table.timestamp('sol_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
