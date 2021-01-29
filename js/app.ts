class Gestionador {
    private vista: Vista = new Vista("contenedorApp");

    public guardar(cedula:string, nombres: string, direccion: string, telefono:string, email:string):void{
        
        if(Cliente.cedulaValida(cedula)){
            let cliente : Cliente = new Cliente(cedula, nombres, direccion, telefono, email);
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
                }else {
                    this.mostrarNotificacion('error',response.mensaje);
                }
                Vista.elementoHTMLConId("datos").reset();
            }).catch(error=>{
                this.mostrarNotificacion('error',"No se puede acceder a servidor");
            })
        }else{
            this.mostrarNotificacion('error',"Cedula invalida");
        }
    }

    private mostrarNotificacion(tipo : string, mensaje : string) :void{
        let notificacion :Notificacion = new Notificacion(tipo,mensaje);
        this.vista.mostrarEn("#notificacion",notificacion.modeloInterfaz());
        this.vista.eliminarConTime(3000,'#tarjetaNotificacion');
    }

    private crearContenedor():void {
        this.vista.eliminarConQuery('#datosClientes');
        let datosClientes = document.createElement('tbody');
        datosClientes.setAttribute('id', 'datosClientes');
        document.getElementById('tablaClientes').appendChild(datosClientes);
    }

    public eliminar(cedula : string):void {
        fetch('./php/eliminar.php',{
            method: "POST",
            body: JSON.stringify(cedula),
            headers: {
                'Content-type' : 'application/json'
            }
        }).then(resolve => {return resolve.json()})
        .then(response=>{
            if(response[0].proceso){
                this.mostrarNotificacion('exito',response[0].respuesta);
                Vista.elementoHTMLConQuery(`[data-ced = '${cedula}`).parentElement.remove();
            }else{
                this.mostrarNotificacion('error',response[0].respuesta);
            }
        }).catch(error =>{
            this.mostrarNotificacion('error','Error del servidor');
        })
    }

    public editar(cliente: Cliente):void{
        fetch('./php/editar.php',{
            method:'POST',
            body: cliente.json(),
            headers: {
                'Content-type' : 'application/json'
            }
        }).then(resolve => {return resolve.json()})
        .then(response => {
            if(response){
                document.querySelector(`[data-ced = '${response[0].respuesta[0].cedula}' ]`).parentElement.remove();
                let cliente = response[0].respuesta[0];
                this.vista.mostrarEn('#datosClientes', new Cliente(cliente.cedula, 
                cliente.nombre, cliente.direccion, cliente.telefono, cliente.email).modeloInterfaz());
                this.mostrarNotificacion('exito','Datos editados correctamente');
                Vista.elementoHTMLConId('datos').reset();
                let btnGuardar = Vista.elementoHTMLConId('btnGuardar');
                btnGuardar.innerHTML = `Guardar
                <i class="material-icons right">send</i>`;
                btnGuardar.attributes[3].value = "1";
                Vista.elementoHTMLConId('cedula').disabled = false;

            }else{
                this.mostrarNotificacion('error',response.respuesta);
            }
        })
        .catch(error=>{
            this.mostrarNotificacion('error',"Error de conexiòn con el servidor");
        })
    }

    public obtenerCliente(cedula: string){
        Vista.elementoHTMLConId('btnGuardar').textContent = "Editar";
        fetch('./php/consultar.php',{
            method:'POST',
            body: JSON.stringify({'cedula_cli':`${cedula}`}),
            headers: {
                'Content-type' : 'application/json'
            }
        }).then(resolve=>{return resolve.json()})
        .then(response => {
            if(response[0].proceso){
                let cliente = response[0].respuesta[0];
                this.mostrarContenidoEnInputs(cliente);
            }else{
                this.mostrarNotificacion('error',response[0].respuesta);
            }
        })
        .catch(error => {this.mostrarNotificacion('error','error de conexion con servidor');})
    }

    
    private mostrarContenidoEnInputs(cliente : Object):void{
        let label : HTMLElement;
        let input: HTMLElement;
        for (const propiedad in cliente) {
            input = Vista.elementoHTMLConId(`${propiedad}`);
            if(propiedad == "cedula"){
                input.disabled = true;
            }
            input.value = cliente[propiedad];
            label = Vista.elementoHTMLConQuery(`[for='${propiedad}']`);
            label.setAttribute('class','active');
        };

    }

    public buscar(condicionBusqueda:any):void{
        if(condicionBusqueda !== ""){
            let dato: string = "cedula";
            if(isNaN(condicionBusqueda)){
                dato = "nombre";
            }
            fetch("./php/buscar.php",{
                method : 'POST',
                body : JSON.stringify({
                    'condicion' : condicionBusqueda,
                    'dato' : `${dato}`
                }),
                headers : {
                    'Content-Type' : 'application/json'
                }
            }).then(resolve => {return resolve.json()})
            .then((response)=>{
                if(response[0].proceso){
                    this.crearContenedor();
                    if(response[0].respuesta.length !=0){
                        response[0].respuesta.forEach(cliente => {
                            this.vista.mostrarEn('#datosClientes',new Cliente(cliente.cedula, cliente.nombre, cliente.direccion,
                                cliente.telefono, cliente.email).modeloInterfaz()); 
                        });
                    }else{
                        this.vista.mostrarEn('#datosClientes',`<tr>
                        <td colspan="6" class="center-align">No hay coincidencias</td>
                      </tr>`);
                    }
                }else{
                    this.mostrarNotificacion('error',response);
                }                
            })
            .catch((error)=>{
                this.mostrarNotificacion('error','error al cosultar');
            });

        }else{
            this.crearContenedor();
            this.listar();
        }
    }

    public listar():void{
        fetch('./php/lista.php',{
            method: 'GET'
        }).then(resolve=>{return resolve.json()})
        .then(response => {
            response.forEach(cliente => {
                this.vista.mostrarEn('#datosClientes',new Cliente(cliente.cedula, cliente.nombre, cliente.direccion,
                    cliente.telefono, cliente.email).modeloInterfaz()); 
            });
        }).catch(error=>{
            this.mostrarNotificacion("error","error conexion con servidor");
        })
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

    public static cedulaValida(cedula : string):boolean{
        let arrayCedula:string[] = cedula.split("");
        let valida = false;
        if(arrayCedula.length == 10){
            let codigoProvincia = parseInt(arrayCedula[0]) * 10 + parseInt(arrayCedula[1]);
            if(codigoProvincia >= 1 && codigoProvincia <= 24){
                if(parseInt(arrayCedula[2]) >= 0 && parseInt(arrayCedula[2]) <= 6){
                    let arrayImpar = [];
                    let arrayPar = [];
                    for (let index = 1; index <= arrayCedula.length-1; index+= 2) {
                        if(index != 9){
                            arrayPar.push(parseInt(arrayCedula[index]));
                        }
                        arrayImpar.push(parseInt(arrayCedula[index-1]));
                    }
                    let sumaImpar = 0;
                    for (let index = 0; index < arrayImpar.length; index++) {
                        let multImpar = arrayImpar[index]*2
                        if( multImpar > 9){
                            sumaImpar += multImpar - 9;
                        }else{
                            sumaImpar += multImpar
                        }
                    }
                    let sumaPar = 0;
                    for (let index = 0; index < arrayPar.length; index++) {
                        sumaPar += arrayPar[index];
                    }
                    let digitoVerificador = (sumaPar+sumaImpar)%10;
                    console.log(arrayPar , arrayImpar);
                    if(digitoVerificador == 0){
                        digitoVerificador = 0;
                    }else{
                        digitoVerificador = 10 - digitoVerificador;
                    }
                    
                    if(digitoVerificador == parseInt(arrayCedula[arrayCedula.length -1])){
                        valida = true;
                    }
                }
            }
        }
        return valida;
    }

    public modeloInterfaz(): string{
        return `<tr>
        <td>${this.cedula}</td>
        <td>${this.nombres}</td>
        <td>${this.direccion}</td>
        <td>${this.telefono}</td>
        <td>${this.email}</td>
        <td data-ced = "${this.cedula}"><i class="material-icons iconOperacion editar">edit</i> <i class="red-text material-icons iconOperacion eliminar">delete</i></td>
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



document.addEventListener('DOMContentLoaded',cargarClientes);

function cargarClientes(){
    let gestionador : Gestionador  = new Gestionador();
    gestionador.listar();

    let form : HTMLElement = document.getElementById("datos");

    form.addEventListener("submit",enviarDatos);
    //1 = guardar cliente
    //2 = editar cliente
    function enviarDatos(event){
        event.preventDefault();
        let cedula : string = document.getElementById("cedula").value.toString();
        let nombres : string = document.getElementById("nombre").value.toString();
        let direccion : string = document.getElementById("direccion").value.toString();
        let telefono: string = document.getElementById("telefono").value.toString();
        let email: string = document.getElementById("email").value.toString();
        if(Vista.elementoHTMLConId("btnGuardar").dataset.proceso == "1"){
            gestionador.guardar(cedula, nombres, direccion, telefono, email);
        }else{
            gestionador.editar(new Cliente(cedula,nombres, direccion,telefono,email));
        }
    }

    let cedula = document.getElementById("search");
    let dataCedula : string;

    cedula.addEventListener("keyup",()=>{
        gestionador.buscar(cedula.value);
    })

    function cambiarDataProceso(valor : string):void{
        Vista.elementoHTMLConId("btnGuardar").dataset.proceso = valor;
    }

    document.getElementById("tablaClientes").addEventListener('click',(event)=>{
        const elemento = event.target;
        if(elemento.classList.contains('editar')){
            cambiarDataProceso("2");
            gestionador.obtenerCliente(elemento.parentElement.dataset.ced);
        }else if(elemento.classList.contains('eliminar')){
            gestionador.eliminar(elemento.parentElement.dataset.ced);
        }
    })
}

