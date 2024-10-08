/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TblCentroPoblados from "App/Infraestructura/Datos/Entidad/CentroPoblado";
import TblDepartamentos from "App/Infraestructura/Datos/Entidad/Departamentos";
import TblModalidades from "App/Infraestructura/Datos/Entidad/Modalidades";
import TblMunicipios from "App/Infraestructura/Datos/Entidad/Municipios";
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
          codigoMunicipio: centroPoblado.codigoMunicipio,
          nombre: centroPoblado.nombre,
        };
      });
      return { respuestaCentrosPoblados };
    } catch (error) {
      return { message: 'Centros Poblados no encontrados' };
    }
  }
}
