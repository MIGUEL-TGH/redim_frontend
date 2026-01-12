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
}
?>