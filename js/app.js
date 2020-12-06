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
    Gestionador.prototype.crearContenedor = function () {
        this.vista.eliminarConQuery('#datosClientes');
        var datosClientes = document.createElement('tbody');
        datosClientes.setAttribute('id', 'datosClientes');
        document.getElementById('tablaClientes').appendChild(datosClientes);
    };
    Gestionador.prototype.eliminar = function (cedula) {
        var _this = this;
        fetch('./php/eliminar.php', {
            method: "POST",
            body: JSON.stringify(cedula),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (resolve) { return resolve.json(); })
            .then(function (response) {
            if (response[0].proceso) {
                _this.mostrarNotificacion('exito', response[0].respuesta);
                Vista.elementoHTMLConQuery("[data-ced = '" + cedula).parentElement.remove();
            }
            else {
                _this.mostrarNotificacion('error', response[0].respuesta);
            }
        })["catch"](function (error) {
            _this.mostrarNotificacion('error', 'Error del servidor');
        });
    };
    Gestionador.prototype.editar = function (cliente) {
        var _this = this;
        fetch('./php/editar.php', {
            method: 'POST',
            body: cliente.json(),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (resolve) { return resolve.json(); })
            .then(function (response) {
            if (response) {
                document.querySelector("[data-ced = '" + response[0].respuesta[0].cedula + "' ]").parentElement.remove();
                var cliente_1 = response[0].respuesta[0];
                _this.vista.mostrarEn('#datosClientes', new Cliente(cliente_1.cedula, cliente_1.nombre, cliente_1.direccion, cliente_1.telefono, cliente_1.email).modeloInterfaz());
                _this.mostrarNotificacion('exito', 'Datos editados correctamente');
                Vista.elementoHTMLConId('datos').reset();
                var btnGuardar = Vista.elementoHTMLConId('btnGuardar');
                btnGuardar.innerHTML = "Guardar\n                <i class=\"material-icons right\">send</i>";
                btnGuardar.attributes[3].value = "1";
                Vista.elementoHTMLConId('cedula').disabled = false;
            }
            else {
                _this.mostrarNotificacion('error', response.respuesta);
            }
        })["catch"](function (error) {
            _this.mostrarNotificacion('error', "Error de conexiòn con el servidor");
        });
    };
    Gestionador.prototype.obtenerCliente = function (cedula) {
        var _this = this;
        Vista.elementoHTMLConId('btnGuardar').textContent = "Editar";
        fetch('./php/consultar.php', {
            method: 'POST',
            body: JSON.stringify({ 'cedula_cli': "" + cedula }),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (resolve) { return resolve.json(); })
            .then(function (response) {
            if (response[0].proceso) {
                var cliente = response[0].respuesta[0];
                _this.mostrarContenidoEnInputs(cliente);
            }
            else {
                _this.mostrarNotificacion('error', response[0].respuesta);
            }
        })["catch"](function (error) { _this.mostrarNotificacion('error', 'error de conexion con servidor'); });
    };
    Gestionador.prototype.mostrarContenidoEnInputs = function (cliente) {
        var label;
        var input;
        for (var propiedad in cliente) {
            input = Vista.elementoHTMLConId("" + propiedad);
            if (propiedad == "cedula") {
                input.disabled = true;
            }
            input.value = cliente[propiedad];
            label = Vista.elementoHTMLConQuery("[for='" + propiedad + "']");
            label.setAttribute('class', 'active');
        }
        ;
    };
    Gestionador.prototype.buscar = function (condicionBusqueda) {
        var _this = this;
        if (condicionBusqueda !== "") {
            var dato = "cedula";
            if (isNaN(condicionBusqueda)) {
                dato = "nombre";
            }
            fetch("./php/buscar.php", {
                method: 'POST',
                body: JSON.stringify({
                    'condicion': condicionBusqueda,
                    'dato': "" + dato
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resolve) { return resolve.json(); })
                .then(function (response) {
                if (response[0].proceso) {
                    _this.crearContenedor();
                    if (response[0].respuesta.length != 0) {
                        response[0].respuesta.forEach(function (cliente) {
                            _this.vista.mostrarEn('#datosClientes', new Cliente(cliente.cedula, cliente.nombre, cliente.direccion, cliente.telefono, cliente.email).modeloInterfaz());
                        });
                    }
                    else {
                        _this.vista.mostrarEn('#datosClientes', "<tr>\n                        <td colspan=\"6\" class=\"center-align\">No hay coincidencias</td>\n                      </tr>");
                    }
                }
                else {
                    _this.mostrarNotificacion('error', response);
                }
            })["catch"](function (error) {
                _this.mostrarNotificacion('error', 'error al cosultar');
            });
        }
        else {
            this.crearContenedor();
            this.listar();
        }
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
            _this.mostrarNotificacion("error", "error conexion con servidor");
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
        return "<tr>\n        <td>" + this.cedula + "</td>\n        <td>" + this.nombres + "</td>\n        <td>" + this.direccion + "</td>\n        <td>" + this.telefono + "</td>\n        <td>" + this.email + "</td>\n        <td data-ced = \"" + this.cedula + "\"><i class=\"material-icons iconOperacion editar\">edit</i> <i class=\"red-text material-icons iconOperacion eliminar\">delete</i></td>\n      </tr>";
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
    form.addEventListener("submit", enviarDatos);
    //1 = guardar cliente
    //2 = editar cliente
    function enviarDatos(event) {
        event.preventDefault();
        var cedula = document.getElementById("cedula").value.toString();
        var nombres = document.getElementById("nombre").value.toString();
        var direccion = document.getElementById("direccion").value.toString();
        var telefono = document.getElementById("telefono").value.toString();
        var email = document.getElementById("email").value.toString();
        if (Vista.elementoHTMLConId("btnGuardar").dataset.proceso == "1") {
            gestionador.guardar(new Cliente(cedula, nombres, direccion, telefono, email));
        }
        else {
            gestionador.editar(new Cliente(cedula, nombres, direccion, telefono, email));
        }
    }
    var cedula = document.getElementById("search");
    var dataCedula;
    cedula.addEventListener("keyup", function () {
        gestionador.buscar(cedula.value);
    });
    function cambiarDataProceso(valor) {
        Vista.elementoHTMLConId("btnGuardar").dataset.proceso = valor;
    }
    document.getElementById("tablaClientes").addEventListener('click', function (event) {
        var elemento = event.target;
        if (elemento.classList.contains('editar')) {
            cambiarDataProceso("2");
            gestionador.obtenerCliente(elemento.parentElement.dataset.ced);
        }
        else if (elemento.classList.contains('eliminar')) {
            gestionador.eliminar(elemento.parentElement.dataset.ced);
        }
    });
}
