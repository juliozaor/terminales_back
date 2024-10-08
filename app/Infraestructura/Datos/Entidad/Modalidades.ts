import { DateTime } from 'luxon';
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm';

export default class TblModalidades extends BaseModel {
  @column({ isPrimary: true, columnName: 'mod_id' })  public id: number  
  @column({ columnName: 'mod_nombre' }) public nombre: string
  @column({ columnName: 'mod_estado' }) public estado: boolean
}
