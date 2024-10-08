import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import TblModalidades from "App/Infraestructura/Datos/Entidad/Modalidades";

export default class extends BaseSeeder {
  public async run() {
    await TblModalidades.createMany([
      {
        id: 1,
        nombre: "Pasajeros por carretera (PC)",        
      },{
        id: 2,
        nombre: "Transporte especial (ES)",        
      },{
        id: 3,
        nombre: "Empresa de transporte mixto (MX)",        
      }
    ]);
  }
}
