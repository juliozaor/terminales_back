import { TblActualEstados } from "App/Infraestructura/Datos/Entidad/ActualEstados"
import TblEstadosEnviados from "App/Infraestructura/Datos/Entidad/EstadosEnviados"
import { TblLogEstados } from "App/Infraestructura/Datos/Entidad/LogEstados"

export class ServicioEstados {

  public async EnviadosSt(vigilado: string,estado: number) {
    //Validar si ya existe el log
    
    const exiteEstado = await TblEstadosEnviados.query().where(
      {
        'env_estado': estado,
        'env_vigilado_id': vigilado
      })
      .first()


    if (!exiteEstado) {
      const enviado = new TblEstadosEnviados()
      enviado.estado = estado
      enviado.vigiladoId = vigilado
      await enviado.save()
    }

  }

  public async Log(vigiladoId: string, estadoId: number) {
    console.log("entro: ",vigiladoId, estadoId);
    
    const existe = await TblLogEstados.query().where(
     {'tle_vigilado_id': vigiladoId, 'tle_estado_id': estadoId}).first()
     console.log({existe});
     
       if (!existe) {
        console.log('no extite');
        try {
          
          const logEstados = new TblLogEstados()
          logEstados.vigiladoId = vigiladoId
          logEstados.estadoId = estadoId
          await logEstados.save()
  
          this.estadoReporte(vigiladoId,estadoId) 
        } catch (error) {
          console.log(error);
          
        }
 
       }      
 
   }
 
 
 
   public async estadoReporte(vigiladoId: string, estadoId: number) {
     
     const existe = await TblActualEstados.query().where(
       {'tae_vigilado_id': vigiladoId}).first()
         if (!existe) {
           console.log("no existe ", estadoId);
           
           const logEstados = new TblActualEstados()
           logEstados.vigiladoId = vigiladoId
           logEstados.estadoId = estadoId
           await logEstados.save()
         }else{
           console.log("existe ", estadoId);
 
           existe.estadoId = estadoId
           await existe.save()
         }
        } 


  


}
