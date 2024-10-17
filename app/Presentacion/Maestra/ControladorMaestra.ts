/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TblCentroPoblados from "App/Infraestructura/Datos/Entidad/CentroPoblado";
import TblClaseVehiculos from "App/Infraestructura/Datos/Entidad/ClaseVehiculos";
import TblCodigoClasePorGrupos from "App/Infraestructura/Datos/Entidad/CodigoClaseGrupos";
import TblDepartamentos from "App/Infraestructura/Datos/Entidad/Departamentos";
import TblModalidades from "App/Infraestructura/Datos/Entidad/Modalidades";
import TblMunicipios from "App/Infraestructura/Datos/Entidad/Municipios";
import TblNodos from "App/Infraestructura/Datos/Entidad/Nodos";
import TblRutaEmpresas from "App/Infraestructura/Datos/Entidad/RutaEmpresa";
import TblTipoDespachos from "App/Infraestructura/Datos/Entidad/TipoDespacho";
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
      return { message: 'No se pudieron obtener los departamentos' };
    }
  }

  public async municipios({  request }: HttpContextContract) {
    const codigoDepartamento = request.input('codigoDepartamento');
    try {
      const municipios = await TblMunicipios.query().where('tms_departamento_codigo', codigoDepartamento );
      const respuestaMunicipios = municipios.map((municipio) => {
        return {
          id: municipio.id,
          codigoMunicipio: municipio.codigoMunicipio,
          nombre: municipio.nombre,
        };
      });
      return { respuestaMunicipios };
    } catch (error) {
      return { message: 'Municipios no encontrados' };
    }
  }

  public async centrosPoblados({ request }: HttpContextContract) {
    const codigoMunicipio = request.input('codigoMunicipio');
    try {
      const centrosPoblados = await TblCentroPoblados.query().where('tcp_codigo_municipio', codigoMunicipio );
      const respuestaCentrosPoblados = centrosPoblados.map((centroPoblado) => {
        return {
          id: centroPoblado.id,
          codigoCentroPoblado: centroPoblado.codigoCentroPoblado,
          nombre: centroPoblado.nombre,
        };
      });
      return { respuestaCentrosPoblados };
    } catch (error) {
      return { message: 'Centros Poblados no encontrados' };
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
      return { message: 'No se pudieron obtener los tipos de llegada' };
    }
  }

  public async tipovehiculo({ request }: HttpContextContract) {
    const idClasePorGrupo = request.input('idClasePorGrupo');
    const tiposvehiculos = await TblClaseVehiculos.query().where('tcv_clase_por_grupo_id', idClasePorGrupo);
    try {
      const respuestaTiposvehiculos = tiposvehiculos.map((tipovehiculo) => {
        return {
          id: tipovehiculo.id,
          descripcion: tipovehiculo.descripcion,
          idClasePorGrupo: tipovehiculo.idClasePorGrupo
        };
      });
      return { respuestaTiposvehiculos };
    } catch (error) {
      return { message: 'No se pudieron obtener los tipos de vehiculos' };
    }
  }

  public async clasePorGrupo({ request }: HttpContextContract) {
    const clasesPorGrupos = await TblCodigoClasePorGrupos.all();
    try {
      const respuestaclasesPorGrupos = clasesPorGrupos.map((clasePorGrupo) => {
        return {
          id: clasePorGrupo.id,
          descripcion: clasePorGrupo.descripcion
        };
      });
      return { respuestaclasesPorGrupos };
    } catch (error) {
      return { message: 'No se pudieron obtener los tipos de vehiculos' };
    }
  }

  public async nodos({ request }: HttpContextContract) {
    const codigoTipollegada = request.input('codigoTipollegada');
    const codigoCentroPoblado = request.input('codigoCp');
    try {
      const direcciones =  await TblNodos.query().where({
        idDespacho: codigoTipollegada,
        codigoCp: codigoCentroPoblado
      })

      const respuestaDirecciones = direcciones.map((nodo) => {
        return {
          id: nodo.id,
          descripcion: nodo.descripcion,
        };
      });
      return { respuestaDirecciones };
    } catch (error) {
      return { message: 'No se pudieron obtener las direcciones' };
    }
  }
}
