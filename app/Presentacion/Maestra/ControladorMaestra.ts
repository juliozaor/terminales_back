/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import TblCentroPoblados from "App/Infraestructura/Datos/Entidad/CentroPoblado";
import TblClaseVehiculos from "App/Infraestructura/Datos/Entidad/ClaseVehiculos";
import TblCodigoClasePorGrupos from "App/Infraestructura/Datos/Entidad/CodigoClaseGrupos";
import TblDepartamentos from "App/Infraestructura/Datos/Entidad/Departamentos";
import TblMunicipios from "App/Infraestructura/Datos/Entidad/Municipios";
import TblNodos from "App/Infraestructura/Datos/Entidad/Nodos";
import TblRutaCodigoRutas from "App/Infraestructura/Datos/Entidad/RutaCodigoRutas";
import TblRutaEmpresas from "App/Infraestructura/Datos/Entidad/RutaEmpresa";
import TblRutas from "App/Infraestructura/Datos/Entidad/Rutas";
import TblTipoDespachos from "App/Infraestructura/Datos/Entidad/TipoDespacho";
import TblUsuarios from "App/Infraestructura/Datos/Entidad/Usuario";
import { MapeadorPaginacionDB } from "App/Infraestructura/Implementacion/Lucid/MapeadorPaginacionDB";
export default class ControladorMaestra {
  public async departamentos({ request }: HttpContextContract) {
    const departamentos = await TblDepartamentos.all();

    try {
      const respuestaDepartamentos = departamentos.map((departamento) => {
        return {
          id: departamento.id,
          codigoDepartamento: departamento.codigoDepartamento,
          nombre: departamento.nombre,
        };
      });
      return { respuestaDepartamentos };
    } catch (error) {
      return { message: "No se pudieron obtener los departamentos" };
    }
  }

  public async municipios({ request }: HttpContextContract) {
    const codigoDepartamento = request.input("codigoDepartamento");
    try {
      const municipios = await TblMunicipios.query().where(
        "tms_departamento_codigo",
        codigoDepartamento
      );
      const respuestaMunicipios = municipios.map((municipio) => {
        return {
          id: municipio.id,
          codigoMunicipio: municipio.codigoMunicipio,
          nombre: municipio.nombre,
        };
      });
      return { respuestaMunicipios };
    } catch (error) {
      return { message: "Municipios no encontrados" };
    }
  }

  public async centrosPoblados({ request }: HttpContextContract) {
    const codigoMunicipio = request.input("codigoMunicipio");
    try {
      const centrosPoblados = await TblCentroPoblados.query().where(
        "tcp_codigo_municipio",
        codigoMunicipio
      );
      const respuestaCentrosPoblados = centrosPoblados.map((centroPoblado) => {
        return {
          id: centroPoblado.id,
          codigoCentroPoblado: centroPoblado.codigoCentroPoblado,
          nombre: centroPoblado.nombre,
        };
      });
      return { respuestaCentrosPoblados };
    } catch (error) {
      return { message: "Centros Poblados no encontrados" };
    }
  }

  public async tipoLlegada({ request }: HttpContextContract) {
    const tipoDespacho = await TblTipoDespachos.all();

    try {
      const respuestaTipoLLegada = tipoDespacho.map((tipoDespacho) => {
        return {
          id: tipoDespacho.id,
          descripcion: tipoDespacho.descripcion,
        };
      });
      return { respuestaTipoLLegada };
    } catch (error) {
      return { message: "No se pudieron obtener los tipos de llegada" };
    }
  }

  public async tipovehiculo({ request }: HttpContextContract) {
    const idClasePorGrupo = request.input("idClasePorGrupo");
    const tiposvehiculos = await TblClaseVehiculos.query().where(
      "tcv_clase_por_grupo_id",
      idClasePorGrupo
    );
    try {
      const respuestaTiposvehiculos = tiposvehiculos.map((tipovehiculo) => {
        return {
          id: tipovehiculo.id,
          descripcion: tipovehiculo.descripcion,
          idClasePorGrupo: tipovehiculo.idClasePorGrupo,
        };
      });
      return { respuestaTiposvehiculos };
    } catch (error) {
      return { message: "No se pudieron obtener los tipos de vehiculos" };
    }
  }

