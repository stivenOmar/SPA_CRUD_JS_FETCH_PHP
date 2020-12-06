<?php

include('coneccion.php');
$data = json_decode(file_get_contents('php://input'),true);
$json = [];
if($data){

    $query = "DELETE FROM datosClientes WHERE cedula_cli = $data";
    $resultado = mysqli_query($coneccionDb, $query);

    if($resultado){
        $json[] = [
            'proceso' => true,
            'respuesta' => 'Datos eliminados'
        ];
    }else{
        $json[] = [
            'proceso' => false,
            'respuesta' => 'Error al eliminar datos'
        ];
    }

}else{
    $json[] = [
        'proceso' => false,
        'respuesta' => 'Error de peticion al servidor'
    ];
}

echo json_encode($json);



?>