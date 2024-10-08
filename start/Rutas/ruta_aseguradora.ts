/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Aseguradora/ControladorAseguradora'


Route.group(() => {
  Route.get('/', accion_path + '.obtenerAseguradoras')
  Route.get('/:id', accion_path + '.obtenerAseguradora')
  Route.post('/', accion_path + '.crearAseguradora')
  Route.put('/', accion_path + '.actualizarAseguradoraAll') //all
  Route.delete('/:id', accion_path + '.eliminarAseguradora')
}).prefix('api/v1/aseguradoras').middleware('autenticacionJwt')