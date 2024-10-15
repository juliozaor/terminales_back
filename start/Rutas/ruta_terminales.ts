/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Terminales/ControladorTerminales'


Route.group(() => {
  Route.get('/visualizar-rutas', accion_path + '.visualizarRutas')
  Route.get('total-rutas', accion_path + '.numeroTotalRutasPorUsuario')
  Route.get('/visualizar-paradas', accion_path + '.visualizarParadasPorRuta')
  Route.get('/visualizar-clases', accion_path + '.visualizarClasesPorRuta')
}).prefix('api/v1/terminales').middleware('autenticacionJwt')
