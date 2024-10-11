import { BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import TblNodos from './Nodos';

export default class TblNodosDespachos extends BaseModel {

  @column({ isPrimary: true, columnName: 'tnd_id' }) public id: number

  @column({ columnName: 'tnd_codigo_unico_ruta' }) public idRuta: number

  @column({ columnName: 'tnd_codigo_nodo' }) public idNodo: number

  @column({ columnName: 'tnd_paradas_id' }) public idParada: number

  @column({ columnName: 'tnd_estado' }) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'tnd_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'tnd_actualizacion' }) public updatedAt: DateTime

  @belongsTo (() => TblNodos, {
    localKey: 'id',
    foreignKey: 'idNodo',
  })
  public nodos: BelongsTo<typeof TblNodos>
}
