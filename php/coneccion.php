<?php

$coneccionDb = mysqli_connect(
    'localhost',
    'root',
    '',
    'clientes'
);

if(!$coneccionDb){
    echo "Error coneccion Base de datos";
}

?>