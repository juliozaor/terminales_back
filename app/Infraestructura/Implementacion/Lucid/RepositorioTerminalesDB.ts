import { Paginador } from '../../../Dominio/Paginador';
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB';
import { RepositorioTerminales } from 'App/Dominio/Repositorios/RepositorioTerminales';
import { RespuestaRutas } from '../../../Dominio/Dto/RespuestaRutas';
import TblRutaEmpresas from 'App/Infraestructura/Datos/Entidad/RutaEmpresa';
import Database from '@ioc:Adonis/Lucid/Database';
import { RespuestaParadas } from 'App/Dominio/Dto/RespuestaParadas';
import { RespuestaClases } from 'App/Dominio/Dto/RespuestaClases';

export class RepositorioTerminalesDB implements RepositorioTerminales {

  async visualizarRutas(param: any, id: number): Promise<{ rutas: RespuestaRutas[], paginacion: Paginador }> {
    const { pagina, limite } = param
    try {

      const totalCountQuery = `SELECT COUNT(*) as total
      FROM tbl_ruta_empresas tre
      LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
      LEFT JOIN tbl_rutas tr ON tr.trt_codigo_ruta = trcr.rcr_codigo_ruta
      LEFT JOIN tbl_centro_poblados tcp ON tcp.tcp_codigo_centro_poblado = tr.trt_codigo_cp_origen
      LEFT JOIN tbl_centro_poblados tcpd ON tcpd.tcp_codigo_centro_poblado = tr.trt_codigo_cp_destino
      LEFT JOIN tbl_municipios tm ON tcp.tcp_codigo_municipio = tm.tms_codigo_municipio
      LEFT JOIN tbl_municipios tmd ON tcpd.tcp_codigo_municipio = tmd.tms_codigo_municipio
      LEFT JOIN tbl_departamentos td ON tm.tms_departamento_codigo = td.tdp_codigo_departamento
      LEFT JOIN tbl_departamentos tdd ON tmd.tms_departamento_codigo = tdd.tdp_codigo_departamento
      LEFT JOIN tbl_nodos_despachos tnd ON tnd.tnd_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      LEFT JOIN tbl_nodos tn ON tn.tnd_id = tnd.tnd_codigo_nodo
      LEFT JOIN tbl_tipo_despachos ttd ON ttd.ttd_id = tn.tnd_despacho_id
      LEFT JOIN tbl_ruta_empresa_vias trev ON trev.rev_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      LEFT JOIN tbl_ruta_habilitadas trh ON trh.trh_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      WHERE tre.tre_id_usuario = ${id}`;

      const totalCountResult = await Database.rawQuery(totalCountQuery);
      const totalRecords = totalCountResult.rows[0].total;


      const consulta = await Database.rawQuery(`SELECT
      tre.tre_codigo_unico_ruta as id_ruta,
      td.tdp_nombre as departamento_origen,
      td.tdp_codigo_departamento as departamento_origen_codigo,
      tm.tms_nombre as municipio_origen,
      tm.tms_codigo_municipio as municipio_origen_codigo,
      tcp.tcp_nombre as cp_origen,
      tr.trt_codigo_cp_origen as cp_origen_codigo,
      tdd.tdp_nombre as departamento_destino,
      tdd.tdp_codigo_departamento as departamento_destino_codigo,
      tmd.tms_nombre as municipio_destino,
      tmd.tms_codigo_municipio as municipio_destino_codigo,
      tcpd.tcp_nombre as cp_destino,
      tr.trt_codigo_cp_destino as cp_destino_codigo,
      ttd.ttd_descripcion as tipo_llegada,
      ttd.ttd_id as tipo_llegada_id,
      tn.tnd_descripcion as direccion,
      tn.tnd_id as direccion_id,
      trev.rev_via as via,
      tr.trt_estado as estado,
      trh.trh_resolucion as resolucion,
      trh.corresponde as corresponde,
      trh.trh_resolucion_actual as resolucion_actual,
      trh.trh_direccion_territorial as direccion_territorial,
      trh.trh_documento as documento,
      trh.trh_nombre_original as nombre_original,
      trh.trh_ruta_archivo as ruta_archivo
      FROM
        tbl_ruta_empresas tre
      LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
      LEFT JOIN tbl_rutas tr ON tr.trt_codigo_ruta = trcr.rcr_codigo_ruta
      LEFT JOIN tbl_centro_poblados tcp ON tcp.tcp_codigo_centro_poblado = tr.trt_codigo_cp_origen
      LEFT JOIN tbl_centro_poblados tcpd ON tcpd.tcp_codigo_centro_poblado = tr.trt_codigo_cp_destino
      LEFT JOIN tbl_municipios tm ON tcp.tcp_codigo_municipio = tm.tms_codigo_municipio
      LEFT JOIN tbl_municipios tmd ON tcpd.tcp_codigo_municipio = tmd.tms_codigo_municipio
      LEFT JOIN tbl_departamentos td ON tm.tms_departamento_codigo = td.tdp_codigo_departamento
      LEFT JOIN tbl_departamentos tdd ON tmd.tms_departamento_codigo = tdd.tdp_codigo_departamento
      LEFT JOIN tbl_nodos_despachos tnd ON tnd.tnd_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      LEFT JOIN tbl_nodos tn ON tn.tnd_id = tnd.tnd_codigo_nodo
      LEFT JOIN tbl_tipo_despachos ttd ON ttd.ttd_id = tn.tnd_despacho_id
      LEFT JOIN tbl_ruta_empresa_vias trev ON trev.rev_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      LEFT JOIN tbl_ruta_habilitadas trh ON trh.trh_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      WHERE tre.tre_id_usuario = ${id}
      LIMIT ${limite} OFFSET ${(pagina - 1) * limite}`);

      const rutas: RespuestaRutas[] = consulta.rows ?? [];


      const totalPages = Math.ceil(totalRecords / limite);
      const paginacion = {
        totalRegistros: totalRecords,
        paginaActual: pagina,
        totalPaginas: totalPages,
      };

      return { rutas, paginacion };
    } catch (error) {
      throw new Error(error);
    }
  }

