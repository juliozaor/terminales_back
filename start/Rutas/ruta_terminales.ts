/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/terminales/ControladorTerminales'


Route.group(() => {
  Route.get('/visualizar-rutas', accion_path + '.visualizarRutas')
}).prefix('api/v1/terminales').middleware('autenticacionJwt')
