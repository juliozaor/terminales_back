import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_auditor_rutas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('tar_id')
      table.integer('tar_usuario_id').references('usn_id').inTable('tbl_usuarios')
      table.integer('tar_ruta_id').references('trt_id').inTable('tbl_rutas')
      table.boolean('tar_habilitada')
      table.string('tar_observacion')
      table.timestamp('tar_creacion', { useTz: true })
      table.timestamp('tar_actualizacion', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
