import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import TblAseguradoras from "App/Infraestructura/Datos/Entidad/Aseguradoras";

export default class extends BaseSeeder {
  public async run() {
    await TblAseguradoras.createMany([
      {
        id: 1,
        nit: 100100,
        nombre: "Aseguradora 1",  
        direccion: "call 27 J"      
      },{
        id: 2,
        nit: 200200,
        nombre: "Aseguradora 2",  
        direccion: "call 39 o"      
      },{
        id: 3,
        nit: 300300,
        nombre: "Aseguradora 3",  
        direccion: "Carrera 33 T"      
      }
    ]);
  }
}
