

-- INSERT INTO `marital_statuses`(`name`, `status`) VALUES
-- ('Soltero(a)','1'),
-- ('Casado(a)','1'),
-- ('Divorciado(a)','1'),
-- ('Viudo(a)','1');

INSERT INTO `years`(`name`, `status`) VALUES
    ('2000','1'),
    ('2001','1'),
    ('2002','1'),
    ('2003','1'),
    ('2004','1'),
    ('2005','1'),
    ('2006','1'),
    ('2007','1'),
    ('2008','1'),
    ('2009','1'),
    ('2010','1'),
    ('2011','1'),
    ('2012','1'),
    ('2013','1'),
    ('2014','1'),
    ('2015','1'),
    ('2016','1'),
    ('2017','1'),
    ('2018','1'),
    ('2019','1'),
    ('2020','1'),
    ('2021','1'),
    ('2022','1'),
    ('2023','1'),
    ('2024','1'),
    ('2025','1');

INSERT INTO `genders`(`name`, `status`) VALUES
    ('Femenino','1'),
    ('Masculino','1'),
    ('No especificado','1'),
    ('No identificado','1'),
    ('Otro','1');

INSERT INTO `countries`(`name`, `iso_code`, `demonym`, `status`) VALUES
    -- AMÉRICA DEL NORTE
    ('México', 'MEX', 'Mexicanos', '1'),
    ('Estados Unidos', 'USA', 'Estadounidenses', '1'),
    ('Canadá', 'CAN', 'Canadienses', '1'),

    -- CENTROAMÉRICA
    ('Belice', 'BLZ', 'Beliceños', '1'),
    ('Costa Rica', 'CRI', 'Costarricenses', '1'),
    ('El Salvador', 'SLV', 'Salvadoreños', '1'),
    ('Guatemala', 'GTM', 'Guatemaltecos', '1'),
    ('Honduras', 'HND', 'Hondureños', '1'),
    ('Nicaragua', 'NIC', 'Nicaragüenses', '1'),
    ('Panamá', 'PAN', 'Panameños', '1'),

    -- CARIBE
    ('Antigua y Barbuda', 'ATG', 'Antiguanos', '1'),
    ('Bahamas', 'BHS', 'Bahameños', '1'),
    ('Barbados', 'BRB', 'Barbadenses', '1'),
    ('Cuba', 'CUB', 'Cubanos', '1'),
    ('Dominica', 'DMA', 'Dominiqueses', '1'),
    ('República Dominicana', 'DOM', 'Dominicanos', '1'),
    ('Granada', 'GRD', 'Granadinos', '1'),
    ('Haití', 'HTI', 'Haitianos', '1'),
    ('Jamaica', 'JAM', 'Jamaiquinos', '1'),
    ('San Cristóbal y Nieves', 'KNA', 'Sancristobaleños', '1'),
    ('San Vicente y las Granadinas', 'VCT', 'Sanvicentinos', '1'),
    ('Santa Lucía', 'LCA', 'Santalucenses', '1'),
    ('Trinidad y Tobago', 'TTO', 'Trinitenses', '1'),

    -- SUDAMÉRICA
    ('Argentina', 'ARG', 'Argentinos', '1'),
    ('Bolivia', 'BOL', 'Bolivianos', '1'),
    ('Brasil', 'BRA', 'Brasileños', '1'),
    ('Chile', 'CHL', 'Chilenos', '1'),
    ('Colombia', 'COL', 'Colombianos', '1'),
    ('Ecuador', 'ECU', 'Ecuatorianos', '1'),
    ('Guyana', 'GUY', 'Guyaneses', '1'),
    ('Paraguay', 'PRY', 'Paraguayos', '1'),
    ('Perú', 'PER', 'Peruanos', '1'),
    ('Surinam', 'SUR', 'Surinameses', '1'),
    ('Uruguay', 'URY', 'Uruguayos', '1'),
    ('Venezuela', 'VEN', 'Venezolanos', '1');

