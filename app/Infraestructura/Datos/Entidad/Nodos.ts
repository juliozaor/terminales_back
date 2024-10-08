import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblNodos extends BaseModel {

  @column({ isPrimary: true, columnName: 'tnd_id' }) public id: number

  @column({ columnName: 'tnd_despacho_id' }) public idDespacho: number

  @column({ columnName: 'tnd_descripcion' }) public descripcion: string

  @column({ columnName: 'tnd_direccion' }) public direccion: string

  @column({ columnName: 'tnd_codigo_cp' }) public codigoCp: number

  @column({ columnName: 'tnd_estado' }) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'tnd_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'tnd_actualizacion' }) public updatedAt: DateTime
}
