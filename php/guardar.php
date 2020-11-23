<?php
    include('coneccion.php');

    $clienteData = json_decode( file_get_contents( 'php://input' ), true );
    if(isset($clienteData)){
        $cedula = $clienteData["cedula"];
        $nombres = $clienteData["nombres"];
        $direccion = $clienteData["direccion"];
        $telefono = $clienteData["telefono"];
        $email = $clienteData["email"];

        $query = "SELECT COUNT($cedula) FROM datosClientes where cedula_cli = '$cedula' ";

        $consulta = mysqli_query($coneccionDb, $query);

        $coincidencia = intval(mysqli_fetch_array($consulta)[0]);

        $json = [];
        
        if( $coincidencia >= 1){
            $json = [
                "proceso" => false,
                "mensaje" => "El usuario ya esta registrado"
            ];
        }else {
            $query = "INSERT INTO datosClientes (cedula_cli, nombre_cli, direccion_cli, telefono_cli, email_cli)
            VALUES ('$cedula','$nombres','$direccion','$telefono','$email')";
            
            $insercion = mysqli_query($coneccionDb, $query);
            $operacion = true;
            if($insercion){
                $json = [
                    "proceso" => true,
                    "mensaje" => "Usuario ingresado"
                ];
            }else{
                $json = [
                    "proceso" => true,
                    "mensaje" => "Error de registro"
                ];
            }
        }
    }else {
        $json = [
            "proceso" => true,
            "mensaje" => "Error de peticion"
        ];
    }

    echo json_encode($json);
?>