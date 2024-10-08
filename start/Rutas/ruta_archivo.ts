import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Archivos/ControladorArchivo'

Route.group(() => {
  Route.post('/', accion_path + '.archivos')
}).prefix('api/v1/archivos').middleware('autenticacionJwt')
