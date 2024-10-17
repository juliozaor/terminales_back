import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Maestra/ControladorMaestra'

Route.group(() => {
  Route.get('departamentos', accion_path + '.departamentos')
  Route.get('municipios', accion_path + '.municipios')
  Route.get('centros-poblados', accion_path + '.centrosPoblados')
  Route.get('tipo-llegada', accion_path + '.tipoLlegada')
  Route.get('tipo-vehiculo', accion_path + '.tipovehiculo')
  Route.get('clase-grupo', accion_path + '.clasePorGrupo')
  Route.get('direcciones', accion_path + '.nodos')
}).prefix('api/v1/maestras').middleware('autenticacionJwt')
