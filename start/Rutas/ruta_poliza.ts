
import Route from '@ioc:Adonis/Core/Route'
const accion_path = '../../../app/Presentacion/Poliza/ControladorPoliza'

Route.group(() => {
  Route.get('', accion_path + '.visualizar')
  Route.get('/vehiculos', accion_path + '.obtenerVehiculos')
  Route.post('', accion_path + '.guardar')
  Route.post('/capacidades', accion_path + '.capacidad')

    // fase 2

    Route.get('/listar_polizas', accion_path + '.listarPolizas')
    Route.get('/listar_vehiculos', accion_path + '.listarVehiculos')
    Route.get('/interoperabilidad', accion_path + '.interoperabilidad')
    Route.delete('/eliminar_vehiculos', accion_path + '.eliminarVehiculos')
    Route.post('/agregar_vehiculos', accion_path + '.agregarVehiculos')

    Route.get('/novedades_poliza', accion_path + '.novedadesPoliza')
    Route.get('/gestionar-placa', accion_path + '.gestionarPlaca')
    Route.patch('/desvincular-placa', accion_path + '.desvincularPlaca')

}).prefix('api/v1/poliza').middleware('autenticacionJwt')
