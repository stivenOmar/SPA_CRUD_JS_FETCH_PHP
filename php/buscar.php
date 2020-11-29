<?php

include('coneccion.php');

$clienteData = json_decode( file_get_contents( 'php://input' ), true );

$data = [];

if($clienteData){

    $comparacion = $clienteData['condicion'];
    $condicion = "cedula_cli LIKE '$comparacion%'";

    if($clienteData['dato'] === 'nombre'){
        $condicion = "nombre_cli LIKE '%$comparacion%'";
    }

    $query = "SELECT * FROM datosClientes WHERE $condicion";
    $consulta = mysqli_query($coneccionDb, $query);

    
    
    if($consulta){
        $clientes = []; 
        while($cliente = mysqli_fetch_array($consulta)){
            $clientes[] = [
                'cedula' => $cliente['cedula_cli'],
                'nombre' => $cliente['nombre_cli'],
                'direccion' => $cliente['direccion_cli'],
                'telefono' => $cliente['telefono_cli'],
                'email' => $cliente['email_cli'] 
            ];
        }

        $data[] = [
            "proceso" => true,
            "respuesta" => $clientes
        ];
    }else {
        $data[] =[
            'proceso' => false,
            "respuesta" => "Error en consulta"
        ];
    }
    
     
}else {
    $data[] = [
        'proceso' => false,
        'respuesta' => 'Error de peticion'
    ];   
}

echo json_encode($data);

?>