<?php

include('coneccion.php');
$clienteData = json_decode(file_get_contents('php://input'), true);

$json = [];

if($clienteData){
    $cedula_cli = $clienteData['cedula_cli'];
    $query = "SELECT * FROM datosClientes WHERE cedula_cli = $cedula_cli ";
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

        $json[] =[
            'proceso' => true,
            'respuesta' => $clientes
        ]; 

    }else{
        $json[] = [
            'proceso' => false,
            'respuesta' => 'error en la consulta'
        ];
    }

}else{
    $json[] =[
        'proceso'=> false,
        'respuesta' => "error de servidor"
    ];
}

echo json_encode($json);

?>