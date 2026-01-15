<?php
require_once "models/BaseModel.php";

class MapService {
  //--------------------private access------------------------------------------- 
  private static function buildInClause(string $field, array $values, array &$params): string {
    if (empty($values)) {
      return '';
    }

    $safeField = str_replace('.', '_', $field);
    $placeholders = [];
    foreach ($values as $index => $value) {
      $key = "{$safeField}_{$index}";
      $placeholders[] = ":{$key}";
      $params[$key] = $value;
    }

    return " AND {$field} IN (" . implode(',', $placeholders) . ")";
  }
  //--------------------public access-------------------------------------------        
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

      $items = BaseModel::query($sql, [$indicatorId, 1], 'all');
    
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }
    
    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }
  public static function getStates() {
    try {
      $sql = 
        "SELECT s.id, s.name AS title
        FROM states s
        WHERE s.status = ? AND s.country_id = ?
        ORDER BY s.name ASC;
      ";

      $items = BaseModel::query($sql, [1, 1], 'all');
    
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }
    
    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }
  public static function getYears() {
    try {
      $sql = 
        "SELECT y.id, y.name AS title
        FROM years y
        WHERE y.status = ?
        ORDER BY y.name DESC;
      ";

      $items = BaseModel::query($sql, [1], 'all');
    
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }
    
    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }
  public static function getGenders() {
    try {
      $sql = 
        "SELECT g.id, g.name AS title
        FROM genders g
        WHERE g.status = ?
        ORDER BY g.name ASC;
      ";

      $items = BaseModel::query($sql, [1], 'all');
    
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }
    
    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }

  public static function getData($data) {
    $params = [];
    $query = "SELECT
        icd.indicator_category_id AS category_id,
        ic.name AS category_name,

        icd.year_id,
        y.name AS year_name,

        icd.gender_id,
        g.name AS gender_name,

        icd.state_id,
        s.name AS state_name,

        icd.quantity
      FROM indicator_category_details icd
      INNER JOIN indicator_categories ic ON ic.id = icd.indicator_category_id
      INNER JOIN years y ON y.id = icd.year_id
      INNER JOIN genders g ON g.id = icd.gender_id
      INNER JOIN states s ON s.id = icd.state_id
      WHERE icd.status = 1
    ";

    // Construcción dinámica de filtros
    if (!empty($data['category_id'])) {
      $query .= self::buildInClause('icd.indicator_category_id', $data['category_id'], $params);
    }
    
    if (!empty($data['year_id'])) {
      $query .= self::buildInClause('icd.year_id', $data['year_id'], $params);
    }

    if (!empty($data['gender_id'])) {
      $query .= self::buildInClause('icd.gender_id', $data['gender_id'], $params);
    }

    if (!empty($data['state_id'])) {
      $query .= self::buildInClause('icd.state_id', $data['state_id'], $params);
    }

    // -------------------------------------------------------------------------------------------------
    try {
      $items = BaseModel::query($query, $params, 'all');
    } catch (Throwable $e) {
      throw new DatabaseException($e->getMessage());
    }
    
    if (empty($items)) {
      throw new NotFoundException('¡items not found!');
    }

    return $items;
  }
}
?>