  async numeroTotalRutasPorUsuario(id: number) {
    try {
      const totalCountQuery = `SELECT COUNT(*) as total
      FROM tbl_ruta_empresas tre
      LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
      LEFT JOIN tbl_rutas tr ON tr.trt_codigo_ruta = trcr.rcr_codigo_ruta
      LEFT JOIN tbl_centro_poblados tcp ON tcp.tcp_codigo_centro_poblado = tr.trt_codigo_cp_origen
      LEFT JOIN tbl_centro_poblados tcpd ON tcpd.tcp_codigo_centro_poblado = tr.trt_codigo_cp_destino
      LEFT JOIN tbl_municipios tm ON tcp.tcp_codigo_municipio = tm.tms_codigo_municipio
      LEFT JOIN tbl_municipios tmd ON tcpd.tcp_codigo_municipio = tmd.tms_codigo_municipio
      LEFT JOIN tbl_departamentos td ON tm.tms_departamento_codigo = td.tdp_codigo_departamento
      LEFT JOIN tbl_departamentos tdd ON tmd.tms_departamento_codigo = tdd.tdp_codigo_departamento
      LEFT JOIN tbl_nodos_despachos tnd ON tnd.tnd_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      LEFT JOIN tbl_nodos tn ON tn.tnd_id = tnd.tnd_codigo_nodo
      LEFT JOIN tbl_tipo_despachos ttd ON ttd.ttd_id = tn.tnd_despacho_id
      LEFT JOIN tbl_ruta_empresa_vias trev ON trev.rev_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      LEFT JOIN tbl_ruta_habilitadas trh ON trh.trh_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      WHERE tre.tre_id_usuario = ${id}`;

      const totalCountResult = await Database.rawQuery(totalCountQuery);
      const totalRecords = totalCountResult.rows[0].total;
      return { TotalRegistros: totalRecords };

    } catch (error) {
      return { message: 'No se pudieron obtener las rutas de ese usuario' };
    }
  }


