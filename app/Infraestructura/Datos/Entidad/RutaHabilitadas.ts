import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblRutasHabilitadas extends BaseModel {

  @column({ isPrimary: true, columnName: 'trh_id' }) public id: number

  @column({ columnName: 'trh_id_ruta' }) public idRuta: number

  @column({ columnName: 'trh_resolucion' }) public resolucion: string

  @column({ columnName: 'trh_resolucion_actual' }) public resolucionActual: string

  @column({ columnName: 'trh_fecha' }) public fecha: string

  @column({ columnName: 'trh_direccion_territorial' }) public direccionTerritorial: string

  @column({ columnName: 'trh_documento' }) public documento: string

  @column({ columnName: 'trh_nombre_original' }) public nombreOriginal: string

  @column({ columnName: 'trh_ruta_archivo' }) public rutaArchivo: string

  @column({ columnName: 'corresponde' }) public corresponde: number

  @column.dateTime({ autoCreate: true , columnName: 'trh_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'trh_actualizacion' }) public updatedAt: DateTime
}
