class Gestionador {
    private vista: Vista = new Vista("contenedorApp");
    private clientes: Cliente[] = [];

    public guardar(cliente: Cliente):void{
        fetch('./php/guardar.php',{
            method:'POST',
            body: cliente.json(),
            headers:{
                'Content-type': 'aplication/json'
            }
        }).then(resolve =>{ return resolve.json() })
        .then(response => {
            if(response.proceso){
                this.mostrarNotificacion('exito', response.mensaje)
                this.vista.mostrarEn("#datosClientes",cliente.modeloInterfaz());
                Vista.elementoHTMLConId("datos").reset();
                this.clientes.push(cliente);
            }else {
                this.mostrarNotificacion('error',response.mensaje);
            }
        }).catch(error=>{
            this.mostrarNotificacion('error',"No se puede acceder a servidor");
        })
    }

    private mostrarNotificacion(tipo : string, mensaje : string) :void{
        let notificacion :Notificacion = new Notificacion(tipo,mensaje);
        this.vista.mostrarEn("#notificacion",notificacion.modeloInterfaz());
        this.vista.eliminarConTime(3000,'#tarjetaNotificacion');
    }

    public eliminar():void {

    }

    public editar():void{
        
    }

    public buscar():void{

    }
}

class Cliente{

    private cedula: string;
    private nombres: string;
    private direccion: string;
    private telefono: string;
    private email: string;

    constructor(cedula: string, nombres: string, direccion: string, telefono: string, email:string){
        this.cedula = cedula;
        this.nombres = nombres;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email; 
    }

    public modeloInterfaz(): string{
        return ` <tr>
        <td>${this.cedula}</td>
        <td>${this.nombres}</td>
        <td>${this.direccion}</td>
        <td>${this.telefono}</td>
        <td>${this.email}</td>
        <td><i class="material-icons">edit</i> <i class="material-icons">delete</i></td>
      </tr>`
    }

    public json():string {
        let cliente = {
            cedula : `${this.cedula}`,
            nombres : `${this.nombres}`,
            direccion : `${this.direccion}`,
            telefono : `${this.telefono}`,
            email: `${this.email}`
        }
        return JSON.stringify(cliente);
    }

}


class Notificacion {
    private tipo: string;
    private mensaje: string;
    private icono: string;
    private fondo: string;
    private tituloMensaje : string;

    constructor(tipo : string ,mensaje : string) {
        this.tipo = tipo;
        this.fondo = "light-green darken-1"
        this.icono = "beenhere";
        this.mensaje = mensaje;
        this.tituloMensaje = "Proceso ejecutado : "
    }

    private esSatisfactorio():boolean{
        return this.tipo === "exito";
    }

    public modeloInterfaz():string{
        if(!this.esSatisfactorio()){
            this.icono = "warning";
            this.fondo = "orange darken-2";
            this.tituloMensaje = "Error : "
        }
        return `<ul class="collapsible" data-collapsible="accordion" id="tarjetaNotificacion">
        <li>
          <div class="collapsible-header ${this.fondo}"><i class="material-icons">${this.icono}</i>${this.tituloMensaje}${this.mensaje}</div>
        </li>
      </ul>`
    }
}

class Vista{

    private contenedor: HTMLElement;

    constructor(contenedor: string){
        this.contenedor = Vista.elementoHTMLConId(contenedor);
    }

    public static elementoHTMLConId(id:string):HTMLElement{
        return document.getElementById(id);
    }

    public static elementoHTMLConQuery(selector: string):HTMLElement{
        return document.querySelector(selector);
    }

    public mostrarEn(id : string , estructuraElemento : string):void{
        this.contenedor.querySelector(`${id}`).innerHTML += estructuraElemento;
    }

    public mostrar(estructuraElemento: string):void{
        this.contenedor.innerHTML += estructuraElemento;
    }

    public eliminar(id : number):void{
        Vista.elementoHTMLConId(`${id}`).remove();
    }

    public eliminarConQuery(selector: string):void{
        Vista.elementoHTMLConQuery(selector).remove();
    }

    public eliminarConTime(segundos: number, nombreElemento: string):void{
        setTimeout(() => {
            this.eliminarConQuery(nombreElemento);
        }, segundos);
    }

}

let form : HTMLElement = document.getElementById("datos");

let gestionador : Gestionador  = new Gestionador();

form.addEventListener("submit",guardar);

function guardar(event){
    event.preventDefault();
    let cedula : string = document.getElementById("cedula").value.toString();
    let nombres : string = document.getElementById("nombres").value.toString();
    let direccion : string = document.getElementById("direccion").value.toString();
    let telefono: string = document.getElementById("telefono").value.toString();
    let email: string = document.getElementById("email").value.toString();
    gestionador.guardar(new Cliente(cedula, nombres, direccion, telefono, email));
}
