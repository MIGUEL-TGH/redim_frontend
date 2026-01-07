<?php
   // $TASK = isset($_GET['Task']) ?  $_GET['Task'] : '*';
   // $Parameters = !empty($_GET) ? $_GET: [];

   header("Content-Type: application/json");
   $value = file_get_contents('php://input');
   $Json = json_decode($value, true);

   $Return = '';
   $REQ_URI = $_SERVER['REQUEST_URI'];
   $URI_EXP = explode("/", $REQ_URI);
   $URI_END = end($URI_EXP);
   $URI = !empty($_GET) ? explode("?", $REQ_URI)[0] : $REQ_URI;

   $METHOD = $_SERVER['REQUEST_METHOD'];
   
   if(empty($URI_END)){
      echo ALERT(400, 'Bad Request');
      return;
   }

   // $HEADERS = getallheaders();
   // if(!isset($HEADERS['apikey'])){
   //    echo ALERT(400, 'Bad Request'); //you are not authorized to make this request
   //    return;
   // }   

   // strtolower($URI);
   if(strlen($URI) != 0){
      switch (strtolower($URI)){
         //--------------------map redim------------------------------
         case '/redim_backend/api/map':
            include "services/serv_map.php";
         break;
         //-----------------------------------------------------------
         case '/redim_backend/api/economy':
            include "services/serv_economy.php";
         break;
         case '/redim_backend/api/migration':
            include "services/serv_migration.php";
         break;
         case '/redim_backend/api/infrastructure':
            include "services/serv_infrastructure.php";
         break;
         case '/redim_backend/api/governance':
            include "services/serv_governance.php";
         break;
         case '/redim_backend/api/environment':
            include "services/serv_environment.php";
         break;
         case '/redim_backend/api/health':
            include "services/serv_health.php";
         break;
         case '/redim_backend/api/culture':
            include "services/serv_culture.php";
         break;
         case '/redim_backend/api/justice':
            include "services/serv_justice.php";
         break;
         case '/redim_backend/api/technology':
            include "services/serv_technology.php";
         break;
         case '/redim_backend/api/education':
            include "services/serv_education.php";
         break;
         case '/redim_backend/api/afromexicana':
            include "services/serv_afromexicana.php";
         break;
         case '/redim_backend/api/lenguages':
            include "services/serv_lenguages.php";
         break;

         //--------------------------------------------------
         case '/api/regiones':
               include "services/serv_regiones.php";
            break;
         case '/redim_backend/api/townhall': // Municipios
            include "services/serv_townhall.php";
         break;
         //--------------------------------------------------
         
         default:
            echo ALERT(406, 'Not Acceptable');
      }
      echo $Return;

   } else {
      echo ALERT(404, 'Not Found');
   }

   function ALERT($status, $result){
      $return = array(
         'status' => $status,
         'result' => $result,
      );
      return json_encode($return, http_response_code($return['status']));
   }

?> 