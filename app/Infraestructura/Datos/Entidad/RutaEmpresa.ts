import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblRutaEmpresas extends BaseModel {

  @column({ isPrimary: true, columnName: 'tre_id' }) public id: number

  @column({ columnName: 'tre_id_usuario' }) public idUsuario: number

  @column({ columnName: 'tre_id_ruta' }) public idRuta: number

  @column({ columnName: 'tre_estado' }) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'tre_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'tre_actualizacion' }) public updatedAt: DateTime
}
