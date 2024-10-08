
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import FormData from 'form-data';
import Env from '@ioc:Adonis/Core/Env';

export default class ControladorArchivo {


  public async archivos ({ request, response }:HttpContextContract) {
   
    const host = Env.get('URL_SERVICIO_ARCHIVOS')
    const rutaRaiz = 'polizas';
    const ruta = 'archivos';
    const endpoint = `/api/v1/${ruta}`
    const archivo = request.file('archivo', {
      extnames: ['pdf'],
    })
    const { documento } = await request.obtenerPayloadJWT()
    if (!archivo) {
      return response.status(400).send({
        mensaje: 'No se encontro el archivo'
      })
    }

    if (!archivo.isValid) {
      return response.status(415).send({ mensaje: `Formato inválido: no se puede cargar el archivo seleccionado. Inténtalo nuevamente, el tipo de archivo permitido es '.pdf'` })
    }

    const fs = require('fs');
    const path = require('path');
    
    const archivoTemporal = path.resolve(archivo.tmpPath);
    
    const formData = new FormData();
    formData.append('archivo', fs.createReadStream(archivoTemporal), {
      filename: archivo.clientName,
      contentType: archivo.headers['content-type'],
    });
    
    formData.append('idVigilado', documento);
    formData.append('rutaRaiz', rutaRaiz);
    
    const headers = {
      'Authorization': `Bearer d4a32a3b-def6-4cc2-8f77-904a67360b53`,
      ...formData.getHeaders(),
    };
    
    try {
      const respuesta = await axios.post(`${host}${endpoint}`, formData, { headers });
      return respuesta.data;
    } catch (error) {
      console.log(error);
      
      console.error('Error en la solicitud:', error.message);
    }

  }



}
