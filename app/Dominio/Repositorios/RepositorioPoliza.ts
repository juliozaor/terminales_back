export interface RepositorioPoliza {
  visualizar(datos:any, vigiladoId: string): Promise<any>
  guardar(datos:any, vigiladoId: string): Promise<any>
  capacidad(datos:any, vigiladoId: string): Promise<any>
  obtenerVehiculos(params: any, id:string): Promise<any>

  listarPolizas(datos:any, vigiladoId: string): Promise<any>
  listarVehiculos(datos:any, vigiladoId: string): Promise<any>
  eliminarVehiculos(datos:any, vigiladoId: string): Promise<any>
  agregarVehiculos(datos:any, vigiladoId: string): Promise<any>
  interoperabilidad(datos:any, nit: string, id: string): Promise<any>
  novedadesPoliza(datos:any): Promise<any>
  gestionarPlaca(placa:string, vigiladoId: string): Promise<any>
  desvincularPlaca(id:number, motivo: string): Promise<any>

}


