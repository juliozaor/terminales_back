import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblRutaVehiculos extends BaseModel {

  @column({ isPrimary: true, columnName: 'trv_id' }) public id: number

  @column({ columnName: 'tvr_id_ruta' }) public idRuta: number

  @column({ columnName: 'tvr_clase_vehiculo_id' }) public idClaseVehiculo: number

  @column({ columnName: 'trv_estado' }) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'trv_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'trv_actualizacion' }) public updatedAt: DateTime
}
