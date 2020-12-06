<?php

include('coneccion.php');
$clienteData = json_decode(file_get_contents('php://input'),true);

$json = [];
if($clienteData){
    $cedula = $clienteData["cedula"];
    $nombre = $clienteData["nombres"];
    $direccion = $clienteData["direccion"];
    $telefono = $clienteData["telefono"];
    $email = $clienteData["email"];
    
    $query = "UPDATE datosClientes SET nombre_cli = '$nombre', direccion_cli = '$direccion',
    telefono_cli = '$telefono', email_cli = '$email' WHERE cedula_cli = '$cedula'";

    $consulta = mysqli_query($coneccionDb, $query);

    if($consulta){
       $queryCliente = "SELECT * FROM datosClientes WHERE cedula_cli = $cedula";
       $respuesta = mysqli_query($coneccionDb, $queryCliente);
       if($respuesta){
           $clientes = [];
           while ($cliente = mysqli_fetch_array($respuesta)) {
               $clientes[] =[
                   'cedula' => $cliente['cedula_cli'],
                   'nombre' => $cliente['nombre_cli'],
                   'direccion' => $cliente['direccion_cli'],
                   'telefono' => $cliente['telefono_cli'],
                   'email' => $cliente['email_cli']
               ];
           }
           $json[] =[
               'proceso' => true,
               'respuesta' => $clientes
           ];
       }else {
           $json[] = [
               'proceso' => false,
               'respuesta' => 'error de servidor'
           ];
       }
    }else {
        $json[] = [
            'proceso' => false,
            'respuesta' => 'error de servidor'
        ];
    }

}else{
    $json[] = [
        'proceso' => false,
        'respuesta' => 'error de servidor'
    ];
}

echo json_encode($json);

?>