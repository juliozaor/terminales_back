import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblRutaEmpresaVias extends BaseModel {

  @column({ isPrimary: true, columnName: 'rev_id' }) public id: number

  @column({ columnName: 'rev_id_ruta' }) public codigoRuta: number

  @column({ columnName: 'rev_codigo_via' }) public codigoVia: number

  @column({ columnName: 'rev_via' }) public via: string

  @column.dateTime({ autoCreate: true , columnName: 'rev_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'rev_actualizacion' }) public updatedAt: DateTime
}