INSERT INTO `states`(`country_id`, `name`, `demonym`, `iso_code`, `status`) VALUES
    -- México
    (1, 'Aguascalientes', 'Aguascalentenses', 'AGU', '1'),
    (1, 'Baja California', 'Bajacalifornianos', 'BCN', '1'),
    (1, 'Baja California Sur', 'Bajacalifornianos', 'BCS', '1'),
    (1, 'Campeche', 'Campechanos', 'CAM', '1'),
    (1, 'Chiapas', 'Chiapasenses', 'CHP', '1'),
    (1, 'Chihuahua', 'Chihuahuenses', 'CHH', '1'),
    (1, 'Ciudad de México', 'Capitalinos', 'CMX', '1'),
    (1, 'Coahuila de Zaragoza', 'Coahuilenses', 'COA', '1'),
    (1, 'Colima', 'Colimenses', 'COL', '1'),
    (1, 'Durango', 'Duranguenses', 'DUR', '1'),
    (1, 'Guanajuato', 'Guanajuatenses', 'GUA', '1'),
    (1, 'Guerrero', 'Guerrerenses', 'GRO', '1'),
    (1, 'Hidalgo', 'Hidalguenses', 'HID', '1'),
    (1, 'Jalisco', 'Jaliscienses', 'JAL', '1'),
    (1, 'México', 'Mexiquenses', 'MEX', '1'),
    (1, 'Michoacán de Ocampo', 'Michoacanos', 'MIC', '1'),
    (1, 'Morelos', 'Morelenses', 'MOR', '1'),
    (1, 'Nayarit', 'Nayaritas', 'NAY', '1'),
    (1, 'Nuevo León', 'Neoleoneses', 'NLE', '1'),
    (1, 'Oaxaca', 'Oaxaqueños', 'OAX', '1'),
    (1, 'Puebla', 'Poblanos', 'PUE', '1'),
    (1, 'Querétaro', 'Queretanos', 'QUE', '1'),
    (1, 'Quintana Roo', 'Quintanarroenses', 'ROO', '1'),
    (1, 'San Luis Potosí', 'Potosinos', 'SLP', '1'),
    (1, 'Sinaloa', 'Sinaloenses', 'SIN', '1'),
    (1, 'Sonora', 'Sonorenses', 'SON', '1'),
    (1, 'Tabasco', 'Tabasqueños', 'TAB', '1'),
    (1, 'Tamaulipas', 'Tamaulipecos', 'TAM', '1'),
    (1, 'Tlaxcala', 'Tlaxcaltecas', 'TLA', '1'),
    (1, 'Veracruz de Ignacio de la Llave', 'Veracruzanos', 'VER', '1'),
    (1, 'Yucatán', 'Yucatecos', 'YUC', '1'),
    (1, 'Zacatecas', 'Zacatecanos', 'ZAC', '1');

INSERT INTO `indicators` (`name`, `team`, `map`, `status`) VALUES 
    ('Delitos', '1', '1', '1');

INSERT INTO `indicator_categories`(`indicator_id`, `name`, `status`) VALUES 
    ('1','Aborto','1'),
    ('1','Abuso de autoridad','1'),
    ('1','Abuso de confianza','1'),
    ('1','Abuso sexual','1'),
    ('1','Acceso ilícito a sistemas o equipos informáticos','1'),
    ('1','Acopio ilícito de armas','1'),
    ('1','Acoso sexual','1'),
    ('1','Allanamiento de morada','1'),
    ('1','Amenazas','1'),
    ('1','Aprovechamiento de hidrocarburos y sus derivados','1'),
    ('1','Armas y objetos prohibidos','1'),
    ('1','Asociación delictuosa','1');

INSERT INTO `centers`(`state_id`, `name`, `locate`, `status`) VALUES
    ('1','','','1'),
    ('1','CENTRO PENITENCIARIO ESTATAL AGUASCALIENTES','','1'),
    ('1','CENTRO PENITENCIARIO ESTATAL EL LLANO','','1'),
    ('1','CENTRO PENITENCIARIO ESTATAL DE MUJERES','','1'),
    ('1','CENTRO ESTATAL PARA EL DESARROLLO DEL ADOLESCENTE','','1'),
    ('2','','','1'),
    ('2','CERESO MEXICALI','','1'),
    ('2','CERESO TIJUANA','','1'),
    ('2','CERESO ENSENADA','','1'),
    ('2','CERESO EL HONGO','','1'),
    ('2','CERESO EL HONGO II','','1'),
    ('2','CIA MEXICALI','','1'),
    ('2','CIA TIJUANA','','1'),
    ('2','CIA ENSENADA','','1'),
    ('2','CENTRO DE INTERNAMIENTO PARA ADOLESCENTES MEXICALI','','1'),
    ('2','CENTRO DE INTERNAMIENTO PARA ADOLESCENTES ENSENADA','','1'),
    ('2','CENTRO DE INTERNAMIENTO PARA ADOLESCENTES TIJUANA','','1'),
    ('3','','','1'),
    ('3','CENTRO PENITENCIARIO LA PAZ','','1'),
    ('3','CENTRO PENITENCIARIO SAN JOSE DEL CABO','','1'),
    ('3','CENTRO PENITENCIARIO CIUDAD CONSTITUCION','','1'),
    ('3','CENTRO PENITENCIARIO SANTA ROSALIA','','1'),
    ('3','CENTRO DE INTERNAMIENTO ESPECIALIZADO PARA ADOLESCENTES','','1');


