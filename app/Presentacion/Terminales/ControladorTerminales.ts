/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ServicioTerminales } from 'App/Dominio/Datos/Servicios/ServicioTerminales'
import { RepositorioAseguradoraDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioAseguradoraDB'
import { RepositorioTerminalesDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioTerminalesDB'

export default class ControladorTerminales {
  private service: ServicioTerminales
  constructor () {
    this.service = new ServicioTerminales(new RepositorioTerminalesDB())
  }


  public async visualizarRutas({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
      const rutas = await this.service.visualizarRutas(request.all(), parseInt(id))
      return response.status(200).send(rutas);
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

  // public async guardarRutas({ response, request }: HttpContextContract) {

  // }

  // public async obtenerAseguradora ({response, params}:HttpContextContract){
  //   const id = params.id
  //   if(!id){
  //     return response.status(400).send({message:'El id es necesario'});
  //   }
  //   const aseguradora = await this.service.obtenerAseguradora(id)
  //     return response.status(200).send(aseguradora);
  // }

  // public async crearAseguradora ({response, request}:HttpContextContract){
  //   try {
  //     const aseguradoraIn:any  = request.all()
  //     const aseguradora = await this.service.crearAseguradora(aseguradoraIn)
  //     return response.created(aseguradora)
  //   } catch (error) {
  //     return response.badRequest(error.messages)
  //   }

  // }
  // public async actualizarAseguradoraAll ({response, request}:HttpContextContract){
  //   try {
  //     const aseguradoraIn: any = request.all()
  //     const aseguradora = await this.service.actualizarAseguradoraAll(aseguradoraIn)
  //     return response.created(aseguradora)
  //   } catch (error) {
  //     return response.badRequest(error.messages)
  //   }
  // }
  // public async eliminarAseguradora ({response, params}:HttpContextContract){
  //   const id = params.id
  //   if(!id){
  //     return response.status(400).send({message:'El Id es necesario'});
  //   }
  //   await this.service.eliminarAseguradora(id)
  //   return response.status(400).send({message:'Eliminada correctamente'});
  // }

}