  public async clasePorGrupo({ request }: HttpContextContract) {
    const clasesPorGrupos = await TblCodigoClasePorGrupos.all();
    try {
      const respuestaclasesPorGrupos = clasesPorGrupos.map((clasePorGrupo) => {
        return {
          id: clasePorGrupo.id,
          descripcion: clasePorGrupo.descripcion,
        };
      });
      return { respuestaclasesPorGrupos };
    } catch (error) {
      return { message: "No se pudieron obtener los tipos de vehiculos" };
    }
  }

  public async nodos({ request }: HttpContextContract) {
    const codigoTipollegada = request.input("codigoTipollegada");
    const codigoCentroPoblado = request.input("codigoCp");
    try {
      const direcciones = await TblNodos.query().where({
        idDespacho: codigoTipollegada,
        codigoCp: codigoCentroPoblado,
      });

      const respuestaDirecciones = direcciones.map((nodo) => {
        return {
          id: nodo.id,
          descripcion: nodo.descripcion,
        };
      });
      return { respuestaDirecciones };
    } catch (error) {
      return { message: "No se pudieron obtener las direcciones" };
    }
  }

  public async listarNodos({ request }: HttpContextContract) {
    try {
      const direcciones = await TblNodos.query();
      const respuestaDirecciones = direcciones.map((nodo) => {
        return {
          codCpNodo: nodo.codigoCp,
          razonSocial: nodo.descripcion,
        };
      });
      return { respuestaDirecciones };
    } catch (error) {
      return { message: "No se pudieron obtener las direcciones" };
    }
  }

  public async listarEmpresas({ request }: HttpContextContract) {
    try {
      const empresas = await TblUsuarios.query().where("idRol", 3);
      const respuestaEmpresas = empresas.map((empresa) => {
        return {
          id: empresa.id,
          nit: empresa.identificacion,
          razonSocial: empresa.nombre,
        };
      });
      return { respuestaEmpresas };
    } catch (error) {
      return { message: "No se pudieron obtener las empresas" };
    }
  }

  public async rutasActivasPorEmpresa({ request }: HttpContextContract) {
    const { nit } = request.all();
    try {
      const query = await TblUsuarios.query().preload("empresas", (sqlEmpresa) => {
        sqlEmpresa.preload("codigoUnicoRuta", (sqlcodigo) => {
          sqlcodigo.preload("ruta", (sqlruta) => {
            sqlruta
              .preload("cpOrigen", (sqlOrigen) => {
                sqlOrigen.preload("municipio", (sqlMunicipioO) => {
                  sqlMunicipioO.preload("departamento");
                });
              })
              .preload("cpDestino", (sqlDestino) => {
                sqlDestino.preload("municipio", (sqlMunicipioD) => {
                  sqlMunicipioD.preload("departamento");
                });
              });
            sqlruta.where("trt_estado", true);
            sqlruta.where("trt_ida_vuelta", "A");
          });
        });
      }
      ).where("identificacion", nit).first();


      const rutas = new Array();
      query?.empresas.forEach((empresa) => {
        empresa.codigoUnicoRuta.ruta.forEach((ruta) => {
          const rutaExiste = rutas.find((rutaExiste) => rutaExiste.idRuta === ruta.id);
          if (!rutaExiste) {
            rutas.push({
              idRuta: ruta.id,
              codOrigen: ruta.codigoCpOrigen,
              descripcionOrigen: ruta.cpOrigen.nombre,
              departamentoOrigen: ruta.cpOrigen.municipio.departamento.nombre,
              municipioOrigen: ruta.cpOrigen.municipio.nombre,
              codDestino: ruta.codigoCpDestino,
              descripcionDestino: ruta.cpDestino.nombre,
              departamentoDestino: ruta.cpDestino.municipio.departamento.nombre,
              municipioDestino: ruta.cpDestino.municipio.nombre,
            });
          }
        });
      });

      return { rutas }
    } catch (error) {
      return { message: "No se pudieron obtener las rutas activas" };
    }

  }

