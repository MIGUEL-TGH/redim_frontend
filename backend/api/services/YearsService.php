<?php
require_once "models/BaseModel.php";

class YearsService {
  //--------------------private access------------------------------------------- 
  //--------------------public access-------------------------------------------        
  public static function getYears() {
    try {
      $sql = 
        "SELECT y.id, y.name AS title
        FROM years y
        WHERE y.status = ?
        ORDER BY y.name DESC;
      ";

      // $sql = 
      //   "SELECT DISTINCT icd.year_id AS id, y.name AS title
      //   FROM indicator_category_details icd
      //   INNER JOIN years y ON y.id = icd.year_id
      //   WHERE icd.status = ?  
      //   ORDER BY icd.year_id DESC;
      // ";

      $items = BaseModel::query($sql, [1], 'all');
    
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }
    
    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }
  public static function setCRUD($data) {
    $params = $data['params'];

    if ($data['task'] === '1' || $data['task'] === '2') {
      if (!preg_match("/^\d{4}$/", $params['name'])) {
        throw new ValidationException (
          [ 'type' => 'Invalid type parameter' ],
          'El formato no cumple con las características YYYY'
        );    
      }
    }

    try {    
      // return $params;
      // return "Enviar datos al FrontEnd";

      $result = [];
      switch ($data['task']) {
        case '1': // insert
            $insert = BaseModel::setInsert('years', $params);
            if($insert['status'] === 200){
              $result["task"] = 'saved_item';
              $result["id"] = $insert["id"];
            }else if ($insert['status'] === 400){
              throw new ValidationException ( [ 'type' => 'Invalid type parameter' ], $insert['alert'] ); 
            }
            break;
        case '2': // update item
            // $update = self::setUpdate('government_agencies', $params);
            // if($update['status'] === 200){
            //   $result['task'] = 'updated_item';
            //   $result['id'] = $params['id'];
            //   return $return->setResponse($result, NULL, NULL);
            // }else if ($update['status'] === 400){
            //   return $return->setResponse(null, $update['alert'], $update['status']);
            // }
            break;
        case '3':   // item status change
            // $update = self::setUpdate('government_agencies', $params);
            // if($update['status'] === 200){
            //   $result['task'] = 'status_changed';
            //   return $return->setResponse($result, NULL, NULL);
              
            // }else if ($update['status'] === 400){
            //   return $return->setResponse(null, $update['alert'], $update['status']);
            // }
            break;
        default:
          // return $return->setResponse(null, 'Task not found', 400);
          throw new ValidationException (
            [ 'type' => 'Invalid type parameter' ],
            'Tipo de tarea no encontrado'
          );  
      }


    } catch (ApiException $e) {
      throw $e;
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }  


    return $result;
  }
}
?>