import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ServicioExportacion } from 'App/Dominio/Datos/Servicios/ServicioExportacion';
import { ServicioPoliza } from 'App/Dominio/Datos/Servicios/ServicioPoliza';
import { RepositorioPolizaDB } from 'App/Infraestructura/Implementacion/Lucid/RepositorioPolizaDB';
/* 
const data = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' },
  // Otros elementos del arreglo
];
 */
export default class ControladorExportacion {
  private servicioExportacion = new ServicioExportacion();
  private servicioPoliza = new ServicioPoliza(new RepositorioPolizaDB())
  /* public async exportToXLSX({ response }: HttpContextContract) {
    const cabeceras = [
      { header: 'ID', key: "id", width: 40 },
      { header: 'NIT', key: "nit", width: 40 },
      { header: 'RAZON SOCIAL', key: "razonSocial", width: 40 },
      { header: 'ACCESO', key: "acceso", width: 40 },
      { header: ' CANTIDAD CONDUCTORES', key: "cantConductores", width: 40 },
      { header: 'CANTIDAD  VEHÍCULOS', key: "cantVehiculos", width: 40 },
      { header: 'CLASIFICACIÓN SEGÚN RESOLUCIÓN 20223040040595 DE 2022', key: "clasificacion", width: 40 },
      { header: 'INICIO DILIGENCIAMIENTO ', key: "inicioDiligenciamiento", width: 40 },
      { header: 'ENVIÓ LA INFORMACIÓN A LA ST ', key: "envioSt", width: 40 },
      { header: 'ESTADO', key: "estadoActual", width: 40 },
      { header: 'LIDER(administrador que asigno)', key: "asignador", width: 40 },
      { header: 'FECHA HORA ', key: "fechaAsignacion", width: 40 },
      { header: 'VALIDADOR', key: "validador", width: 40 },
      { header: 'PENDIENTE ', key: "pendiente", width: 40 },
      { header: 'EN PROCESO ', key: "proceso", width: 40 },
      { header: 'VALIDADO ', key: "validado", width: 40 },]


 const data = await this.reporteTrazabilidad.Trazabilidad();

 return data
    
  }
 */
  

  public async vehiculosToXLSX({ request, response }: HttpContextContract) {
const  id  = '0'
const parametros = request.all()
parametros.pagina = undefined
parametros.limite = 10000000000

const data = await this.servicioPoliza.obtenerVehiculos(request.all(), id)

const cabeceras = [
  { header: 'NIt', key: 'nit', width: 20 },
  { header: 'Razón social', key: 'razon_social', width: 50 },
  { header: 'Tipo', key: 'tipo', width: 50 },
  { header: 'Número de póliza', key: 'numero_poliza', width: 20 },
  { header: 'Placa', key: 'placa', width: 20 },
  { header: 'Pasajeros', key: 'pasajeros', width: 20 },
]
const buffer = await this.servicioExportacion.encuestaToXLSX(data.placas, cabeceras)

    // Configurar opciones de respuesta
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.header('Content-Disposition', 'attachment; filename=datos.xlsx');

    // Enviar el archivo XLSX como respuesta
    response.send(buffer);
    //response.send(await this.reporteTrazabilidad.Encuesta(idReporte))
       
     }
}
