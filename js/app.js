var Gestionador = /** @class */ (function () {
    function Gestionador() {
        this.vista = new Vista("contenedorApp");
    }
    Gestionador.prototype.guardar = function (cliente) {
        var _this = this;
        fetch('./php/guardar.php', {
            method: 'POST',
            body: cliente.json(),
            headers: {
                'Content-type': 'aplication/json'
            }
        }).then(function (resolve) { return resolve.json(); })
            .then(function (response) {
            if (response.proceso) {
                _this.mostrarNotificacion('exito', response.mensaje);
                _this.vista.mostrarEn("#datosClientes", cliente.modeloInterfaz());
            }
            else {
                _this.mostrarNotificacion('error', response.mensaje);
            }
            Vista.elementoHTMLConId("datos").reset();
        })["catch"](function (error) {
            _this.mostrarNotificacion('error', "No se puede acceder a servidor");
        });
    };
    Gestionador.prototype.mostrarNotificacion = function (tipo, mensaje) {
        var notificacion = new Notificacion(tipo, mensaje);
        this.vista.mostrarEn("#notificacion", notificacion.modeloInterfaz());
        this.vista.eliminarConTime(3000, '#tarjetaNotificacion');
    };
    Gestionador.prototype.eliminar = function () {
    };
    Gestionador.prototype.editar = function () {
    };
    Gestionador.prototype.buscar = function () {
    };
    Gestionador.prototype.listar = function () {
        var _this = this;
        fetch('./php/lista.php', {
            method: 'GET'
        }).then(function (resolve) { return resolve.json(); })
            .then(function (response) {
            response.forEach(function (cliente) {
                _this.vista.mostrarEn('#datosClientes', new Cliente(cliente.cedula, cliente.nombre, cliente.direccion, cliente.telefono, cliente.email).modeloInterfaz());
            });
        })["catch"](function (error) {
            console.log(error);
        });
    };
    return Gestionador;
}());
var Cliente = /** @class */ (function () {
    function Cliente(cedula, nombres, direccion, telefono, email) {
        this.cedula = cedula;
        this.nombres = nombres;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }
    Cliente.prototype.modeloInterfaz = function () {
        return "<tr>\n        <td>" + this.cedula + "</td>\n        <td>" + this.nombres + "</td>\n        <td>" + this.direccion + "</td>\n        <td>" + this.telefono + "</td>\n        <td>" + this.email + "</td>\n        <td><i class=\"material-icons iconOperacion editar\">edit</i> <i class=\"red-text material-icons iconOperacion eliminar\">delete</i></td>\n      </tr>";
    };
    Cliente.prototype.json = function () {
        var cliente = {
            cedula: "" + this.cedula,
            nombres: "" + this.nombres,
            direccion: "" + this.direccion,
            telefono: "" + this.telefono,
            email: "" + this.email
        };
        return JSON.stringify(cliente);
    };
    return Cliente;
}());
var Notificacion = /** @class */ (function () {
    function Notificacion(tipo, mensaje) {
        this.tipo = tipo;
        this.fondo = "light-green darken-1";
        this.icono = "beenhere";
        this.mensaje = mensaje;
        this.tituloMensaje = "Proceso ejecutado : ";
    }
    Notificacion.prototype.esSatisfactorio = function () {
        return this.tipo === "exito";
    };
    Notificacion.prototype.modeloInterfaz = function () {
        if (!this.esSatisfactorio()) {
            this.icono = "warning";
            this.fondo = "orange darken-2";
            this.tituloMensaje = "Error : ";
        }
        return "<ul class=\"collapsible\" data-collapsible=\"accordion\" id=\"tarjetaNotificacion\">\n        <li>\n          <div class=\"collapsible-header " + this.fondo + "\"><i class=\"material-icons\">" + this.icono + "</i>" + this.tituloMensaje + this.mensaje + "</div>\n        </li>\n      </ul>";
    };
    return Notificacion;
}());
var Vista = /** @class */ (function () {
    function Vista(contenedor) {
        this.contenedor = Vista.elementoHTMLConId(contenedor);
    }
    Vista.elementoHTMLConId = function (id) {
        return document.getElementById(id);
    };
    Vista.elementoHTMLConQuery = function (selector) {
        return document.querySelector(selector);
    };
    Vista.prototype.mostrarEn = function (id, estructuraElemento) {
        this.contenedor.querySelector("" + id).innerHTML += estructuraElemento;
    };
    Vista.prototype.mostrar = function (estructuraElemento) {
        this.contenedor.innerHTML += estructuraElemento;
    };
    Vista.prototype.eliminar = function (id) {
        Vista.elementoHTMLConId("" + id).remove();
    };
    Vista.prototype.eliminarConQuery = function (selector) {
        Vista.elementoHTMLConQuery(selector).remove();
    };
    Vista.prototype.eliminarConTime = function (segundos, nombreElemento) {
        var _this = this;
        setTimeout(function () {
            _this.eliminarConQuery(nombreElemento);
        }, segundos);
    };
    return Vista;
}());
document.addEventListener('DOMContentLoaded', cargarClientes);
function cargarClientes() {
    var gestionador = new Gestionador();
    gestionador.listar();
    var form = document.getElementById("datos");
    form.addEventListener("submit", guardar);
    function guardar(event) {
        event.preventDefault();
        var cedula = document.getElementById("cedula").value.toString();
        var nombres = document.getElementById("nombres").value.toString();
        var direccion = document.getElementById("direccion").value.toString();
        var telefono = document.getElementById("telefono").value.toString();
        var email = document.getElementById("email").value.toString();
        gestionador.guardar(new Cliente(cedula, nombres, direccion, telefono, email));
    }
}
