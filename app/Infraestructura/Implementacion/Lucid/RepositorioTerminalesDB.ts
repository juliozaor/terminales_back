import { Paginador } from "../../../Dominio/Paginador";
import { MapeadorPaginacionDB } from "./MapeadorPaginacionDB";
import { RepositorioTerminales } from "App/Dominio/Repositorios/RepositorioTerminales";
import { RespuestaRutas } from "../../../Dominio/Dto/RespuestaRutas";
import TblRutaEmpresas from "App/Infraestructura/Datos/Entidad/RutaEmpresa";
import Database from "@ioc:Adonis/Lucid/Database";
import { RespuestaParadas } from "App/Dominio/Dto/RespuestaParadas";
import { RespuestaClases } from "App/Dominio/Dto/RespuestaClases";
import { Nodo } from "App/Dominio/Datos/Entidades/Nodo";
import TblNodos from "App/Infraestructura/Datos/Entidad/Nodos";
import { log } from "console";
import TblRutaCodigoRutas from "App/Infraestructura/Datos/Entidad/RutaCodigoRutas";
import TblRutas from "App/Infraestructura/Datos/Entidad/Rutas";
import { RutaCodigoRuta } from "App/Dominio/Datos/Entidades/RutaCodigoRuta";
import { RutaEmpresa } from "App/Dominio/Datos/Entidades/RutaEmpresa";
import { Ruta } from "App/Dominio/Datos/Entidades/Ruta";
import TblRutaEmpresaVias from "App/Infraestructura/Datos/Entidad/RutaEmpresaVia";
import { RutaEmpresaVia } from "App/Dominio/Datos/Entidades/RutaEmpresaVia";
import TblRutaHabilitadas from "App/Infraestructura/Datos/Entidad/RutaHabilitadas";
import { RutaHabilitada } from "App/Dominio/Datos/Entidades/RutaHabilitada";
import { RutaDireccion } from "App/Dominio/Datos/Entidades/RutaDireccion";
import TblRutasDirecciones from "App/Infraestructura/Datos/Entidad/RutaDireccion";

export class RepositorioTerminalesDB implements RepositorioTerminales {
  async visualizarRutas(
    param: any,
    id: number
  ): Promise<{ rutas: RespuestaRutas[]; paginacion: Paginador }> {
    const { pagina, limite } = param;
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
        LEFT JOIN tbl_rutas_direcciones trd ON trd.trd_id_ruta  = tr.trt_id
        LEFT JOIN tbl_nodos tn ON tn.tnd_id = trd.trd_id_nodo
        LEFT JOIN tbl_tipo_despachos ttd ON ttd.ttd_id = tn.tnd_despacho_id
        LEFT JOIN tbl_ruta_empresa_vias trev ON trev.rev_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
        LEFT JOIN tbl_ruta_habilitadas trh ON trh.trh_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      WHERE tre.tre_id_usuario = ${id}`;

      const totalCountResult = await Database.rawQuery(totalCountQuery);
      const totalRecords = totalCountResult.rows[0].total;
      let consulta;
      if (!pagina && !limite) {
        consulta = await Database.rawQuery(`SELECT
		  tr.trt_id as id,
		  tr.trt_codigo_ruta as id_ruta,
          tre.tre_codigo_unico_ruta as id_unico_ruta,
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
          LEFT JOIN tbl_rutas_direcciones trd ON trd.trd_id_ruta  = tr.trt_id
          LEFT JOIN tbl_nodos tn ON tn.tnd_id = trd.trd_id_nodo
          LEFT JOIN tbl_tipo_despachos ttd ON ttd.ttd_id = tn.tnd_despacho_id
          LEFT JOIN tbl_ruta_empresa_vias trev ON trev.rev_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
          LEFT JOIN tbl_ruta_habilitadas trh ON trh.trh_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
          WHERE tre.tre_id_usuario = ${id} ORDER By tre.tre_codigo_unico_ruta desc`);
      } else {
        consulta = await Database.rawQuery(`SELECT
		      tr.trt_id as id,
		      tr.trt_codigo_ruta as id_ruta,
          tre.tre_codigo_unico_ruta as id_unico_ruta,
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
          LEFT JOIN tbl_rutas_direcciones trd ON trd.trd_id_ruta  = tr.trt_id
          LEFT JOIN tbl_nodos tn ON tn.tnd_id = trd.trd_id_nodo
          LEFT JOIN tbl_tipo_despachos ttd ON ttd.ttd_id = tn.tnd_despacho_id
          LEFT JOIN tbl_ruta_empresa_vias trev ON trev.rev_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
          LEFT JOIN tbl_ruta_habilitadas trh ON trh.trh_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
          WHERE tre.tre_id_usuario = ${id} LIMIT ${limite} OFFSET ${(pagina - 1) * limite}`);
      }

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
      return { message: "No se pudieron obtener las rutas de ese usuario" };
    }
  }

  async visualizarParadasPorRuta(
    param: any,
    id: number
  ): Promise<{ paradas: RespuestaParadas[]; paginacion: Paginador }> {
    const { pagina, limite, rutaId } = param;
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
      let consulta;
      if (!pagina && !limite) {
        consulta = await Database.rawQuery(`SELECT
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
          WHERE tre.tre_id_usuario = ${id} and tre.tre_codigo_unico_ruta = ${rutaId} ORDER By tp.tps_id desc`);
      } else {
        consulta = await Database.rawQuery(`SELECT
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
      }

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

