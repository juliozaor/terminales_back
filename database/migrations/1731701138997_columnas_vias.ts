import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tbl_ruta_empresa_vias'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('rev_corresponde', 1)
      table.string('rev_nueva_via')
  })
}

public async down () {
  this.schema.alterTable(this.tableName, (table) => {
    table.dropColumn('rev_Corresponde')
    table.dropColumn('rev_nueva_via')
})
}
}
