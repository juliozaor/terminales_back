import { BaseModel, belongsTo, BelongsTo, column} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import TblCentroPoblados from './CentroPoblado';
import { Ruta } from 'App/Dominio/Datos/Entidades/Ruta';

export default class TblRutas extends BaseModel {

  @column({ isPrimary: true, columnName: 'trt_id' }) public id: number

  @column({ columnName: 'trt_codigo_ruta' }) public codigoRuta: number

  @column({ columnName: 'trt_codigo_cp_origen' }) public codigoCpOrigen: string

  @column({ columnName: 'trt_codigo_cp_destino' }) public codigoCpDestino: string

  @column({ columnName: 'trt_ida_vuelta' }) public idaaVuelta: string

  @column({ columnName: 'trt_directo' }) public directo: number

  @column({ columnName: 'trt_estado' }) public estado: boolean

  @column.dateTime({ autoCreate: true , columnName: 'trt_creacion'}) public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'trt_actualizacion' }) public updatedAt: DateTime

  public establecerRuta(ruta: Ruta) {
    this.codigoRuta = ruta.codigoRuta!
    this.codigoCpOrigen = ruta.codigoCpOrigen!
    this.codigoCpDestino = ruta.codigoCpDestino!
    this.idaaVuelta = ruta.idaaVuelta!
    this.directo = ruta.directo!
    this.estado = ruta.estado!
  }

  @belongsTo (() => TblCentroPoblados, {
    localKey: 'codigoCentroPoblado',
    foreignKey: 'codigoCpOrigen',
  })
  public cpOrigen: BelongsTo<typeof TblCentroPoblados>

  @belongsTo (() => TblCentroPoblados, {
    localKey: 'codigoCentroPoblado',
    foreignKey: 'codigoCpDestino',
  })
  public cpDestino: BelongsTo<typeof TblCentroPoblados>
}