  public async rutasEmpresas({ request }: HttpContextContract) {
    try {
      const { pagina, limite } = request.all();

      const query = await TblUsuarios.query()
        .preload("empresas", (sqlEmpresa) => {
          sqlEmpresa.preload("codigoUnicoRuta", (sqlcodigo) => {
            sqlcodigo.preload("ruta", (sqlruta) => {
              sqlruta
                .preload("cpOrigen", (sqlOrigen) => {
                  sqlOrigen.preload("municipio", (sqlMunicipioO) => {
                    sqlMunicipioO.preload("departamento");
                  });
                })
                .preload("cpDestino", (sqlDestino) => {
                  sqlDestino.preload("municipio", (sqlMunicipioD) => {
                    sqlMunicipioD.preload("departamento");
                  });
                });
            });
          });
        })
        .paginate(pagina, limite);

      const paginacion = MapeadorPaginacionDB.obtenerPaginacion(query);
      const empresas = query.all().map((consulta) => {
        const rutas = new Array();
        consulta.empresas.forEach((empresa) => {
          const idRuta = empresa.codigoUnicoRuta.id;
          empresa.codigoUnicoRuta.ruta.forEach((ruta) => {
            rutas.push({
              idRuta: ruta.id,
              codigoUnicoRuta: idRuta,
              codOrigen: ruta.codigoCpOrigen,
              descripcionOrigen: ruta.cpOrigen.nombre,
              departamentoOrigen: ruta.cpOrigen.municipio.departamento.nombre,
              municipioOrigen: ruta.cpOrigen.municipio.nombre,
              codDestino: ruta.codigoCpDestino,
              descripcionDestino: ruta.cpDestino.nombre,
              departamentoDestino: ruta.cpDestino.municipio.departamento.nombre,
              municipioDestino: ruta.cpDestino.municipio.nombre,
            });
          });
        });

        return {
          idEmpresa: consulta.id,
          nit: consulta.identificacion,
          razonSocial: consulta.nombre,
          rutas: rutas,
        };
      });
      return { empresas, paginacion };
    } catch (error) {
      return { message: "No se pudieron obtener las rutas activas" };
    }
  }

  public async listarRutas({ request }: HttpContextContract) {
    try {
      const { terminal, pagina, limite } = request.all();

      const query = TblRutas.query().preload("cpOrigen", (sqlOrigen) => {
        sqlOrigen.preload("municipio", (sqlMunicipioO) => {
          sqlMunicipioO.preload("departamento");
        });
      })
        .preload("cpDestino", (sqlDestino) => {
          sqlDestino.preload("municipio", (sqlMunicipioD) => {
            sqlMunicipioD.preload("departamento");
          });
        });

      if (terminal) {
        query.where("trt_codigo_cp_origen", terminal);
      }
      query.where("trt_estado", true).where("trt_ida_vuelta", "A");

      const rutasDB = await query.paginate(pagina, limite);

      const paginacion = MapeadorPaginacionDB.obtenerPaginacion(rutasDB);
      const rutas = new Array();
      rutasDB.forEach((ruta) => {
        rutas.push({
          idRuta: ruta.id,
          codOrigen: ruta.codigoCpOrigen,
          descripcionOrigen: ruta.cpOrigen.nombre,
          departamentoOrigen: ruta.cpOrigen.municipio.departamento.nombre,
          municipioOrigen: ruta.cpOrigen.municipio.nombre,
          codDestino: ruta.codigoCpDestino,
          descripcionDestino: ruta.cpDestino.nombre,
          departamentoDestino: ruta.cpDestino.municipio.departamento.nombre,
          municipioDestino: ruta.cpDestino.municipio.nombre,
        });
      });


      return { rutas, paginacion };
    } catch (error) {
      return { message: "No se pudieron obtener las rutas activas" };
    }
  }

