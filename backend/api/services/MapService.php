<?php
require_once "models/BaseModel.php";

class MapService {

  public static function getIndicators() {  
    $sql = 
      "SELECT i.id, i.name AS title
      FROM indicators i
      INNER JOIN indicator_categories ic 
        ON ic.indicator_id = i.id
        AND ic.status = ?
      WHERE i.status = ?
      GROUP BY i.id, i.name
      ORDER BY i.name ASC
    ";

    try {
      $items = BaseModel::query($sql, [1, 1], 'all');
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }

    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }
  public static function getIndicatorCategories($indicatorId) {
    try {
      $sql = 
        "SELECT ic.id, ic.name AS title
        FROM indicator_categories ic
        WHERE ic.indicator_id = ? 
            AND ic.status = ?
        ORDER BY ic.name ASC;
      ";

      $items = BaseModel::query($sql, [$indicatorId, 0], 'all');
    
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }
    
    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }
  
  public static function getYears() {
    return ['example' => 'years'];
  }

  public static function getData($payload) {
    return [
      'received' => $payload
    ];
  }
}
?>