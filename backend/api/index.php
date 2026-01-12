<?php
require_once __DIR__ . '/core/exceptions/ApiException.php';
require_once __DIR__ . '/core/exceptions/ValidationException.php';
require_once __DIR__ . '/core/exceptions/DatabaseException.php';
require_once __DIR__ . '/core/exceptions/NotFoundException.php';
require_once 'core/BaseController.php';

require_once 'core/cors.php';
require_once 'core/request.php';
require_once 'core/response.php';
require_once 'core/router.php';

Cors::handle();

$router = new Router();
// require_once 'routes/auth.routes.php';
// require_once 'routes/indicators.routes.php';
// require_once 'routes/years.routes.php';
require_once 'routes/map.routes.php';

$router->dispatch();

?>