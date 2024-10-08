import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import TblTiposPolizas from "App/Infraestructura/Datos/Entidad/TiposPoliza";

export default class extends BaseSeeder {
  public async run() {
    await TblTiposPolizas.createMany([
      {
        id: 1,
        nombre: "RCC",
        descripcion:'RESPONSABILIDAD CIVIL CONTRACTUA',
        orden: 1,
      },
      {
        id: 2,
        nombre: "REC",
        descripcion:'RESPONSABILIDAD CIVIL EXTRACONTRACTUAL',
        orden: 2,
      },
    ]);
  }
}
