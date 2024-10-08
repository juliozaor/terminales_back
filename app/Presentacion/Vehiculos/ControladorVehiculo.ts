import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ServicioImportarVehiculos } from "App/Dominio/Datos/Servicios/ServicioImportarVehiculos";
import fs from "fs";
const path = require("path");

export default class Controladorvehiculo {
  private servicioImportacionVehiculos: ServicioImportarVehiculos;
  constructor() {
    this.servicioImportacionVehiculos = new ServicioImportarVehiculos();
  }
  async descargarPlantilla({ params }: HttpContextContract) {
    const { archivo } = params;
    const relativePath = "uploads/plantillas/";
    if (archivo) {
      try {
        const absolutePath = path.resolve(`${relativePath}${archivo}`);
        console.log(absolutePath);

        let archivoDescargar = fs.readFileSync(`${absolutePath}`, "base64");
        return archivoDescargar;
      } catch (error) {
        return {
          mensaje: `No se encontro el archivo solicitado`,
          error,
        };
      }
    }
  }

  public async importar({ request, response }: HttpContextContract) {
    const archivo = request.file("archivo", {
      extnames: ["xlsx"],
    });
    if (!archivo) {
      return response.status(400).send({ mensaje: "No se encontró archivo" });
    }
    
    // Limpiar el nombre del archivo de caracteres especiales
const nombreArchivoLimpio = archivo.clientName.replace(/[^\w.-]/g, '_');

// Validar la extensión del archivo después de limpiar su nombre
if (!nombreArchivoLimpio.toLowerCase().endsWith(".xlsx")) {
  return response.status(415).send({
    mensaje: `Formato inválido: no se puede cargar el archivo seleccionado. Inténtalo nuevamente, los tipos de archivo permitidos son '.xlsx'`,
  });
}

    const { poliza, tipo } = request.all();
    
    if (!poliza || !tipo) {
      return response.status(400).send({ mensaje: "La póliza y el tipo son requeridos" });
    }
    const { id } = await request.obtenerPayloadJWT();
    try {
      const respuesta = await this.servicioImportacionVehiculos.importDataXLSX(
        archivo, poliza, id, tipo
      );
    
      return response.status(respuesta.estado).send(respuesta.datos ?? { mensaje: respuesta.mensaje });
    } catch (error) {
      return response.status(400).send({ mensaje: "Se presentó un error al cargar el archivo" });
    }
  }
}
