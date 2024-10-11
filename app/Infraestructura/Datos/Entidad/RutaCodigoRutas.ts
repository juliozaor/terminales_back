import { BaseModel, column, hasMany, HasMany, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import TblRutas from './Rutas';
import TblNodosDespachos from './NodosDespachos';
import TblRutaEmpresaVias from './RutaEmpresaVia';
import TblRutaHabilitadas from './RutaHabilitadas';

export default class TblRutaCodigoRutas extends BaseModel {

  @column({ isPrimary: true, columnName: 'rcr_codigo_unico_ruta' }) public id: number

  @column({ columnName: 'rcr_codigo_ruta' }) public codigoRuta: number

  @column.dateTime({ autoCreate: true , columnName: 'rcr_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'rcr_actualizacion' }) public updatedAt: DateTime

  @hasMany (() => TblRutas, {
    localKey: 'codigoRuta',
    foreignKey: 'codigoRuta',
  })
  public ruta: HasMany<typeof TblRutas>

  @hasOne (() => TblNodosDespachos, {
    localKey: 'id',
    foreignKey: 'idRuta',
  })
  public nodosDespacho: HasOne<typeof TblNodosDespachos>

  @hasMany (() => TblRutaEmpresaVias, {
    localKey: 'id',
    foreignKey: 'codigoRuta',
  })
  public rutaVias: HasMany<typeof TblRutaEmpresaVias>

  @hasOne (() => TblRutaHabilitadas, {
    localKey: 'id',
    foreignKey: 'idRuta',
  })
  public rutasHabilitada: HasOne<typeof TblRutaHabilitadas>
}
