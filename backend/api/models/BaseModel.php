<?php
require_once "ConnectionBD.php";
class BaseModel {
  public static function query($sql, $params = [], $fetch = 'all') {
    $stmt = ConnectionBD::CNN()->prepare($sql);
    $stmt->execute($params);

    return match ($fetch) {
      'one' => $stmt->fetch(PDO::FETCH_ASSOC),
      'all' => $stmt->fetchAll(PDO::FETCH_ASSOC),
      default => true
    };
  }
  static public function setInsert($table, $params){
   
    $columns = array();
    $sql_columns = "";
    $sql_params = "";
    foreach (array_keys($params) as $Key => $value){
      array_push($columns, $value);

      $sql_columns .= $value. ","; 
      $sql_params .= ":".$value. ","; 
    }  
         
    if(empty(ConnectionBD::getTable($table, $columns))){
      return array("status"=> 400, "alert"=> "The table or columns not found"); 
    }
         
    $sql_columns = substr($sql_columns, 0, -1);
    $sql_params = substr($sql_params, 0, -1);

    $sql = "INSERT INTO $table ($sql_columns) VALUES ($sql_params)";
    $LINK = ConnectionBD::CNN();
    $stmt = $LINK->prepare($sql);

    foreach ($params as $Key => $value){
      $stmt->bindParam(":".$Key, $params[$Key], PDO::PARAM_STR);
    }

    try{
      if($stmt->execute()){
          return array(
            "status"=> 200,
            "comment" => "The process was successful",
            "id" => $LINK->lastInsertId()
          );
      }else{
          return array(
            "status"=> 400,
            "alert"=> "some of the columns in the table do not meet the characteristics",
            "error"=>  $LINK->errorInfo()
          );
      }
    }catch(PDOException $e){
      return array(
          "status"=> 400,
          "alert"=> "cannot insert item",
          "error"=>  $e
      );
    }

  }
}
?>