<?php
  require_once "controllers/cont_map.php";

  $Type = isset($_GET['type']) ?  $_GET['type'] : '';
  $ID = isset($_GET['id']) ?  $_GET['id'] : 0;
   
  switch ($METHOD){
    case 'GET': // Obtener
      if($Type == "indicators"){
        $response = map::getIndicators();
      } else if ($Type == "years") {
        $response = map::getYears();
      } else if ($Type == "states") {
        $response = map::getStates();
      } else if ($Type == "genders") {
        $response = map::getGenders();
      }

      break;
    case 'POST': // Insertar
      if($Type == "categories"){
        $response = map::getIndicatorCategories($value);
      }
       break;
    // case 'PUT': // Actualizar
    //    $return = ALERT(400, 'Method under construction');
    //    break;
    // case 'DELETE': // Eliminar
    //    $return = ALERT(400, 'Method under construction');
    //    break;
    default:
      $return = ALERT(405, 'Method Not Allowed');
  } 
?>