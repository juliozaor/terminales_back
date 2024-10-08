import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class TblMunicipios extends BaseModel {

  @column({ isPrimary: true, columnName: 'tms_id' }) public id: number

  @column({ columnName: 'tms_departamento_codigo' }) public codigoDepartamento: number

  @column({ columnName: 'tms_codigo_municipio' }) public codigoMunicipio: number

  @column({ columnName: 'tms_nombre' }) public nombre: string

  @column.dateTime({ autoCreate: true , columnName: 'tms_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'tms_actualizacion' }) public updatedAt: DateTime
}
