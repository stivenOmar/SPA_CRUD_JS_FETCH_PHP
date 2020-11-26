<?php

include('coneccion.php');

$query = "SELECT * FROM datosClientes ";

$result = mysqli_query($coneccionDb, $query);



while($cliente = mysqli_fetch_array($result)){
    $json[] = [
        "cedula" => $cliente['cedula_cli'],
        "nombre" => $cliente['nombre_cli'],
        "direccion" => $cliente['direccion_cli'],
        "telefono" => $cliente['telefono_cli'],
        "email" => $cliente['email_cli']
    ];
}

echo json_encode($json);

?>