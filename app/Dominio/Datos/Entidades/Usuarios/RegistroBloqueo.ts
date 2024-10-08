import { DateTime } from "luxon";

export class RegistroBloqueo{

    private readonly cantidadMaximaIntentos = 3

    private _id:string;

    private _identificacion:string;

    private _intentos:number;

    private _bloqueado:boolean;

    private _ultimoIntento:DateTime | null;

    private _creacion:DateTime;
    
    private _actualizacion:DateTime;

	constructor(id: string, identificacion: string, intentos: number, bloqueado: boolean, ultimoIntento?: DateTime | null, creacion?:DateTime, actualizacion?:DateTime) {
		this._id = id;
		this._identificacion = identificacion;
		this._intentos = intentos;
		this._bloqueado = bloqueado;
		this._ultimoIntento = ultimoIntento ?? null;
        this._creacion = creacion ?? DateTime.now()
        this._actualizacion = actualizacion ?? DateTime.now()
	}

    public elUsuarioEstaBloqueado():boolean{
        return this._bloqueado
    }

    public resetearIntentosFallidos():void{
        this._intentos = 0
        this._actualizacion = DateTime.now()
    }

    public agregarIntentoFallido():void{
        this._intentos ++;
        if(this._intentos >= this.cantidadMaximaIntentos){
            this.bloquearUsuario()
        }
        this._ultimoIntento = DateTime.now()
        this._actualizacion = DateTime.now()
    }

    public bloquearUsuario():void{
        this._bloqueado = true
        this._actualizacion = DateTime.now()
    }

    public desbloquearUsuario():void{
        this._bloqueado = false
        this._intentos = 0
        this._actualizacion = DateTime.now()
    }

	public get id(): string {
		return this._id;
	}

	public get identificacion(): string {
		return this._identificacion;
	}

	public get intentos(): number {
		return this._intentos;
	}

	public get bloqueado(): boolean {
		return this._bloqueado;
	}

	public get ultimoIntento(): DateTime | null {
		return this._ultimoIntento;
	}

	public get creacion(): DateTime {
		return this._creacion;
	}
    
	public get actualizacion(): DateTime {
		return this._actualizacion;
	}
    
}