  async visualizarClasesPorRuta(
    param: any,
    id: number
  ): Promise<{ clases: RespuestaClases[]; paginacion: Paginador }> {
    const { pagina, limite, rutaId } = param;
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
      let consulta;
      if (!pagina && !limite) {
        consulta = await Database.rawQuery(`SELECT
          tccpg.cpg_descripcion as clase,
          tcv.tcv_id as tipo_vehiculo_id,
          tcv.tcv_estado as estado
          FROM
            tbl_ruta_empresas tre
          LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
          left join tbl_ruta_vehiculos trv on trv.trv_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
          left join tbl_clase_vehiculos tcv on tcv.tcv_id = trv.trv_clase_vehiculo_id
          left join tbl_codigo_clase_por_grupos tccpg on tccpg.cpg_id = tcv.tcv_clase_por_grupo_id
          WHERE tre.tre_id_usuario = ${id} and tre.tre_codigo_unico_ruta = ${rutaId} ORDER By tccpg.cpg_id desc`);
      } else {
        consulta = await Database.rawQuery(`SELECT
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
      }

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

  async guardarDireccion(nodo: Nodo): Promise<any> {
    const nodoDb = new TblNodos();
    try {
      const existe = await TblNodos.query()
        .where({
          idDespacho: nodo.despachoId,
          descripcion: nodo.descripcion,
          direccion: nodo.direccion,
          codigoCp: nodo.codigoCentroPoblado,
        })
        .first();

      if (!existe) {
        nodoDb.establecerNodoDb(nodo);
        await nodoDb.save();
      }
    } catch (error) {
      throw new Error(error);
    }
    const nodosRespuesta = await TblNodos.query().where({
      idDespacho: nodo.despachoId,
      codigoCp: nodo.codigoCentroPoblado,
    });

    const respuestaDirecciones = nodosRespuesta.map((nodoR) => {
      return {
        id: nodoR.id,
        descripcion: nodoR.descripcion,
      };
    });
    return { respuestaDirecciones };
  }

  // guarda todo
  async guardarRutas(rutas: any, id: number) {
    try {
      for (let ruta of rutas.Rutas) {
        await this.actualizarRuta(ruta, id)
      }
      return rutas;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async actualizarRuta(ruta: RespuestaRutas, id: number) {
    try {
      const rutaEmpresa = {
        idUsuario: id,
        idRuta: ruta.idUnicoRuta
      }
      const rutaRecibida = {
        codigoRuta: ruta.idRuta,
        codigoCpOrigen: ruta.centroPobladoOrigen,
        codigoCpDestino: ruta.centroPobladoDestino,
        estado: ruta.rutaHabilitada
      }
      const rutaEmpresaVia = {
        codigoRuta: ruta.idUnicoRuta,
        via: ruta.via,
      }
      const rutaHabilitada = {
        idRuta: ruta.idUnicoRuta,
        resolucion: ruta.resolucion,
        resolucionActual: ruta.resolucionActual,
        direccionTerritorial: ruta.direccionTerritorial,
        documento: ruta.documento,
        nombreOriginal: ruta.nombreOriginal,
        rutaArchivo: ruta.rutaArchivo,
        corresponde: ruta.corresponde
      }

      const rutaDireccion = {
        idRuta: ruta.id,
        idNodo: ruta.direccion,
      };

      await this.guardarTablaRutas(rutaRecibida, ruta.id);
      await this.guardarRutaEmpresavia(rutaEmpresaVia, ruta.idUnicoRuta);
      await this.guardarRutaHabilitada(rutaHabilitada, ruta.idUnicoRuta);
      await this.guardarRutaDireccion(rutaDireccion, ruta.id);
      await this.guardarRutaEmpresa(rutaEmpresa, ruta.idUnicoRuta);

      return console.log('ruta actualizada exitosamente');

    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async guardarRuta(ruta: RespuestaRutas, id: number): Promise<RespuestaRutas> {
    try {
      const ultimoIdCodigoRuta = await TblRutaCodigoRutas.query()
        .orderBy("id", "desc")
        .first();
      const ultimoIdRuta = await TblRutas.query()
        .orderBy("codigoRuta", "desc")
        .first();
      const nuevoIdCodigoRuta = ultimoIdCodigoRuta
        ? ultimoIdCodigoRuta.id + 1
        : 1;
      const nuevoIdRuta = ultimoIdRuta ? ultimoIdRuta.codigoRuta + 1 : 1;

      const rutaCodigoRuta = {
        id: nuevoIdCodigoRuta,
        codigoRuta: nuevoIdRuta,
      };
      const rutaEmpresa = {
        idUsuario: id,
        idRuta: nuevoIdCodigoRuta,
      };
      const rutaIda = {
        codigoRuta: nuevoIdRuta,
        codigoCpOrigen: ruta.centroPobladoOrigen,
        codigoCpDestino: ruta.centroPobladoDestino,
        idaaVuelta: "A",
        estado: ruta.rutaHabilitada,
      };
      const rutaVuelta = {
        codigoRuta: nuevoIdRuta,
        codigoCpOrigen: ruta.centroPobladoDestino,
        codigoCpDestino: ruta.centroPobladoOrigen,
        idaaVuelta: "B",
        estado: ruta.rutaHabilitada,
      };

      const rutaEmpresaVia = {
        codigoRuta: nuevoIdCodigoRuta,
        via: ruta.via,
      };

      const rutaHabilitada = {
        idRuta: nuevoIdCodigoRuta,
        resolucion: ruta.resolucion,
        resolucionActual: ruta.resolucionActual,
        direccionTerritorial: ruta.direccionTerritorial,
        documento: ruta.documento,
        nombreOriginal: ruta.nombreOriginal,
        rutaArchivo: ruta.rutaArchivo,
        corresponde: ruta.corresponde,
      };

      const idRutaida = await this.guardarTablaRutas(rutaIda);
      await this.guardarTablaRutas(rutaVuelta);
      await this.guardarRutaCodigoRuta(rutaCodigoRuta);
      await this.guardarRutaEmpresavia(rutaEmpresaVia);
      await this.guardarRutaHabilitada(rutaHabilitada);
      const rutaDireccion = {
        idRuta: idRutaida,
        idNodo: ruta.direccion,
      };
      await this.guardarRutaDireccion(rutaDireccion);

      await this.guardarRutaEmpresa(rutaEmpresa);

      return ruta;
    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarTablaRutas(ruta: Ruta, id?: number) {
    try {
      if (!id || id == undefined || id == 0) {
        const rutaDb = new TblRutas();
        rutaDb.establecerRuta(ruta);
        await rutaDb.save();
        return rutaDb.id;
      } else {
        const rutaRetorno = await TblRutas.findOrFail(id)
        rutaRetorno.establecerRutaConId(ruta)
        await rutaRetorno.save()
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarRutaCodigoRuta(rutaCodigoRuta: RutaCodigoRuta) {
    try {
      const rutaCodigoRutaDb = new TblRutaCodigoRutas();
      rutaCodigoRutaDb.establecerRutaCodigoRuta(rutaCodigoRuta);
      await rutaCodigoRutaDb.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarRutaEmpresa(rutaEmpresa: RutaEmpresa, codigoUnicoRuta?: number) {
    try {
      if (!codigoUnicoRuta || codigoUnicoRuta == undefined || codigoUnicoRuta == 0) {
        const rutaEmpresaDb = new TblRutaEmpresas();
        rutaEmpresaDb.establecerRutaEmpresa(rutaEmpresa);
        await rutaEmpresaDb.save();
      } else {
        const rutaEmpresaRetorno = await TblRutaEmpresas.query().where('idRuta', codigoUnicoRuta).first()
        if (!rutaEmpresaRetorno) {throw new Error(`No se encontró una ruta empresa con idRuta: ${codigoUnicoRuta}`);}
        rutaEmpresaRetorno.establecerRutaEmpresaConId(rutaEmpresa);
        await rutaEmpresaRetorno.save();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarRutaEmpresavia(rutaEmpresavia: RutaEmpresaVia, codigoUnicoRuta?: number) {
    try {
      if (!codigoUnicoRuta || codigoUnicoRuta == undefined || codigoUnicoRuta == 0) {
        const rutaEmpresaviaDb = new TblRutaEmpresaVias();
        rutaEmpresaviaDb.establecerRutaEmpresaVia(rutaEmpresavia);
        await rutaEmpresaviaDb.save();
      } else {
        const rutaEmpresaviaRetorno = await TblRutaEmpresaVias.query().where('codigoRuta', codigoUnicoRuta).first()
        if (!rutaEmpresaviaRetorno) {throw new Error(`No se encontró una via con codigo Ruta: ${codigoUnicoRuta}`);}
        rutaEmpresaviaRetorno.establecerRutaEmpresaViaConId(rutaEmpresavia);
        await rutaEmpresaviaRetorno.save();
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async guardarRutaHabilitada(rutaHabilitada: RutaHabilitada, codigoUnicoRuta?: number) {
    try {
      if (!codigoUnicoRuta || codigoUnicoRuta == undefined || codigoUnicoRuta == 0) {
        const rutaHabilitadaDb = new TblRutaHabilitadas();
        rutaHabilitadaDb.establecerRutaHabilitada(rutaHabilitada);
        await rutaHabilitadaDb.save();
      } else {
        const rutaHabilitadaRetorno = await TblRutaHabilitadas.query().where('idRuta', codigoUnicoRuta).first()
        if (!rutaHabilitadaRetorno) {throw new Error(`No se encontró una ruta habilitada con idRuta: ${codigoUnicoRuta}`);}
        rutaHabilitadaRetorno.establecerRutaHabilitadaConId(rutaHabilitada);
        await rutaHabilitadaRetorno.save();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarRutaDireccion(rutaDireccion: RutaDireccion, idRuta?: number) {
    try {
      if (!idRuta || idRuta == undefined || idRuta == 0) {
        const rutaDireccionDb = new TblRutasDirecciones();
        rutaDireccionDb.establecerRutaDireccion(rutaDireccion);
        await rutaDireccionDb.save();
      } else {
        const RutaDireccionRetorno = await TblRutasDirecciones.query().where('idRuta', idRuta).first()
        if (!RutaDireccionRetorno) {throw new Error(`No se encontró una direccion para la ruta con idRuta: ${idRuta}`);}
        RutaDireccionRetorno.establecerRutaDireccionConid(rutaDireccion);
        await RutaDireccionRetorno.save();
      }
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
