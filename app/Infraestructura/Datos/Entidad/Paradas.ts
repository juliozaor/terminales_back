import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblParadas extends BaseModel {

  @column({ isPrimary: true, columnName: 'tps_id' }) public id: number

  @column({ columnName: 'tps_codigo_cp' }) public codigoCp: number

  @column({ columnName: 'tps_nodo_id' }) public idNodo: number

  @column.dateTime({ autoCreate: true , columnName: 'tps_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'tps_actualizacion' }) public updatedAt: DateTime
}
