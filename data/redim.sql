CREATE TABLE `indicators` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `team` int(1) NOT NULL,
  `map` int(1) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `indicators` (`id`, `name`, `team`, `map`, `status`) VALUES
(1, 'Aborto', 1, 1, 1),
(2, 'Abuso de confianza y falsedad', 1, 1, 1),
(3, 'Otros delitos sexuales', 1, 1, 1),
(4, 'Delitos de delincuencia organizada y tipificados en Convención de Palermo', 1, 1, 1),
(5, 'Allanamiento de morada', 1, 1, 1),
(6, 'Amenazas', 1, 1, 1),
(7, 'Otros delitos asociados a la delincuencia organizada', 1, 1, 1),
(8, 'Corrupción de niñez, adolescencia y personas con discapacidad', 1, 1, 1),
(9, 'Delitos bancarios y financieros', 1, 1, 1);

-- --------------------------------------------------------

CREATE TABLE `indicator_categories` (
  `id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `status` tinyint(4) DEFAULT 1,
  `center_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `indicator_categories` (`id`, `indicator_id`, `parent_id`, `name`, `level`, `sort_order`, `status`, `center_id`, `created_at`) VALUES
(1, 1, NULL, 'Aborto', 0, 0, 1, 1, '2026-02-01 00:00:00'),
(2, 2, NULL, 'Abuso de confianza', 0, 0, 1, 1, '2026-02-01 00:00:00'),
(3, 2, NULL, 'Falsedad', 0, 0, 1, 1, '2026-02-01 00:00:00'),
(4, 3, NULL, 'Abuso, acoso y hostigamiento sexual', 0, 0, 1, 1, '2026-02-01 00:00:00'),
(5, 3, 4, 'Abuso sexual', 1, 0, 1, 1, '2026-02-01 00:00:00'),
(6, 3, 4, 'Acoso sexual', 1, 0, 1, 1, '2026-02-01 00:00:00'),
(7, 3, 4, 'Hostigamiento sexual', 1, 0, 1, NULL, '2026-02-01 00:00:00'),
(8, 3, NULL, 'Incesto', 0, 0, 1, NULL, '2026-02-01 00:00:00'),
(9, 3, NULL, 'Otros delitos sexuales', 0, 0, 1, NULL, '2026-02-01 00:00:00'),
(10, 3, 9, 'Contra la Libertad y el Normal Desarrollo Psicosexual', 1, 0, 1, NULL, '2026-02-01 00:00:00'),
(11, 3, 9, 'Delitos Contra la Libertad y el Normal Desarrollo Psicosexual', 1, 0, 1, NULL, '2026-02-01 00:00:00'),
(12, 3, 9, 'La libertad y la seguridad sexual', 1, 0, 1, NULL, '2026-02-01 00:00:00');

-- --------------------------------------------------------

CREATE TABLE `indicator_category_details` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `year_id` int(11) NOT NULL,
  `gender_id` int(11) NOT NULL,
  `center_id` int(11) DEFAULT NULL,
  `state_id` int(11) NOT NULL,
  `PI` int(4) NOT NULL COMMENT 'Población Internada',
  `PS` int(4) NOT NULL COMMENT 'Población Señalada',
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
