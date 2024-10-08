import { Paginador } from '../../../Dominio/Paginador';
import { MapeadorPaginacionDB } from './MapeadorPaginacionDB';
import { RepositorioAseguradora } from 'App/Dominio/Repositorios/RepositorioAseguradora'
import { Aseguradora } from 'App/Dominio/Datos/Entidades/Aseguradora';
import TblAseguradoras from 'App/Infraestructura/Datos/Entidad/Aseguradoras';

export class RepositorioAseguradoraDB implements RepositorioAseguradora {

  async obtenerAseguradoras(param: any): Promise<{aseguradoras: Aseguradora[], paginacion: Paginador}> {
    const aseguradoras: Aseguradora[] = [];
    const { pagina, limite, termino } = param;

    const sql = TblAseguradoras.query();
    if(termino){
      sql.andWhere(subquery => {
        subquery.orWhereRaw("LOWER(ase_nombre) LIKE LOWER(?)", [`%${termino}%`])
      subquery.orWhereRaw("LOWER(ase_direccion) LIKE LOWER(?)", [`%${termino}%`])
      subquery.orWhereRaw("LOWER(CAST(ase_nit AS TEXT)) LIKE LOWER(?)", [`%${termino}%`]);
      })
    }


    const aseguradorasDB = await sql.orderBy("nombre", "asc").paginate(pagina, limite);

    aseguradorasDB.forEach((aseguradorasDB) => {
      aseguradoras.push(aseguradorasDB.obtenerAseguradora());
    });
    const paginacion = MapeadorPaginacionDB.obtenerPaginacion(aseguradorasDB);
    return { aseguradoras, paginacion };
  }

  async obtenerAseguradora(id:number): Promise<Aseguradora> {
    try {
      const aseguradora = await TblAseguradoras.findOrFail(id);
      return aseguradora.obtenerAseguradora();      
    } catch (error) {
      throw new Error("Aseguradora no encontrada");
      
    }
  }


  async crearAseguradora(aseguradora: Aseguradora): Promise<Aseguradora> {
    try {
      
      let aseguradoraDB = new TblAseguradoras();
      aseguradoraDB.estableceAseguradoraConId(aseguradora);
      await aseguradoraDB.save();
      return aseguradoraDB;
    } catch (error) { 
      throw new Error("error al guardar: " + error.detail);
    }
  }

  async actualizarAseguradoraAll(aseguradora:Aseguradora): Promise<Aseguradora> {
    try {
      let aseguradoraDB = await TblAseguradoras.findOrFail(aseguradora.id);
      aseguradoraDB.estableceAseguradoraConId(aseguradora);
      await aseguradoraDB.save();
      return aseguradoraDB;
      
    } catch (error) {
      throw new Error("Aseguradora no esncontrada");
    }
  }

  async eliminarAseguradora(id:number): Promise<{message: string}> {
    try {
      let itemDB = await TblAseguradoras.findOrFail(id);
      await itemDB.delete();
      return {message:'Aseguradora eliminada correctamente'};
      
    } catch (error) {
      throw new Error("Aseguradora no encontrada");
    }
  }


}
