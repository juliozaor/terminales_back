import Excel from 'exceljs';
import fs from 'fs';
import * as path from 'path';
import csv from 'csv-stringify'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import { Resultado } from 'App/Dominio/Resultado';
import { ErrorFormatoImportarExcel } from './Dtos/ErrorFormatoImportarExcel';
import { RespuestaImportacionExcel } from './Dtos/RespuestaImportacionExcel';
import TblVehiculos from 'App/Infraestructura/Datos/Entidad/Vehiculos';
import { Vehiculo } from '../Entidades/Vehiculo';
import TblPolizas from 'App/Infraestructura/Datos/Entidad/poliza';
import { TblLogVehiculos } from 'App/Infraestructura/Datos/Entidad/LogVehiculos';

export class ServicioImportarVehiculos {
  async importDataXLSX(
    archivo: MultipartFileContract,
    poliza: number,
    id:string,
    tipo:number
  ): Promise<Resultado<RespuestaImportacionExcel>> {
    let rutaArchivo;
    try {


     /*  const polizaDBExiste = await TblPolizas.findBy('pol_numero', poliza); */
     const polizaDBExiste = await TblPolizas.query()
      .where("pol_numero", poliza)
      .andWhere("pol_tipo_poliza_id", tipo)
      .first();
        
      if (polizaDBExiste) {      
        return new Resultado({
          estado: 500,
          mensaje: `La poliza'${poliza}', ya fue registrada anteriormente`,
          exitoso: false
        });
      }

      await TblVehiculos.query().where('veh_poliza',poliza).andWhere('veh_tipo_poliza',tipo).delete();      
      await TblLogVehiculos.query().where('lov_poliza',poliza).andWhere('lov_tipo_poliza',tipo).delete();  

      const fname = `${new Date().getTime()}.${archivo.extname}`;
      const dir = 'uploads/';

      // Mueve el archivo cargado a la carpeta 'uploads' en la raíz del proyecto
      await archivo.move(path.resolve(dir), {
        name: fname
      });

  /*     if (!archivo.isValid) {
        console.log('Error al mover el archivo');
        return new Resultado({
          estado: 500,
          mensaje: 'Error al mover el archivo',
          exitoso: false
        });
      } */

      const filePath = path.resolve(`${dir}${fname}`);
      rutaArchivo = filePath;

      
      let resultado = await this.importVehiculos(filePath, poliza, id, tipo)
      return resultado
    } catch (error) {
      console.error(error);
      return new Resultado({
        estado: 500,
        mensaje: 'Error del servidor',
        exitoso: false
      });
    } finally {
      // Eliminar el archivo, independientemente del resultado
      if (rutaArchivo) {
        try {
          await fs.promises.unlink(rutaArchivo);
          console.log('Archivo eliminado exitosamente.');
        } catch (unlinkError) {
          console.error('Error al eliminar el archivo:', unlinkError);
        }
      }
    }
  }

  async importVehiculos(filelocation, poliza: number, id:string, tipo:number): Promise<Resultado<RespuestaImportacionExcel>> {
    let resultado: Resultado<ErrorFormatoImportarExcel[]>
    let libro = new Excel.Workbook()
    libro = await libro.xlsx.readFile(filelocation)
    let hoja = libro.getWorksheet('Hoja1')! // get sheet name
    if(!hoja){
      return new Resultado({
        estado: 500,
        mensaje: `Verifique la estructura del archivo o descargue nuevamente la plantilla`,
        exitoso: false
      });
    }
    let colComment = hoja.getColumn('A') //column name

   
    
    
      return this.import(colComment, hoja, poliza, id, tipo);
    
    /* return new Resultado({
      estado: 500,
      exitoso: false
    }) */
  }

