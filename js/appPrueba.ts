
let btnGuardar : HTMLElement = document.getElementById("btnGuardar");

let cedula = document.getElementById("cedula");
let nombres = document.getElementById("nombres");
let direccion = document.getElementById("direccion");

let persona;


btnGuardar.addEventListener('click',(event)=>{
    
    event.preventDefault();
    persona = {
        cedula_per : `${cedula.value}`,
        nombres_per : `${nombres.value}`,
        direccion_per : `${direccion.value}`
    }
    fecthF().then(resolve=>resolve.json())
    .then(response => console.log(response))
    .catch(reject => console.log(reject));
});

function fecthF(){
    return  fetch('./php/guardar.php',{
        method: "POST",
        body: JSON.stringify(persona),
        headers:{
            'Content-Type': 'application/json'
        }
    })
}