-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-12-2025 a las 06:34:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `redim`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centers`
--

CREATE TABLE `centers` (
  `id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `locate` varchar(25) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `centers`
--

INSERT INTO `centers` (`id`, `state_id`, `name`, `locate`, `status`) VALUES
(1, 1, '', '', 1),
(2, 1, 'CENTRO PENITENCIARIO ESTATAL AGUASCALIENTES', '', 1),
(3, 1, 'CENTRO PENITENCIARIO ESTATAL EL LLANO', '', 1),
(4, 1, 'CENTRO PENITENCIARIO ESTATAL DE MUJERES', '', 1),
(5, 1, 'CENTRO ESTATAL PARA EL DESARROLLO DEL ADOLESCENTE', '', 1),
(6, 2, '', '', 1),
(7, 2, 'CERESO MEXICALI', '', 1),
(8, 2, 'CERESO TIJUANA', '', 1),
(9, 2, 'CERESO ENSENADA', '', 1),
(10, 2, 'CERESO EL HONGO', '', 1),
(11, 2, 'CERESO EL HONGO II', '', 1),
(12, 2, 'CIA MEXICALI', '', 1),
(13, 2, 'CIA TIJUANA', '', 1),
(14, 2, 'CIA ENSENADA', '', 1),
(15, 2, 'CENTRO DE INTERNAMIENTO PARA ADOLESCENTES MEXICALI', '', 1),
(16, 2, 'CENTRO DE INTERNAMIENTO PARA ADOLESCENTES ENSENADA', '', 1),
(17, 2, 'CENTRO DE INTERNAMIENTO PARA ADOLESCENTES TIJUANA', '', 1),
(18, 3, '', '', 1),
(19, 3, 'CENTRO PENITENCIARIO LA PAZ', '', 1),
(20, 3, 'CENTRO PENITENCIARIO SAN JOSE DEL CABO', '', 1),
(21, 3, 'CENTRO PENITENCIARIO CIUDAD CONSTITUCION', '', 1),
(22, 3, 'CENTRO PENITENCIARIO SANTA ROSALIA', '', 1),
(23, 3, 'CENTRO DE INTERNAMIENTO ESPECIALIZADO PARA ADOLESCENTES', '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `iso_code` varchar(3) NOT NULL,
  `demonym` varchar(50) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `countries`
--

INSERT INTO `countries` (`id`, `name`, `iso_code`, `demonym`, `status`) VALUES
(1, 'México', 'MEX', 'Mexicanos', 1),
(2, 'Estados Unidos', 'USA', 'Estadounidenses', 1),
(3, 'Canadá', 'CAN', 'Canadienses', 1),
(4, 'Belice', 'BLZ', 'Beliceños', 1),
(5, 'Costa Rica', 'CRI', 'Costarricenses', 1),
(6, 'El Salvador', 'SLV', 'Salvadoreños', 1),
(7, 'Guatemala', 'GTM', 'Guatemaltecos', 1),
(8, 'Honduras', 'HND', 'Hondureños', 1),
(9, 'Nicaragua', 'NIC', 'Nicaragüenses', 1),
(10, 'Panamá', 'PAN', 'Panameños', 1),
(11, 'Antigua y Barbuda', 'ATG', 'Antiguanos', 1),
(12, 'Bahamas', 'BHS', 'Bahameños', 1),
(13, 'Barbados', 'BRB', 'Barbadenses', 1),
(14, 'Cuba', 'CUB', 'Cubanos', 1),
(15, 'Dominica', 'DMA', 'Dominiqueses', 1),
(16, 'República Dominicana', 'DOM', 'Dominicanos', 1),
(17, 'Granada', 'GRD', 'Granadinos', 1),
(18, 'Haití', 'HTI', 'Haitianos', 1),
(19, 'Jamaica', 'JAM', 'Jamaiquinos', 1),
(20, 'San Cristóbal y Nieves', 'KNA', 'Sancristobaleños', 1),
(21, 'San Vicente y las Granadinas', 'VCT', 'Sanvicentinos', 1),
(22, 'Santa Lucía', 'LCA', 'Santalucenses', 1),
(23, 'Trinidad y Tobago', 'TTO', 'Trinitenses', 1),
(24, 'Argentina', 'ARG', 'Argentinos', 1),
(25, 'Bolivia', 'BOL', 'Bolivianos', 1),
(26, 'Brasil', 'BRA', 'Brasileños', 1),
(27, 'Chile', 'CHL', 'Chilenos', 1),
(28, 'Colombia', 'COL', 'Colombianos', 1),
(29, 'Ecuador', 'ECU', 'Ecuatorianos', 1),
(30, 'Guyana', 'GUY', 'Guyaneses', 1),
(31, 'Paraguay', 'PRY', 'Paraguayos', 1),
(32, 'Perú', 'PER', 'Peruanos', 1),
(33, 'Surinam', 'SUR', 'Surinameses', 1),
(34, 'Uruguay', 'URY', 'Uruguayos', 1),
(35, 'Venezuela', 'VEN', 'Venezolanos', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genders`
--

CREATE TABLE `genders` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `genders`
--

INSERT INTO `genders` (`id`, `name`, `status`) VALUES
(1, 'Femenino', 1),
(2, 'Masculino', 1),
(3, 'No especificado', 1),
(4, 'No identificado', 1),
(5, 'Otro', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicators`
--

CREATE TABLE `indicators` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `team` int(1) NOT NULL,
  `map` int(1) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `indicators`
--

INSERT INTO `indicators` (`id`, `name`, `team`, `map`, `status`) VALUES
(1, 'Delitos', 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicator_categories`
--

CREATE TABLE `indicator_categories` (
  `id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `indicator_categories`
--

INSERT INTO `indicator_categories` (`id`, `indicator_id`, `name`, `status`) VALUES
(1, 1, 'Aborto', 1),
(2, 1, 'Abuso de autoridad', 1),
(3, 1, 'Abuso de confianza', 1),
(4, 1, 'Abuso sexual', 1),
(5, 1, 'Acceso ilícito a sistemas o equipos informáticos', 1),
(6, 1, 'Acopio ilícito de armas', 1),
(7, 1, 'Acoso sexual', 1),
(8, 1, 'Allanamiento de morada', 1),
(9, 1, 'Amenazas', 1),
(10, 1, 'Aprovechamiento de hidrocarburos y sus derivados', 1),
(11, 1, 'Armas y objetos prohibidos', 1),
(12, 1, 'Asociación delictuosa', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicator_category_details`
--

CREATE TABLE `indicator_category_details` (
  `id` int(11) NOT NULL,
  `indicator_category_id` int(11) NOT NULL,
  `year_id` int(11) NOT NULL,
  `gender_id` int(11) NOT NULL,
  `center_id` int(11) NOT NULL,
  `quantity` varchar(4) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `states`
--

CREATE TABLE `states` (
  `id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `demonym` varchar(50) NOT NULL,
  `iso_code` varchar(3) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `states`
--

INSERT INTO `states` (`id`, `country_id`, `name`, `demonym`, `iso_code`, `status`) VALUES
(1, 1, 'Aguascalientes', 'Aguascalentenses', 'AGU', 1),
(2, 1, 'Baja California', 'Bajacalifornianos', 'BCN', 1),
(3, 1, 'Baja California Sur', 'Bajacalifornianos', 'BCS', 1),
(4, 1, 'Campeche', 'Campechanos', 'CAM', 1),
(5, 1, 'Chiapas', 'Chiapasenses', 'CHP', 1),
(6, 1, 'Chihuahua', 'Chihuahuenses', 'CHH', 1),
(7, 1, 'Ciudad de México', 'Capitalinos', 'CMX', 1),
(8, 1, 'Coahuila de Zaragoza', 'Coahuilenses', 'COA', 1),
(9, 1, 'Colima', 'Colimenses', 'COL', 1),
(10, 1, 'Durango', 'Duranguenses', 'DUR', 1),
(11, 1, 'Guanajuato', 'Guanajuatenses', 'GUA', 1),
(12, 1, 'Guerrero', 'Guerrerenses', 'GRO', 1),
(13, 1, 'Hidalgo', 'Hidalguenses', 'HID', 1),
(14, 1, 'Jalisco', 'Jaliscienses', 'JAL', 1),
(15, 1, 'México', 'Mexiquenses', 'MEX', 1),
(16, 1, 'Michoacán de Ocampo', 'Michoacanos', 'MIC', 1),
(17, 1, 'Morelos', 'Morelenses', 'MOR', 1),
(18, 1, 'Nayarit', 'Nayaritas', 'NAY', 1),
(19, 1, 'Nuevo León', 'Neoleoneses', 'NLE', 1),
(20, 1, 'Oaxaca', 'Oaxaqueños', 'OAX', 1),
(21, 1, 'Puebla', 'Poblanos', 'PUE', 1),
(22, 1, 'Querétaro', 'Queretanos', 'QUE', 1),
(23, 1, 'Quintana Roo', 'Quintanarroenses', 'ROO', 1),
(24, 1, 'San Luis Potosí', 'Potosinos', 'SLP', 1),
(25, 1, 'Sinaloa', 'Sinaloenses', 'SIN', 1),
(26, 1, 'Sonora', 'Sonorenses', 'SON', 1),
(27, 1, 'Tabasco', 'Tabasqueños', 'TAB', 1),
(28, 1, 'Tamaulipas', 'Tamaulipecos', 'TAM', 1),
(29, 1, 'Tlaxcala', 'Tlaxcaltecas', 'TLA', 1),
(30, 1, 'Veracruz de Ignacio de la Llave', 'Veracruzanos', 'VER', 1),
(31, 1, 'Yucatán', 'Yucatecos', 'YUC', 1),
(32, 1, 'Zacatecas', 'Zacatecanos', 'ZAC', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `years`
--

CREATE TABLE `years` (
  `id` int(11) NOT NULL,
  `name` varchar(4) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `years`
--

INSERT INTO `years` (`id`, `name`, `status`) VALUES
(1, '2000', 1),
(2, '2001', 1),
(3, '2002', 1),
(4, '2003', 1),
(5, '2004', 1),
(6, '2005', 1),
(7, '2006', 1),
(8, '2007', 1),
(9, '2008', 1),
(10, '2009', 1),
(11, '2010', 1),
(12, '2011', 1),
(13, '2012', 1),
(14, '2013', 1),
(15, '2014', 1),
(16, '2015', 1),
(17, '2016', 1),
(18, '2017', 1),
(19, '2018', 1),
(20, '2019', 1),
(21, '2020', 1),
(22, '2021', 1),
(23, '2022', 1),
(24, '2023', 1),
(25, '2024', 1),
(26, '2025', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `centers`
--
ALTER TABLE `centers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `state_id` (`state_id`);

--
-- Indices de la tabla `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `indicators`
--
ALTER TABLE `indicators`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `indicator_categories`
--
ALTER TABLE `indicator_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indicator_id` (`indicator_id`);

--
-- Indices de la tabla `indicator_category_details`
--
ALTER TABLE `indicator_category_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indicator_category_id` (`indicator_category_id`),
  ADD KEY `year_id` (`year_id`),
  ADD KEY `gender_id` (`gender_id`),
  ADD KEY `center_id` (`center_id`);

--
-- Indices de la tabla `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indices de la tabla `years`
--
ALTER TABLE `years`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `centers`
--
ALTER TABLE `centers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `genders`
--
ALTER TABLE `genders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `indicators`
--
ALTER TABLE `indicators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `indicator_categories`
--
ALTER TABLE `indicator_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `indicator_category_details`
--
ALTER TABLE `indicator_category_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `states`
--
ALTER TABLE `states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `years`
--
ALTER TABLE `years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `centers`
--
ALTER TABLE `centers`
  ADD CONSTRAINT `centers_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `indicator_categories`
--
ALTER TABLE `indicator_categories`
  ADD CONSTRAINT `indicator_categories_ibfk_1` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `indicator_category_details`
--
ALTER TABLE `indicator_category_details`
  ADD CONSTRAINT `indicator_category_details_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `indicator_category_details_ibfk_2` FOREIGN KEY (`indicator_category_id`) REFERENCES `indicator_categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `indicator_category_details_ibfk_3` FOREIGN KEY (`year_id`) REFERENCES `years` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `indicator_category_details_ibfk_4` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `states`
--
ALTER TABLE `states`
  ADD CONSTRAINT `states_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
