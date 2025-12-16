<?php
   require_once "controllers/cont_map.php";

  $Type = isset($_GET['type']) ?  $_GET['type'] : '';
  $ID = isset($_GET['id']) ?  $_GET['id'] : 0;
   
   switch ($METHOD){
      case 'GET': // Obtener
         if($Type == "items"){
            $Return = map::getIndicators();
         }
         break;
      // case 'POST': // Insertar
      //    $Return = ALERT(400, 'Method under construction');
      //    break;
      // case 'PUT': // Actualizar
      //    $Return = ALERT(400, 'Method under construction');
      //    break;
      // case 'DELETE': // Eliminar
      //    $Return = ALERT(400, 'Method under construction');
      //    break;
      default:
         $Return = ALERT(405, 'Method Not Allowed');
   } 
?>