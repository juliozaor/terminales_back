/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioTerminales } from 'App/Dominio/Datos/Servicios/ServicioTerminales'
import { RepositorioTerminalesDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioTerminalesDB'

export default class ControladorTerminales {
  private service: ServicioTerminales
  constructor () {
    this.service = new ServicioTerminales(new RepositorioTerminalesDB())
  }

  public async visualizarParadasPorRuta({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
      const paradas = await this.service.visualizarParadasPorRuta(request.all(), parseInt(id))
      return response.status(200).send(paradas);
  }


  public async visualizarClasesPorRuta({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
      const Clases = await this.service.visualizarClasesPorRuta(request.all(), parseInt(id))
      return response.status(200).send(Clases);
  }

  public async numeroTotalRutasPorUsuario({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
      const totalRutas = await this.service.numeroTotalRutasPorUsuario(parseInt(id))
      return response.status(200).send(totalRutas);
  }

  public async guardarDireccion({ response, request }: HttpContextContract) {
    try {
      const direccionIn: any = request.all()
      if (!direccionIn || Object.keys(direccionIn).length === 0) {
        return response.badRequest({ message: 'El objeto de dirección no puede estar vacío.' });
      }
      const camposRequeridos = ['despachoId', 'descripcion', 'codigoCentroPoblado'];
      const camposFaltantes = camposRequeridos.filter(field => !direccionIn[field]);
      if (camposFaltantes.length > 0) {
        return response.badRequest({ message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}` });
      }
      const direccion = await this.service.guardarDireccion(direccionIn)
      return response.created(direccion)
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async guardarRuta({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
    try {
      const rutadb = request.all()
      if (!rutadb || Object.keys(rutadb).length === 0) {
        return response.badRequest({ message: 'La ruta no puede estar vacío.' });
      }
      const camposRequeridos = ['centroPobladoOrigen', 'centroPobladoDestino', 'direccion', 'resolucionActual', 'via', 'direccionTerritorial'];
      const camposFaltantes = camposRequeridos.filter(field => !rutadb[field]);
      if (camposFaltantes.length > 0) {
        return response.badRequest({ message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}` });
      }
      const ruta = await this.service.guardarRuta(rutadb, parseInt(id))
      return response.status(200).send(ruta);
    } catch (error) {
      console.log(error);
      return response.badRequest(error.messages)
    }
  }

  public async guardarParada({ response, request }: HttpContextContract) {
    try {
      const paradadb = request.all()
      if (!paradadb || Object.keys(paradadb).length === 0) {
        return response.badRequest({ message: 'La parada no puede estar vacío.' });
      }
      const camposRequeridos = ['idRuta', 'centroPobladoId', 'direccionId'];
      const camposFaltantes = camposRequeridos.filter(field => !paradadb[field]);
      if (camposFaltantes.length > 0) {
        return response.badRequest({ message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}` });
      }
      const ruta = await this.service.guardarParada(paradadb)
      return response.status(200).send(ruta);
    } catch (error) {
      console.log(error);
      return response.badRequest(error.messages)
    }
  }

  public async guardarClase({ response, request }: HttpContextContract) {
    try {
      const clasedb = request.all()
      if (!clasedb || Object.keys(clasedb).length === 0) {
        return response.badRequest({ message: 'La clase no puede estar vacío.' });
      }
      const camposRequeridos = ['idRuta', 'idClaseVehiculo', 'estado'];
      const camposFaltantes = camposRequeridos.filter(field => !clasedb[field]);
      if (camposFaltantes.length > 0) {
        return response.badRequest({ message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}` });
      }
      const ruta = await this.service.guardarClase(clasedb)
      return response.status(200).send(ruta);
    } catch (error) {
      console.log(error);
      return response.badRequest(error.messages)
    }
    }

  public async guardar({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
    try {
      const arregloTerminales = request.all()
      const rutas = await this.service.guardar(arregloTerminales, parseInt(id))
      return response.status(200).send(rutas);
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async enviarSt({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
    try {
      const arregloSt = request.all()
      const respuestast = await this.service.enviarSt(arregloSt, parseInt(id))
      return response.status(200).send(respuestast);
    } catch (error) {
      return response.badRequest(error.messages)
    }
  }

  public async visualizarRutasVigilado({ response, request }: HttpContextContract) {
    const rutasVigilado = await this.service.visualizarRutasVigilado(request.all())
    return response.status(200).send(rutasVigilado);
  }

  public async visualizarRuta({ response, request }: HttpContextContract) {
    const rutaVigilado = await this.service.visualizarRuta(request.all())
    return response.status(200).send(rutaVigilado);
  }

  public async eliminarClase({ response, request }: HttpContextContract) {
    const {claseId} = request.all()
    const clase = await this.service.eliminarClase(claseId)
    return response.status(200).send(clase);
  }

  public async eliminarParada({ response, request }: HttpContextContract) {
    const parada = await this.service.eliminarParada(request.all())
    return response.status(200).send(parada);
  }

  public async eliminarVia({ response, request }: HttpContextContract) {
    const parada = await this.service.eliminarVia(request.all())
    return response.status(200).send(parada);
  }

  public async guardarVia({ response, request }: HttpContextContract) {
    const via = await this.service.guardarVia(request.all())
    return response.status(200).send(via);
  }

}
