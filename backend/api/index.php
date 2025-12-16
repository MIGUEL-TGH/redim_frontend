<?php

   ini_set('display_errors', 1);
   ini_set('log_errors', 1);
   ini_set('error_log', './php_error_log');

   header('Access-Control-Allow-Origin: *');
   // header('Access-Control-Allow-Headers: Origin, x-requested-with, Content-Type, Accept');
   // header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
   // header("Content-Type: application/json; charset=utf-8");

   require_once "controllers/controller-routes.php";
   $index = new routes_controllers();
   $index->index();
?>