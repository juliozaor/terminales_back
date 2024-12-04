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


Route.group(() => {
  Route.get('listar-direcciones', accion_path + '.listarNodos')
  Route.get('listar-empresas', accion_path + '.listarEmpresas')
  Route.get('listar-rutas', accion_path + '.listarRutas')
  Route.get('/rutas-activas-empresa', accion_path + '.rutasActivasPorEmpresa')
  Route.get('/rutas-empresas', accion_path + '.rutasEmpresas')
  Route.get('/consultar-ruta', accion_path + '.ConsultarRuta')
  Route.get('/empresas', accion_path + '.listarEmpresasPorRuta')
  Route.get('/rutas-codigo', accion_path + '.rutasPorCodigo')
  Route.get('/terminal-ruta', accion_path + '.terminalRuta')


}).prefix('api/v1/maestras').middleware('autorizacion')


Route.group(() => {
  Route.get('listarDepartamentos', accion_path + '.departamentos')
  Route.get('listarMunicipios', accion_path + '.municipios')
  Route.get('listarEmpresas', accion_path + '.consultarEmpresas')
}).prefix('api/v1/maestras')
