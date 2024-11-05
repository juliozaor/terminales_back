/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Terminales/ControladorTerminales'


Route.group(() => {
  Route.get('/visualizar-rutas', accion_path + '.visualizarRutas')
  Route.get('total-rutas', accion_path + '.numeroTotalRutasPorUsuario')
  Route.get('/visualizar-paradas', accion_path + '.visualizarParadasPorRuta')
  Route.get('/visualizar-clases', accion_path + '.visualizarClasesPorRuta')
  Route.post('/crear-direccion', accion_path + '.guardarDireccion')
  Route.post('/guardar-ruta', accion_path + '.guardarRuta')
  Route.post('/guardar-parada', accion_path + '.guardarParada')
  Route.post('/guardar-clase', accion_path + '.guardarClase')
  Route.patch('/guardar', accion_path + '.guardar')
  Route.post('/enviar-st', accion_path + '.enviarSt')
  Route.get('/visualizar-solicitudes', accion_path + '.visualizarSolicitudes')
}).prefix('api/v1/terminales').middleware('autenticacionJwt')
