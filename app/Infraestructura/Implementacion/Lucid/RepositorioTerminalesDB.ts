import { Paginador } from "../../../Dominio/Paginador";
import { MapeadorPaginacionDB } from "./MapeadorPaginacionDB";
import { RepositorioTerminales } from "App/Dominio/Repositorios/RepositorioTerminales";
import { RespuestaRutas } from '../../../Dominio/Dto/RespuestaRutas';
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
import { Parada } from "App/Dominio/Datos/Entidades/Parada";
import TblParadas from "App/Infraestructura/Datos/Entidad/Paradas";
import { NodoDespacho } from "App/Dominio/Datos/Entidades/NodoDespacho";
import TblNodosDespachos from "App/Infraestructura/Datos/Entidad/NodosDespachos";
import TblRutaVehiculos from "App/Infraestructura/Datos/Entidad/RutaVehiculo";
import { ClaseVehiculo } from "App/Dominio/Datos/Entidades/ClaseVehiculo";
import TblSolicitudes from "App/Infraestructura/Datos/Entidad/Solicitudes";
import { ServicioEstados } from "App/Dominio/Datos/Servicios/ServicioEstados";

export class RepositorioTerminalesDB implements RepositorioTerminales {
  private servicioEstados = new ServicioEstados();
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
        LEFT JOIN tbl_rutas_direcciones trd ON trd.trd_id_ruta = tr.trt_id
        LEFT JOIN tbl_nodos tn ON tn.tnd_id = trd.trd_id_nodo
        LEFT JOIN tbl_tipo_despachos ttd ON ttd.ttd_id = tn.tnd_despacho_id
        LEFT JOIN tbl_ruta_empresa_vias trev ON trev.rev_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
        LEFT JOIN tbl_ruta_habilitadas trh ON trh.trh_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
      WHERE tre.tre_id_usuario = ${id} and tr.trt_ida_vuelta = 'A'`;

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
          inner join tbl_paradas tp on tp.tps_id = tnd_paradas_id
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
          inner join tbl_paradas tp on tp.tps_id = tnd_paradas_id
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
          trv.trv_id as id_ruta_vehiculos,
          tccpg.cpg_id as clase_id,
          tccpg.cpg_descripcion as clase,
          tcv.tcv_id as tipo_vehiculo_id,
          tcv.tcv_estado as estado
          FROM
            tbl_ruta_empresas tre
          LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
          inner join tbl_ruta_vehiculos trv on trv.trv_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
          left join tbl_clase_vehiculos tcv on tcv.tcv_id = trv.trv_clase_vehiculo_id
          left join tbl_codigo_clase_por_grupos tccpg on tccpg.cpg_id = tcv.tcv_clase_por_grupo_id
          WHERE tre.tre_id_usuario = ${id} and tre.tre_codigo_unico_ruta = ${rutaId} ORDER By tccpg.cpg_id desc`);
      } else {
        consulta = await Database.rawQuery(`SELECT
          trv.trv_id as id_ruta_vehiculos,
          tccpg.cpg_id as clase_id,
          tccpg.cpg_descripcion as clase,
          tcv.tcv_id as tipo_vehiculo_id,
          tcv.tcv_estado as estado
          FROM
            tbl_ruta_empresas tre
          LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
          inner join tbl_ruta_vehiculos trv on trv.trv_codigo_unico_ruta = trcr.rcr_codigo_unico_ruta
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
  async guardar(arregloTerminales: any, id: number) {
    const solicitud = await TblSolicitudes.query().where('vigiladoId', id).first();
    if(solicitud?.estado== 2 || solicitud?.estado == 7) this.servicioEstados.ActualizarEstado(solicitud?.id!, 3)
    try {
      for (let ruta of arregloTerminales.Rutas) {
        await this.actualizarRuta(ruta, id)
      }

      for (let parada of arregloTerminales.Paradas) {
        await this.guardarParadas(parada)
      }

      for (let clase of arregloTerminales.Clases) {
        await this.guardarClases(clase)
      }

      return {arregloRecibido: arregloTerminales, editable: false};
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

        const rutaDireccion = {
          idRuta: ruta.id,
          idNodo: ruta.direccion,
        };

      if (ruta.idaOVuelta == "A") {

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

        const rutaRecibida = {
          codigoRuta: ruta.idRuta,
          estado: ruta.rutaHabilitada
        }

        const rutaEmpresaVia = {
          codigoRuta: ruta.idUnicoRuta,
          via: ruta.via,
        }

      await this.guardarRutaHabilitada(rutaHabilitada, ruta.idUnicoRuta);
      await this.guardarTablaRutas(rutaRecibida, ruta.idRuta);
      await this.guardarRutaEmpresavia(rutaEmpresaVia, ruta.idUnicoRuta);
      } else if(ruta.idaOVuelta == "B"){
        console.log(`no puede actualizar estos aspectos en la ruta de vuelta ${ruta.idaOVuelta}`);
      }
      await this.guardarRutaEmpresa(rutaEmpresa, ruta.idUnicoRuta);
      await this.guardarRutaDireccion(rutaDireccion, ruta.id);
      return console.log('ruta actualizada exitosamente');

    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async guardarRuta(ruta: RespuestaRutas, id: number): Promise<RespuestaRutas> {
    try {
      const ultimoIdCodigoRuta = await TblRutaCodigoRutas.query().orderBy("id", "desc").first();
      const ultimoIdRuta = await TblRutas.query().orderBy("trt_codigo_ruta", "desc").first();

      if (ultimoIdCodigoRuta?.id == null || ultimoIdRuta?.codigoRuta == null) {
        throw new Error(`No se puede guardar con codigo unico de ruta = ${ultimoIdCodigoRuta?.id} y codigo ruta ${ultimoIdRuta?.codigoRuta}, ${ultimoIdRuta?.id}`);
      }

      const nuevoIdCodigoRuta = ultimoIdCodigoRuta ? ultimoIdCodigoRuta.id + 1 : 1;
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
      const idRutaVuelta = await this.guardarTablaRutas(rutaVuelta);
      await this.guardarRutaCodigoRuta(rutaCodigoRuta);
      await this.guardarRutaEmpresavia(rutaEmpresaVia);
      await this.guardarRutaHabilitada(rutaHabilitada);

      const rutaDireccion = {
        idRuta: idRutaida,
        idNodo: ruta.direccion,
      };

      const rutaDireccionVuelta = {
        idRuta: idRutaVuelta,
        idNodo: undefined,
      };

      await this.guardarRutaDireccion(rutaDireccion);
      await this.guardarRutaDireccion(rutaDireccionVuelta);

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
        return rutaDb.id
      } else {
        const rutasRetorno = await TblRutas.query().where('codigoRuta', id)
        await rutasRetorno.forEach(rutaRetorno => {
          rutaRetorno.establecerRutaConId(ruta)
          rutaRetorno.save()
        });
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
      if (!idRuta) {
        const rutaDireccionDb = new TblRutasDirecciones();
        rutaDireccionDb.establecerRutaDireccion(rutaDireccion);
        await rutaDireccionDb.save();
      } else {
        const rutaDireccionRetorno = await TblRutasDirecciones.query().where('idRuta', idRuta).first();
        if (!rutaDireccionRetorno) {
          console.log(`No se encontró una direccion con idRuta: ${idRuta}`);
          const rutaDireccionDb = new TblRutasDirecciones();
          rutaDireccionDb.establecerRutaDireccion(rutaDireccion);
          await rutaDireccionDb.save();
        } else {
          rutaDireccionRetorno.establecerRutaDireccionConid(rutaDireccion);
          await rutaDireccionRetorno.save();
        }
      }

    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarParadas(parada: RespuestaParadas): Promise<RespuestaParadas>{
    try {
      const paradaRecibida = {
        id: parada.idParada,
        codigoCp: parada.centroPobladoId,
        nodoId: parada.direccionId,
      }

      const idParada = await this.guardarParada(paradaRecibida)
      const nodoDespacho = {
        codigoUnicoRuta: parada.idRuta,
        idNodo: parada.direccionId,
        idParada: idParada,
        estado: parada.estado,
      };

      await this.guardarNodoDespacho(nodoDespacho)
      return parada
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async guardarNodoDespacho(nodoDespacho: NodoDespacho) {
    try {
      if (!nodoDespacho || nodoDespacho.idParada == 0 || nodoDespacho.codigoUnicoRuta == 0 || !nodoDespacho.codigoUnicoRuta || nodoDespacho.codigoUnicoRuta == undefined || !nodoDespacho.idParada|| nodoDespacho.idParada== undefined) {
        throw new Error(`Faltan datos para crear o actualizar la parada de esa ruta`);
      }
      const nodoDespachoRetorno = await TblNodosDespachos.query().where('idRuta', nodoDespacho.codigoUnicoRuta).andWhere('idParada', nodoDespacho.idParada!).first()
      if (!nodoDespachoRetorno) {
        const nodoDespachoDb = new TblNodosDespachos();
        nodoDespachoDb.establecerNodoDespacho(nodoDespacho);
        await nodoDespachoDb.save();
      } else {
        nodoDespachoRetorno.establecerNodoDespacho(nodoDespacho);
        await nodoDespachoRetorno.save();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async guardarParada(parada: Parada) {
    try {
      if (!parada) {
        throw new Error(`Faltan datos para crear o actualizar la parada`);
      }
      console.log(`ID de parada: ${parada.id}`);
      if (!parada.id || parada.id === 0) {
        const paradaDb = new TblParadas();
        paradaDb.establecerParada(parada);
        await paradaDb.save();
        return paradaDb.id;
      } else {
        const paradaRetorno = await TblParadas.query().where('id', parada.id).first();
        console.log(`Parada encontrada: ${JSON.stringify(paradaRetorno)}`);
        if (!paradaRetorno) {
          throw new Error(`No se encontró una parada con id: ${parada.id}`);
        }
        paradaRetorno.establecerParadaConId(parada);
        await paradaRetorno.save();
        return paradaRetorno.id;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async guardarClases(clase: ClaseVehiculo): Promise<RespuestaClases>{
    try {
      const claseVehiculo = {
          id: clase.id,
          idRuta: clase.idRuta,
          idClaseVehiculo: clase.idClaseVehiculo,
          estado: clase.estado,
      };
      await this.guardarRutaVehiculo(claseVehiculo)
      return clase
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async guardarRutaVehiculo(rutaVehiculo: ClaseVehiculo) {
    try {
      if (!rutaVehiculo ||
          !rutaVehiculo.idRuta ||
          !rutaVehiculo.idClaseVehiculo ||
          !rutaVehiculo.estado) {
        throw new Error(`Faltan datos para crear o actualizar la clase de vehículos de esa ruta`);
      }
      if (!rutaVehiculo.id) {
        const rutaVehiculoDb = new TblRutaVehiculos();
        rutaVehiculoDb.establecerRutaVehiculo(rutaVehiculo);
        await rutaVehiculoDb.save();
      } else {
        const rutaVehiculoRetorno = await TblRutaVehiculos.query().where('id', rutaVehiculo.id).first();
        console.log(`Resultado de la consulta: ${JSON.stringify(rutaVehiculoRetorno)}`);
        if (!rutaVehiculoRetorno) {
          throw new Error(`No se encontró una ruta con clase de vehículo con id: ${rutaVehiculo.id}`);
        }
        rutaVehiculoRetorno.establecerRutaVehiculoConId(rutaVehiculo);
        await rutaVehiculoRetorno.save();
      }
    } catch (error) {
      throw new Error(`Error al guardar la ruta de vehículo: ${error.message}`);
    }
  }

  async enviarSt(
    param: any,
    id: number) {
    try {
      const { rutasVigilado } = await this.visualizarRutasVigilado(param)
      let aprobado = true;
      const faltantes = new Array();
      for await (const ruta of rutasVigilado) {
        let porLlenar = false;
        if (ruta.tipo_llegada_id == null || ruta.tipo_llegada_id == '') {
          porLlenar = true;
        }

        if (ruta.direccion_id == null || ruta.direccion_id == '') {
          porLlenar = true;
        }

        if (ruta.estado) {
          if (ruta.corresponde == 2) {
            if (ruta.resolucion_actual == null || ruta.resolucion_actual == '') {
              porLlenar = true;
            }
            if (ruta.documento == null || ruta.documento == '') {
              porLlenar = true;
            }
          }
        }
        if (porLlenar) {
          faltantes.push(ruta.id)
          aprobado = false
        }
      }

      if(aprobado){
        const solicitud = await TblSolicitudes.query().where('vigiladoId', id).first();
      this.servicioEstados.ActualizarEstado(solicitud?.id!, 1)
      }
      return {faltantes, aprobado}
    } catch (error) {
      throw new Error(`Error al enviar a ST: ${error.message}`);
    }
  }

  async visualizarRutasVigilado(
    param: any
  ): Promise<{ rutasVigilado: any[]; paginacion: Paginador, editable:boolean, verificacionVisible:boolean, verificacionEditable:boolean }> {
    const { pagina, limite, vigiladoId } = param;
    let editable = false;
    let verificacionVisible = false;
    let verificacionEditable = false;
    try {

      const solicitud = await TblSolicitudes.query().where('vigiladoId', vigiladoId).first();
      if (!solicitud) {
      const nuevaSolicitiud = new TblSolicitudes()
      nuevaSolicitiud.vigiladoId = vigiladoId;
      nuevaSolicitiud.estado = 2
      await nuevaSolicitiud.save()

      const estados = await this.servicioEstados.consultarEditable(2, 3);
      editable = estados.editable
      verificacionVisible = estados.verificacionVisible
      verificacionEditable = estados.verificacionEditable
      //solicitudId = nuevaSolicitiud.id

  }else{
      const estados = await this.servicioEstados.consultarEditable(solicitud.estado,3, solicitud.estadoVeri);
      editable = estados.editable
      verificacionVisible = estados.verificacionVisible
      verificacionEditable = estados.verificacionEditable
      //solicitudId = solicitud.id
    }
    this.servicioEstados.Log(vigiladoId, 2);

    const consulta = TblRutaEmpresas.query().preload('codigoUnicoRuta', sqlcodigoRuta => {
      sqlcodigoRuta.preload('ruta', sqlruta => {
        sqlruta.preload('cpOrigen', sqlCentroOrigen => {
          sqlCentroOrigen.preload('municipio', sqlmunicipioOri => {
            sqlmunicipioOri.preload('departamento')
          })
        }).preload('cpDestino', sqlCentroDestino => {
          sqlCentroDestino.preload('municipio', sqlmunicipioDesti => {
            sqlmunicipioDesti.preload('departamento')
          })
        }).where('idaaVuelta', 'A')
      })
    }).where('idUsuario', vigiladoId)

      const consultaDb = await consulta.paginate(pagina, limite)

      const rutasVigilado = consultaDb.all().map(sqlRuta => {
        let rutas = new Object();
        const idRuta = sqlRuta.codigoUnicoRuta.id
        sqlRuta.codigoUnicoRuta.ruta.forEach((ruta) => {
          rutas = {
            idCodigoUnicoRuta: idRuta,
            idCodigoRuta: sqlRuta.codigoUnicoRuta.codigoRuta,
            idRuta: ruta.id,
            codCpOrigen: ruta.codigoCpOrigen,
            descripcionOrigen: ruta.cpOrigen.nombre,
            CoddepartamentoOrigen: ruta.cpOrigen.municipio.departamento.codigoDepartamento,
            departamentoOrigen: ruta.cpOrigen.municipio.departamento.nombre,
            CodmunicipioOrigen: ruta.cpOrigen.municipio.codigoMunicipio,
            municipioOrigen: ruta.cpOrigen.municipio.nombre,
            codCpDestino: ruta.codigoCpDestino,
            descripcionDestino: ruta.cpDestino.nombre,
            CoddepartamentoDestino: ruta.cpDestino.municipio.departamento.codigoDepartamento,
            departamentoDestino: ruta.cpDestino.municipio.departamento.nombre,
            CodmunicipioDestino: ruta.cpDestino.municipio.codigoMunicipio,
            municipioDestino: ruta.cpDestino.municipio.nombre,
          }
        })
        return {
          rutas: rutas
        }
      })
      const paginacion = MapeadorPaginacionDB.obtenerPaginacion(consultaDb)
      return {rutasVigilado, paginacion, editable, verificacionVisible, verificacionEditable };
    } catch (error) {
      throw new Error(error);
    }
  }

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