  async ConsultarRuta({ request }: HttpContextContract): Promise<any> {
    const { idRuta, codigoUnicoRuta } = request.all();

    const consulta = TblRutaEmpresas.query()
      .preload("codigoUnicoRuta", (sqlCodigoUnico) => {
        sqlCodigoUnico.preload("ruta", (sqlRuta) => {
          sqlRuta.preload("cpOrigen", (sqlCporigen) => {
            sqlCporigen.preload("municipio", (sqlMunicipioO) => {
              sqlMunicipioO.preload("departamento");
            });
          });
          sqlRuta.preload("cpDestino", (sqlCpDestino) => {
            sqlCpDestino.preload("municipio", (sqlMunicipioD) => {
              sqlMunicipioD.preload("departamento");
            });
          });
          sqlRuta.preload("rutaDireccion", (sqlRutaDireccion) => {
            sqlRutaDireccion.preload("idNodos");
          });
          sqlRuta.where("id", idRuta);
        });
        sqlCodigoUnico.whereHas("ruta", (sqlRuta) => {
          sqlRuta.where("id", idRuta);
        });
        sqlCodigoUnico.where("id", codigoUnicoRuta);
      })
      .where("idRuta", codigoUnicoRuta)
      .first();

    const consultaDb = await consulta;

    const rutaDb = consultaDb!.codigoUnicoRuta.ruta[0];

    const ruta = {
      idRuta: consultaDb!.codigoUnicoRuta.id,
      codOrigen: rutaDb.codigoCpOrigen,
      descripcionOrigen: rutaDb.cpOrigen.nombre,
      departamentoOrigen: rutaDb.cpOrigen.municipio.departamento.nombre,
      municipioOrigen: rutaDb.cpOrigen.municipio.nombre,
      codDestino: rutaDb.codigoCpDestino,
      descripcionDestino: rutaDb.cpDestino.nombre,
      departamentoDestino: rutaDb.cpDestino.municipio.departamento.nombre,
      municipioDestino: rutaDb.cpDestino.municipio.nombre,
      codigoTerminal: rutaDb.rutaDireccion.idNodo,
      nombreTerminal: rutaDb.rutaDireccion.idNodos.descripcion,
    };
    return ruta;
  }

  public async listarEmpresasPorRuta({ request }: HttpContextContract) {
    const { idRuta } = request.all();
    try {
      const consulta = await TblRutas.query().where({ "id": idRuta, 'idaaVuelta': 'A' }).preload('codigoRutas', (sqlCodigoRutas) => {
        sqlCodigoRutas.preload('rutaEmpresa', (sqlEmpresa) => {
          sqlEmpresa.preload('usuarios');
        });
      });

      const empresas = new Array();
      consulta.forEach((ruta) => {
        ruta.codigoRutas.forEach((codigoRuta) => {
          codigoRuta.rutaEmpresa.forEach((rutaEmpresa) => {
            const empresaExiste = empresas.find((empresaExiste) => empresaExiste.id === rutaEmpresa.usuarios.id);
            if (!empresaExiste) {
              empresas.push({
                id: rutaEmpresa.usuarios.id,
                nit: rutaEmpresa.usuarios.identificacion,
                razonSocial: rutaEmpresa.usuarios.nombre,
              });
            }
          });
        })
      })

      return { empresas };

    } catch (error) {

    }

  }

  public async rutasPorCodigo({ request }: HttpContextContract) {

    try {
      const { idRuta, pagina, limite } = request.all();

      const query = TblRutas.query().preload("cpOrigen", (sqlOrigen) => {
        sqlOrigen.preload("municipio", (sqlMunicipioO) => {
          sqlMunicipioO.preload("departamento");
        });
      })
        .preload("cpDestino", (sqlDestino) => {
          sqlDestino.preload("municipio", (sqlMunicipioD) => {
            sqlMunicipioD.preload("departamento");
          });
        });

      if (idRuta) {
        query.where("id", idRuta);
      }
      query.where("trt_estado", true).where("trt_ida_vuelta", "A");

      const rutasDB = await query

      const rutas = new Array();
      rutasDB.forEach((ruta) => {
        rutas.push({
          idRuta: ruta.id,
          codOrigen: ruta.codigoCpOrigen,
          descripcionOrigen: ruta.cpOrigen.nombre,
          departamentoOrigen: ruta.cpOrigen.municipio.departamento.nombre,
          municipioOrigen: ruta.cpOrigen.municipio.nombre,
          codDestino: ruta.codigoCpDestino,
          descripcionDestino: ruta.cpDestino.nombre,
          departamentoDestino: ruta.cpDestino.municipio.departamento.nombre,
          municipioDestino: ruta.cpDestino.municipio.nombre,
        });
      });

      return { rutas };



    } catch (error) {
      return { message: "No se pudieron obtener las rutas" };
    }
  }



  public async terminalRuta({ request }: HttpContextContract) {

    try {
      const { idRuta } = request.all();

      const terminal = await TblRutas.query().where("id", idRuta).preload("rutaDireccion", (sqlRutaDireccion) => {
        sqlRutaDireccion.preload("idNodos");
      }).first();
      if (terminal) {
        const respuestaDirecciones = {
          codCpNodo: terminal?.rutaDireccion.idNodos.codigoCp,
          razonSocial: terminal?.rutaDireccion.idNodos.descripcion
        }
        return { respuestaDirecciones };
      } else {
        return { message: "No se encontró la terminal para esta ruta" };
      }




    } catch (error) {
      return { message: "No se pudieron obtener las rutas" };
    }
  }

