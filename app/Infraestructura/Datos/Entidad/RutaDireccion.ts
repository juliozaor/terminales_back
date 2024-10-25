import { BaseModel, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import TblRutas from './Rutas';
import TblNodos from './Nodos';
import { RutaDireccion } from 'App/Dominio/Datos/Entidades/RutaDireccion';
import TblRutaCodigoRutas from './RutaCodigoRutas';

export default class TblRutasDirecciones extends BaseModel {

  @column({ isPrimary: true, columnName: 'trd_id' }) public id: number

  @column({ columnName: 'trd_id_ruta' }) public idRuta: number

  @column({ columnName: 'trd_id_nodo' }) public idNodo: number

  @column.dateTime({ autoCreate: true , columnName: 'trd_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'trd_actualizacion' }) public updatedAt: DateTime

  public establecerRutaDireccion(rutaDireccion: RutaDireccion) {
    this.idRuta = rutaDireccion.idRuta!
    this.idNodo = rutaDireccion.idNodo!
  }

  public establecerRutaDireccionConid(rutaDireccion: RutaDireccion) {
    this.idRuta = rutaDireccion.idRuta!
    this.idNodo = rutaDireccion.idNodo!
  }

  @hasOne (() => TblRutaCodigoRutas, {
    localKey: 'idRuta',
    foreignKey: 'id',
  })
  public idRutas: HasOne<typeof TblRutaCodigoRutas>

  @hasOne (() => TblNodos, {
    localKey: 'idNodo',
    foreignKey: 'id',
  })
  public idNodos: HasOne<typeof TblNodos>
}
