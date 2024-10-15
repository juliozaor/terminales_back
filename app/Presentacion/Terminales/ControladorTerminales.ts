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

  public async numeroTotalRutasPorUsuario({ response, request }: HttpContextContract) {
    const { id } = await request.obtenerPayloadJWT()
      const totalRutas = await this.service.numeroTotalRutasPorUsuario(parseInt(id))
      return response.status(200).send(totalRutas);
  }

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
