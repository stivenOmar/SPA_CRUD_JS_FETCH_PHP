var btnGuardar = document.getElementById("btnGuardar");
var cedula = document.getElementById("cedula");
var nombres = document.getElementById("nombres");
var direccion = document.getElementById("direccion");
btnGuardar.addEventListener('click', function (event) {
    event.preventDefault();
    var persona = {
        cedula_per: "" + cedula.value,
        nombres_per: "" + nombres.value,
        direccion_per: "" + direccion.value
    };
    fetch('./php/guardar.php', {
        method: "POST",
        body: JSON.stringify(persona),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (resolve) { return resolve.json(); })
        .then(function (response) { return console.log(response); })["catch"](function (reject) { return console.log(reject); });
});