  async import(colComment: Excel.Column,hoja: Excel.Worksheet, poliza:number, id:string, tipoPoliza:number): Promise<Resultado<RespuestaImportacionExcel>> {
    
    const errores = await this.validarVehiculos(hoja, poliza, id)
    
    if (errores.length > 0) {
      const archivoB64 = await this.generarCsvErrores(errores)
      return new Resultado({
        exitoso: false,
        estado: 422,
        datos: { errores, archivo: archivoB64 },
        mensaje: 'Hay errores de validación.'
      })
    }

    
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        
        const placa = hoja.getCell('A' + rowNumber).value!.toString().toUpperCase();
        const pasajeros = parseInt(hoja.getCell('B' + rowNumber).value!.toString())
        if (placa !== '') {
          //custom field name in database to variable
          const inputPlaca: Vehiculo = {
            placa,
            pasajeros,
            poliza,
            vigiladoId:id,
            tipoPoliza
          }

          const inputlog = {
            tipoPoliza,
            poliza,
            placa,
            vinculada:true,
            vigiladoId:id,
            observacion:'CARGUE INICIAL'
          }



          try {
           // await TblVehiculos.updateOrCreate({ placa: inputPlaca.placa }, inputPlaca)
            await TblVehiculos.create(inputPlaca)
            await TblLogVehiculos.create(inputlog)
          } catch (error) {
            console.log(error);
            
          }
        }
      }
    })
    return new Resultado({
      exitoso: true,
      estado: 200,
      mensaje:'Archivo cargado correctamente'
    })

  }


  async validarVehiculos(hoja: Excel.Worksheet, poliza: number, id:string): Promise<ErrorFormatoImportarExcel[]> {
    let errores: ErrorFormatoImportarExcel[] = [];
  let seEncontroFilaValida = false;

  const rowCount = hoja.rowCount;
  for (let i = 2; i <= rowCount; i++) {
    const fila = hoja.getRow(i);

    const placaCell = fila.getCell('A');
    const pasajerosCell = fila.getCell('B');

    const placa = placaCell ? placaCell.value?.toString().trim() : null;
    const pasajeros = pasajerosCell ? pasajerosCell.value?.toString().trim() : null;

    // Validar existencia de placa
    if (!placa) {
      errores.push({
        columna: 'A',
        fila: i.toString(),
        error: 'Es necesario proporcionar un valor en el campo',
        valor: null
      });
    } else if (placa.length !== 6) {
      errores.push({
        columna: 'A',
        fila: i.toString(),
        error: 'La placa debe tener 6 caracteres.',
        valor: placa
      });
    } else {

      const vehiculos = await TblVehiculos.query()
      .where({'veh_placa': placa, 'veh_vigilado_id':id})
      .preload('polizas')
      .has('polizas')

      vehiculos.forEach(veh => {
        const fechaActual = new Date(); 
        const fecha = new Date(veh.polizas.finVigencia);   

    const hoy = new Date(`${fechaActual.getFullYear()}-${fechaActual.getMonth()+1}-${fechaActual.getDate()}`) 
    const fin = new Date(`${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`)      
        if (fin >= hoy) {
          errores.push({
            columna: 'A',
            fila: i.toString(),
            error: `La placa ya se encuentra registrada en una póliza activa, póliza: ${veh.polizas.numero}` ,
            valor: placa
          });
        }
        
      });
  





      //try {
        // Consultar si la placa existe en la tabla TblVehiculos
       

  /* const vehiculoExistente = await Database.rawQuery(`
  SELECT v.*
  FROM tbl_vehiculos v
  WHERE v.veh_placa = '${placa.toUpperCase()}'
  AND v.veh_poliza <> '${poliza}' 
    AND EXISTS (
      SELECT 1
      FROM tbl_polizas p
      WHERE p.pol_numero = v.veh_poliza
    )
  LIMIT 1
`); */

/* const vehiculoExistente = await Database.rawQuery(`
  SELECT v.*
  FROM tbl_vehiculos v
  WHERE v.veh_placa = '${placa.toUpperCase()}' 
  LIMIT 1
`);
 */
/* const vehiculoExistente = await Database
.from('tbl_vehiculos')
.where('veh_placa', placa.toUpperCase())
.first();

if(vehiculoExistente){
  const polizaExistente = await Database
      .from('tbl_polizas')
      .where('pol_numero', vehiculoExistente.veh_poliza)
      .first();

      if (polizaExistente ) {
        errores.push({
          columna: 'A',
          fila: i.toString(),
          error: 'La placa ya existe en otra poliza.',
          valor: placa
        });
      }
}


 
      } catch (error) {
        console.error('Error al consultar la base de datos:', error);
      } */
    }

    // Validar existencia de pasajeros
    if (!pasajeros) {
      errores.push({
        columna: 'B',
        fila: i.toString(),
        error: 'Es necesario proporcionar un valor en el campo',
        valor: null
      });
    } else if (pasajeros.length > 2) {
      errores.push({
        columna: 'B',
        fila: i.toString(),
        error: 'La cantidad de pasajeros no puede ser superior a 2 caracteres.',
        valor: pasajeros
      });
    }

    if (!seEncontroFilaValida) {
      seEncontroFilaValida = true;
    }
  }

  if (!seEncontroFilaValida) {
    errores.push({
      columna: '',
      fila: '',
      error: 'El archivo no contiene datos o son incorrectos',
      valor: null
    });
  }

  return errores;
  }

  generarCsvErrores(errores: ErrorFormatoImportarExcel[]): Promise<string>{
    const dataCsv: any[][] = []
    const cabeceras = [ "Nro", "Celda", "Detalle" ]
    dataCsv.push(cabeceras)
    errores.forEach( (error, indice) => {
      dataCsv.push([ indice + 1, `${error.columna}${error.fila}`, error.error ])
    })
    return new Promise<string>((resolve, reject) =>{
      csv.stringify(dataCsv, {header: false}, (error, ouput)=>{
        if(error){
          reject(error)
        }else{
          resolve(Buffer.from(ouput).toString('base64'))
        }
      })
    })
  }

 

}