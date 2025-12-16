<?php

   require_once "models/ModelsBD.php";
   require_once "Response.php";
   class map {
      public function __construct(){}
      //--------------------public access-------------------------------------------        
      static public function getIndicators(){
         $return = new response();
         $result = array();

         $query = "SELECT i.`id`, i.`name` AS `title`, i.`team` 
            FROM `indicators` i
            WHERE i.`map` = 1 AND i.`status` = 1 
            ORDER BY i.`name` ASC;"; 
         $Items_BD = ModelsBD::getFilter($query);
      
         if (empty($Items_BD)) {
            return $return->setResponse(null, '¡items not found!', 400);
         }

         $indicatorsIds = array_column($Items_BD, 'id'); // Prepara una lista de ids de módulos para la consulta de submódulos
         $indicatorsIdsList = implode(',', $indicatorsIds); // Realiza una consulta para obtener todos los submódulos de una vez
         
         $subIndicatorsQuery = "SELECT `id`, `indicator_id`, `name` AS `title`
                              FROM `indicator_categories`
                              WHERE `indicator_id` IN ($indicatorsIdsList) AND `status` = 1;";
         $subIndicators_BD = ModelsBD::getFilter($subIndicatorsQuery);

         return $return->setResponse($subIndicators_BD, null, null);

         $subIndicatorsById = [];
         foreach ($subIndicators_BD as $subM) {
            $subIndicatorsById[$subM['id_mod']][] = [
               'id' => $subM['id'],
               'title' => $subM['title'],
               // 'color' => $subM['color'],
               // 'icon' => $subM['icon'],
               // 'search' => $subM['search'],
               // 'id_search' => $subM['id_search'],
               // 'items' => [],
               'uri' => '', // Puedes configurar esto si es necesario
            ];
         }

        //  foreach ($Items_BD as $item) {
        //     $newItem = [
        //        'id' => $item['id'],
        //        'title' => $item['title'],
        //        'items' => [],
        //        'uri' => $item['uri'],
        //        'icon' => $item['icon'],
        //        'color' => $item['color'],
        //        'team' => $item['team'],
        //     ];

        //     // if ($item['team'] == 1 && isset($subModulesById[$item['id']])) {
        //     //       $newItem['sub_modules'] = $subModulesById[$item['id']];
        //     // }

        //     if ($item['team'] == 1 && isset($subModulesById[$item['id']])) {
        //        foreach ($subModulesById[$item['id']] as &$subM) {
        //            $subM['uri'] = $item['uri'];
        //        }
        //        $newItem['sub_modules'] = $subModulesById[$item['id']];
        //    }

        //     $result[] = $newItem;
        //  }

        //  return $return->setResponse($result, null, null);

      }
      //--------------------private access------------------------------------------- 
  }

?>