  public async consultarEmpresas({ request }: HttpContextContract) {
    const { nit, razonSocial, departamentoOrigen, municipioOrigen, departamentoDestino, municipioDestino, pagina, limite } = request.all();
    try {
      const totalCountQuery = `
      SELECT COUNT(DISTINCT tu.usn_identificacion) as total
      from
          tbl_usuarios tu
          left join tbl_ruta_empresas tre on tre.tre_id_usuario = tu.usn_id
          LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
          LEFT JOIN tbl_rutas tr ON tr.trt_codigo_ruta = trcr.rcr_codigo_ruta
          LEFT JOIN tbl_centro_poblados tcp ON tcp.tcp_codigo_centro_poblado = tr.trt_codigo_cp_origen
          LEFT JOIN tbl_centro_poblados tcpd ON tcpd.tcp_codigo_centro_poblado = tr.trt_codigo_cp_destino
          LEFT JOIN tbl_municipios tm ON tcp.tcp_codigo_municipio = tm.tms_codigo_municipio
          LEFT JOIN tbl_municipios tmd ON tcpd.tcp_codigo_municipio = tmd.tms_codigo_municipio
          LEFT JOIN tbl_departamentos td ON tm.tms_departamento_codigo = td.tdp_codigo_departamento
          LEFT JOIN tbl_departamentos tdd ON tmd.tms_departamento_codigo = tdd.tdp_codigo_departamento
          where tr.trt_estado = true`
      const totalCountResult = await Database.rawQuery(totalCountQuery);
      const totalRecords = totalCountResult.rows[0].total;

      let consulta = `
        select DISTINCT
		tu.usn_identificacion as nit,
		tu.usn_nombre as razon_social,
		tu.usn_correo as correo
          from
          tbl_usuarios tu
          left join tbl_ruta_empresas tre on tre.tre_id_usuario = tu.usn_id
          LEFT JOIN tbl_ruta_codigo_rutas trcr ON trcr.rcr_codigo_unico_ruta = tre.tre_codigo_unico_ruta
          LEFT JOIN tbl_rutas tr ON tr.trt_codigo_ruta = trcr.rcr_codigo_ruta
          LEFT JOIN tbl_centro_poblados tcp ON tcp.tcp_codigo_centro_poblado = tr.trt_codigo_cp_origen
          LEFT JOIN tbl_centro_poblados tcpd ON tcpd.tcp_codigo_centro_poblado = tr.trt_codigo_cp_destino
          LEFT JOIN tbl_municipios tm ON tcp.tcp_codigo_municipio = tm.tms_codigo_municipio
          LEFT JOIN tbl_municipios tmd ON tcpd.tcp_codigo_municipio = tmd.tms_codigo_municipio
          LEFT JOIN tbl_departamentos td ON tm.tms_departamento_codigo = td.tdp_codigo_departamento
          LEFT JOIN tbl_departamentos tdd ON tmd.tms_departamento_codigo = tdd.tdp_codigo_departamento
          where tr.trt_estado = true`

      if (nit) {
        consulta += ` AND tu.usn_identificacion = '${nit}'`
      }

      if (razonSocial) {
        consulta += ` AND tu.usn_nombre LIKE '%${razonSocial}%'`
      }

      if (departamentoOrigen) {
        consulta += ` AND tm.tms_departamento_codigo = '${departamentoOrigen}'`
      }

      if (departamentoDestino) {
        consulta += ` AND tmd.tms_departamento_codigo = '${departamentoDestino}'`
      }

      if (municipioOrigen) {
        consulta += ` AND tcp.tcp_codigo_municipio = '${municipioOrigen}'`
      }

      if (municipioDestino) {
        consulta += ` AND tcpd.tcp_codigo_municipio = '${municipioDestino}'`
      }

      if (pagina && limite) {
        consulta += ` LIMIT ${limite} OFFSET ${(pagina - 1) * limite}`
      }

      const consultaDb = await Database.rawQuery(consulta);
      const totalPages = Math.ceil(totalRecords / limite);
      const paginacion = {
        totalRegistros: totalRecords,
        paginaActual: pagina,
        totalPaginas: totalPages
      }

      return {empresas: consultaDb.rows, paginacion: paginacion}
    } catch (error) {
      return { message: "No se pudieron obtener las empresas" };
    }
  }
}
