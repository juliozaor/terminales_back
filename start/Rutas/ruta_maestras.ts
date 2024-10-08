import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Maestra/ControladorMaestra'

Route.group(() => {
  Route.get('departamentos', accion_path + '.departamentos')
  Route.get('municipios', accion_path + '.municipios')
  Route.get('centros-poblados', accion_path + '.centrosPoblados')
}).prefix('api/v1/maestras').middleware('autenticacionJwt')
