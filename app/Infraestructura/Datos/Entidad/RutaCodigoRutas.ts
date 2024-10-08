import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblRutaCodigoRutas extends BaseModel {

  @column({ isPrimary: true, columnName: 'rcr_id' }) public id: number

  @column({ columnName: 'rcr_codigo_ruta' }) public codigoRuta: number

  @column({ columnName: 'rcr_id_ruta' }) public idRuta: number

  @column.dateTime({ autoCreate: true , columnName: 'rcr_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'rcr_actualizacion' }) public updatedAt: DateTime
}