  async visualizarParadasPorRuta(param: any, id: number): Promise<{ paradas: RespuestaParadas[], paginacion: Paginador }> {
    const { pagina, limite, rutaId } = param
    try {

      const totalCountQuery = `SELECT COUNT(*) as total
      FROM tbl_ruta_empresas tre
      LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
      left join tbl_nodos_despachos tnd on tnd.tnd_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      left join tbl_paradas tp on tp.tps_id = tnd_paradas_id
      left join tbl_centro_poblados tcp on tcp.tcp_codigo_centro_poblado = tp.tps_codigo_cp
      left join tbl_municipios tm on tm.tms_codigo_municipio = tcp.tcp_codigo_municipio
      left join tbl_departamentos td on td.tdp_codigo_departamento = tm.tms_departamento_codigo
      left join tbl_nodos tn on tn.tnd_id = tp.tps_nodo_id
      WHERE tre.tre_id_usuario = ${id} and tre.tre_codigo_unico_ruta = ${rutaId}`;

      const totalCountResult = await Database.rawQuery(totalCountQuery);
      const totalRecords = totalCountResult.rows[0].total;


      const consulta = await Database.rawQuery(`SELECT
		tp.tps_id as parada_id,
		td.tdp_codigo_departamento as codigo_departamento,
		tm.tms_codigo_municipio as codigo_municipio,
		tp.tps_codigo_cp as codigo_cp,
		tn.tnd_despacho_id as tipo_llegada_id,
		tn.tnd_id as direccion_id
      FROM
      tbl_ruta_empresas tre
    LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
    left join tbl_nodos_despachos tnd on tnd.tnd_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
    left join tbl_paradas tp on tp.tps_id = tnd_paradas_id
    left join tbl_centro_poblados tcp on tcp.tcp_codigo_centro_poblado = tp.tps_codigo_cp
    left join tbl_municipios tm on tm.tms_codigo_municipio = tcp.tcp_codigo_municipio
    left join tbl_departamentos td on td.tdp_codigo_departamento = tm.tms_departamento_codigo
    left join tbl_nodos tn on tn.tnd_id = tp.tps_nodo_id
    WHERE tre.tre_id_usuario = ${id} and tre.tre_codigo_unico_ruta = ${rutaId}
      LIMIT ${limite} OFFSET ${(pagina - 1) * limite}`);

      const paradas: RespuestaParadas[] = consulta.rows ?? [];


      const totalPages = Math.ceil(totalRecords / limite);
      const paginacion = {
        totalRegistros: totalRecords,
        paginaActual: pagina,
        totalPaginas: totalPages,
      };

      return { paradas, paginacion };
    } catch (error) {
      throw new Error(error);
    }
  }


  async visualizarClasesPorRuta(param: any, id: number): Promise<{ clases: RespuestaClases[], paginacion: Paginador }> {
    const { pagina, limite, rutaId } = param
    try {

      const totalCountQuery = `SELECT COUNT(*) as total
      FROM tbl_ruta_empresas tre
      LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
      left join tbl_ruta_vehiculos trv on trv.trv_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      left join tbl_clase_vehiculos tcv on tcv.tcv_id = trv.trv_clase_vehiculo_id
      left join tbl_codigo_clase_por_grupos tccpg on tccpg.cpg_id = tcv.tcv_clase_por_grupo_id
      WHERE tre.tre_id_usuario = ${id} and tre.tre_codigo_unico_ruta = ${rutaId}`;

      const totalCountResult = await Database.rawQuery(totalCountQuery);
      const totalRecords = totalCountResult.rows[0].total;


      const consulta = await Database.rawQuery(`SELECT
      tccpg.cpg_descripcion as clase,
      tcv.tcv_id as tipo_vehiculo_id,
      tcv.tcv_estado as estado
      FROM
        tbl_ruta_empresas tre
      LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
      left join tbl_ruta_vehiculos trv on trv.trv_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      left join tbl_clase_vehiculos tcv on tcv.tcv_id = trv.trv_clase_vehiculo_id
      left join tbl_codigo_clase_por_grupos tccpg on tccpg.cpg_id = tcv.tcv_clase_por_grupo_id
      WHERE tre.tre_id_usuario = ${id} and tre.tre_codigo_unico_ruta = ${rutaId}
      LIMIT ${limite} OFFSET ${(pagina - 1) * limite}`);

      const clases: RespuestaClases[] = consulta.rows ?? [];


      const totalPages = Math.ceil(totalRecords / limite);
      const paginacion = {
        totalRegistros: totalRecords,
        paginaActual: pagina,
        totalPaginas: totalPages,
      };

      return { clases, paginacion };
    } catch (error) {
      throw new Error(error);
    }
  }


  // async guardarRutas(param: any): Promise<{ rutas: RespuestaClases[] }> {
  //   try {

  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }



  // const query = await TblRutaEmpresas.query().preload('codigoUnicoRuta', sqlcodigo => {
  //   sqlcodigo.preload('ruta', sqlruta => {
  //     sqlruta.preload('cpOrigen').preload('cpDestino')
  //   })


  //   sqlcodigo.preload('nodosDespacho', sqlnodoDespacho => {
  //     sqlnodoDespacho.preload('nodos', sqlnodo => {
  //       sqlnodo.preload('tipoDespacho')
  //     })
  //   })


  //   sqlcodigo.preload('rutaVias')

  //   sqlcodigo.preload('rutasHabilitada')

  // }).where('idUsuario', id).first()

  // return query
}
