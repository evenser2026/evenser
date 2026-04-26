-- ============================================================
-- EVENSER - Datos reales de afiliados
-- Fuente: Planilla La Escondida 2026 + Planilla Col. Elisa (xlsx)
-- Ejecutar DESPUÉS del schema.sql
-- ============================================================

-- ============================================================
-- CLIENTES
-- Localidades inferidas por planilla de origen
-- Col. Elisa: planilla xlsx principal
-- La Escondida: planilla .docx sección "La Escondida"
-- La Verde, Lapachito: secciones al pie del .docx
-- Las Garcitas, Capitán Solari: notas en planillas
-- ============================================================

INSERT INTO clients (nombre, apellido, localidad) VALUES
-- === COLONIA ELISA (fuente: xlsx) ===
('Justo José',          'Avalos',              'Col. Elisa'),
('Ricardo Florencio',   'Avalos',              'Col. Elisa'),
('Rosa Mabel',          'Barreto',             'Col. Elisa'),
('Teresa Beatriz',      'Barrios',             'Col. Elisa'),
('Alberta',             'Bobadilla',           'Col. Elisa'),
('Maria Covadonga',     'Ordiz',               'Col. Elisa'),
('Adela',               'Rios',                'Col. Elisa'),
('Eugenio',             'Silguero',            'Col. Elisa'),
('Hilaria',             'Sosa',                'Col. Elisa'),
('Matilde',             'Tomadin',             'Col. Elisa'),
('Dominga Clara',       'Gonzalez',            'Col. Elisa'),
('Juanita',             'Gonzalez',            'Col. Elisa'),
('Margarita',           'Aguirre',             'Col. Elisa'),
('Susana Beatriz',      'Astudillo',           'Col. Elisa'),
('Lucio',               'Baldovino',           'Col. Elisa'),
('Victoria',            'Barberan',            'Col. Elisa'),
('Gladis Angela',       'Barrios',             'Col. Elisa'),
('Celestino',           'Benitez',             'Col. Elisa'),
('Omar',                'Bordon',              'Col. Elisa'),
('Norma Beatriz',       'Cardozo',             'Col. Elisa'),
('Abel Alberto',        'Codutti',             'Col. Elisa'),
('Griselda Lilian',     'Codutti',             'Col. Elisa'),
('Gregoria',            'Escobar',             'Col. Elisa'),
('Maria Graciela',      'Escobar',             'Col. Elisa'),
('Marilus',             'Ferrari',             'Col. Elisa'),
('Sabino Cristobal',    'Gimenez',             'Col. Elisa'),
('Javier de Jesus',     'Gomez',               'Col. Elisa'),
('Osbaldo',             'Gomez',               'Col. Elisa'),
('Maria',               'Gordiola',            'Col. Elisa'),
('Francisca',           'Fernandez',           'Col. Elisa'),
('Librada',             'Galeano',             'Col. Elisa'),
('Rafaela Rosa',        'Lopez',               'Col. Elisa'),
('Carlos Roberto',      'Mendez',              'Col. Elisa'),
('Blanca Ester',        'Montenegro',          'Col. Elisa'),
('Clara',               'Ocampo',              'Col. Elisa'),
('Dolores',             'Ocampo',              'Col. Elisa'),
('Alejandra',           'Palacios Silva',      'Col. Elisa'),
('Casimira',            'Piris',               'Col. Elisa'),
('Julia Ermelinda',     'Rios',                'Col. Elisa'),
('Anselma Leonor',      'Sanchez',             'Col. Elisa'),
('Liberato',            'Sosa',                'Col. Elisa'),
('Analia Soledad',      'Sotelo',              'Col. Elisa'),
('Soledad',             'Viana Fernandez',     'Col. Elisa'),
('Zulma Beatriz',       'Veron',               'Col. Elisa'),
('Maria Ignacia',       'Acosta',              'Col. Elisa'),
('Antonio',             'Romero',              'Col. Elisa'),
('Jose Luis',           'Fernandez',           'Col. Elisa'),
('Sonia Elisabeth',     'Layus',               'Col. Elisa'),
('Juan Martin',         'Winnik',              'Col. Elisa'),
('Valentin',            'Aguirre',             'Col. Elisa'),
('Luisa Soledad',       'Vargas',              'Col. Elisa'),
('Saluciana',           'Godoy',               'Col. Elisa'),
('Orlando Miguel',      'Moio',                'Col. Elisa'),
('Ramon Agustin',       'Arce',                'Col. Elisa'),
('Zulema Noemi',        'Senguer',             'Col. Elisa'),
('Hugo Orlando',        'Torres',              'Col. Elisa'),
('Selva Grisel',        'Romano',              'Col. Elisa'),
('Antolin Ramon',       'Figueroa',            'Col. Elisa'),
('Francisco Victorio',  'Agosto',              'Col. Elisa'),
('Avelina',             'Fernandez',           'Col. Elisa'),
('Albina Petrona',      'Andres',              'Col. Elisa'),
('Santa',               'Sanoff',              'Col. Elisa'),
('Leandro Luis',        'Cabrera',             'Col. Elisa'),
('Ruben',               'Martinez',            'Col. Elisa'),
('Nilda Ermelinda',     'Diaz',                'Col. Elisa'),
('Josefa Dominga',      'Cardozo',             'Col. Elisa'),
('Cristina',            'Romero',              'Col. Elisa'),
('Fabiana',             'Meza',                'Col. Elisa'),
('Antolin Esteban',     'Barrios',             'Col. Elisa'),
('Delma Gladys',        'Barrios',             'Col. Elisa'),
('Ramona Beatriz',      'Fernandez',           'Col. Elisa'),
('Vicenta Rosalia',     'Benitez',             'Col. Elisa'),
('Miguelina',           'Meza',                'Col. Elisa'),
('Miguel Angel',        'Pertiñez',            'Col. Elisa'),
('Fernando Raul',       'Benitez',             'Col. Elisa'),
('Lila Carmen',         'Gimenez',             'Col. Elisa'),
('Claudia Alejandra',   'Martinez',            'Col. Elisa'),
('Fulgencia',           'Basualdo',            'Col. Elisa'),
('Antonia Josefa',      'Veron',               'Col. Elisa'),
('Wenceslada',          'Ortega Silva',        'Col. Elisa'),
('Alfredo Efrain',      'Alfonzo',             'Col. Elisa'),
('Estanislada',         'Monzon',              'Col. Elisa'),
('Amelia Isabel',       'Alvarez',             'Col. Elisa'),
('Isabel',              'Fernandez',           'Col. Elisa'),
('Maria Antonia',       'Leonhard',            'Col. Elisa'),
('Nelida Antonia',      'Escobar',             'Col. Elisa'),
('Martires',            'Fernandez',           'Col. Elisa'),
('Maria Carmen',        'Segovia',             'Col. Elisa'),
('Juan',                'Escalante',           'Col. Elisa'),
('Hector David',        'Rojas',               'Col. Elisa'),
('Mirian Cristina',     'Acosta',              'Col. Elisa'),
('Rosa',                'Salgado',             'Col. Elisa'),
('Sixta',               'Sotelo',              'Col. Elisa'),
('Liboria Dorita',      'Espindola',           'Col. Elisa'),
('Ricardo Enrique',     'Paulon',              'Col. Elisa'),
('Paulino',             'Fernandez',           'Col. Elisa'),
('Natalia Leticia',     'Rios',                'Col. Elisa'),
('Graciela Esther',     'Pereira',             'Col. Elisa'),
('Esther',              'Barrios',             'Col. Elisa'),
('Ramona Lucia',        'Benitez',             'Col. Elisa'),
('Tomas Gregorio',      'Vera',                'Col. Elisa'),
('Adriana Alicia',      'Barberan',            'Col. Elisa'),
('Javier Armando',      'Arce',                'Col. Elisa'),
('Mirian Raquel',       'Roman',               'Col. Elisa'),
('Glady Pedro',         'Covalski',            'Col. Elisa'),
('Esther Beatriz',      'Senguer',             'Col. Elisa'),
('Ana Maria',           'Barrios',             'Col. Elisa'),
('Antonio B.',          'Britez',              'Col. Elisa'),
('Eugenia',             'Rios',                'Col. Elisa'),
('Maria Soledad',       'Martinez',            'Col. Elisa'),
('Benedicto Armando',   'Rios',                'Col. Elisa'),
('Amanda Raquel',       'Alvarez',             'Col. Elisa'),
('Nelly Emilia',        'Falcon',              'Col. Elisa'),
('Maria Amelia',        'Mazza',               'Col. Elisa'),
('Pedro Nolasco',       'Gonzales',            'Col. Elisa'),
('Hugo Daniel',         'Arevalo',             'Col. Elisa'),
('Carlos Fabian',       'Monzon',              'Col. Elisa'),
('Irma Norma',          'Sotelo',              'Col. Elisa'),
('Martha Celia',        'Lavia',               'Col. Elisa'),
('Alejandra Adela',     'Monzon',              'Col. Elisa'),
('Martire',             'Arce',                'Col. Elisa'),
('Carlos Alberto',      'De Vetak',            'Col. Elisa'),
('Griselda',            'Riquelme',            'Col. Elisa'),
('Sara Mirta',          'Aguirre',             'Col. Elisa'),
('Severa',              'Rojas',               'Col. Elisa'),
('Timoteo',             'Gonzalez',            'Col. Elisa'),
('Jose Eduardo',        'Gomez',               'Col. Elisa'),
('Demetrio',            'Alegre',              'Col. Elisa'),
('Cirilo',              'Sosa',                'Col. Elisa'),
('Palmira',             'Silguero',            'Col. Elisa'),
('Aurelio Enrique',     'Cardani',             'Col. Elisa'),
('Juana Ramona',        'Abatte',              'Col. Elisa'),
('Gregorio',            'Cespedes',            'Col. Elisa'),
('Mario Ramon',         'Castillo',            'Col. Elisa'),
('Eugenio Ricardo',     'Gomez',               'Col. Elisa'),
('Martires',            'Sosa',                'Col. Elisa'),
('Santiago Ramon',      'Barrientos',          'Col. Elisa'),
('Maria',               'Romero',              'Col. Elisa'),
('Fermina',             'Martinez',            'Col. Elisa'),
('Bernardina',          'Sotelo',              'Col. Elisa'),
('Graciela',            'Diaz',                'Col. Elisa'),
('Carlos Vicente',      'Torres',              'Col. Elisa'),
('Liliana Graciela',    'Arce',                'Col. Elisa'),
('Elvira',              'Marconi',             'Col. Elisa'),
('Mercedes',            'Moreira',             'Col. Elisa'),
('Amelia Monica',       'Gallardo',            'Col. Elisa'),
('Elba Beatriz',        'Veron',               'Col. Elisa'),
('Norma Isabel',        'Nuñez',               'Col. Elisa'),
('Glady',               'Dominguez',           'Col. Elisa'),
('Miguel Angel',        'Gomez',               'Col. Elisa'),

-- === LAS GARCITAS (mención en xlsx) ===
('Mercedes',            'Torres',              'Las Garcitas'),

-- === LA ESCONDIDA (fuente: docx) ===
('Martires',            'Arce',                'La Escondida'),
('Ramón',               'Medina',              'La Escondida'),
('Fabián',              'Gauna',               'La Escondida'),
('Griselda',            'Riquelme',            'La Escondida'),
('Margarita',           'Olivo',               'La Escondida'),
('Antonio',             'Romero',              'La Escondida'),
('Zulma',               'Iturri',              'La Escondida'),
('Patricia',            'Ruiz Diaz',           'La Escondida'),
('María',               'Segovia',             'La Escondida'),
('Francisco',           'Mendoza',             'La Escondida'),
('Elba',                'Verón',               'La Escondida'),
('Cristina',            'Romero',              'La Escondida'),
('Erlinda',             'Monzón',              'La Escondida'),
('Rita',                'Alegre',              'La Escondida'),
('Ruth',                'Mendoza',             'La Escondida'),
('Antonio',             'Britez',              'La Escondida'),
('Javier',              'Arce',                'La Escondida'),
('Bernardino',          'Avalos',              'La Escondida'),
('Sara',                'Aguirre',             'La Escondida'),
('Santa',               'Sanoff',              'La Escondida'),
('Alicia',              'Benitez',             'La Escondida'),
('Graciela',            'Pereyra',             'La Escondida'),
('Alfredo',             'Alfonso',             'La Escondida'),
('Esther',              'Sengher',             'La Escondida'),
('María',               'Leonard',             'La Escondida'),
('Wenseslada',          'Ortega Silva',        'La Escondida'),
('Hugo',                'Arevalos',            'La Escondida'),
('María',               'Masa',                'La Escondida'),
('Raquel',              'Alvarez',             'La Escondida'),
('Antonia',             'Verón',               'La Escondida'),
('Ana María',           'Barrios',             'La Escondida'),
('Carlos',              'Monzón',              'La Escondida'),
('Nelly Emilia',        'Falco',               'La Escondida'),
('Pedro',               'Covalsky',            'La Escondida'),
('Fulgencia',           'Basualdo',            'La Escondida'),
('Miguel Angel',        'Pertiñez',            'La Escondida'),
('Adela',               'Monzón',              'La Escondida'),
('Venedicto',           'Ríos',                'La Escondida'),
('Sonia',               'Ríos',                'La Escondida'),
('Natalia',             'Ríos',                'La Escondida'),
('Isabel',              'Fernandez',           'La Escondida'),
('Miguelina',           'Meza',                'La Escondida'),
('Mirian',              'Román',               'La Escondida'),
('Claudia',             'Martinez',            'La Escondida'),
('Norma',               'Sotelo',              'La Escondida'),
('Amelia',              'Alvarez',             'La Escondida'),
('Ramona',              'Fernandez',           'La Escondida'),
('Delma',               'Barrios',             'La Escondida'),
('Paulino',             'Fernandez',           'La Escondida'),
('Eugenia',             'Ríos',                'La Escondida'),
('Zulma',               'Verón',               'La Escondida'),
('Alicia N.',           'Diarte',              'La Escondida'),
('Romualdo',            'Torres',              'La Escondida'),
('Liliana',             'Arce',                'La Escondida'),
('Ramón',               'Gomez',               'La Escondida'),  -- (PASTOR)
('Jose Luis',           'Fernandez',           'La Escondida'),
('Juan Carlos',         'Pereña',              'La Escondida'),
('Matias',              'Romero',              'La Escondida'),
('Hector',              'Hoyos',               'La Escondida'),
('Sara',                'Lugo',                'La Escondida'),
('Lorenzo',             'Soto',                'La Escondida'),
('Antonia',             'Gonzalez',            'La Escondida'),
('Rosana',              'Britez',              'La Escondida'),
('Adela Esther',        'Encina',              'La Escondida'),
('Elda Beatriz',        'Delle',               'La Escondida'),
('Antonia',             'Saucedo',             'La Escondida'),
('Jose',                'Aquino',              'La Escondida'),
('Juana Dolores',       'Aquino',              'La Escondida'),
('Ramona',              'Benitez',             'La Escondida'),
('Santos',              'Segovia',             'La Escondida'),
('Jose Dolores',        'Mendoza',             'La Escondida'),
('Pedro',               'Fernandez',           'La Escondida'),
('Carmelina',           'Romero',              'La Escondida'),
('Jorge Cristian',      'Romero',              'La Escondida'),
('Norma',               'Garcia',              'La Escondida'),
('Teresa',              'Alcaraz',             'La Escondida'),
-- cuotas diferenciadas (Timoteo y Lavia registrados en docx con montos especiales)
('Timoteo',             'Gonzalez',            'La Escondida'),
('Martha',              'Lavia',               'La Escondida'),
('Silvia',              'Gauna',               'La Escondida'),
('Zulma',               'Gonzalez',            'La Escondida'),
('Norma V.',            'Vera',                'La Escondida'),
('Rosa de las Nieves',  'Koniuszyk',           'La Escondida'),
('Catalina A.',         'Paniagua',            'La Escondida'),
('Enrique René',        'Fernandez',           'La Escondida'),
('Jose Miguel',         'Molina',              'La Escondida'),
('María Luisa',         'Lopez',               'La Escondida'),
('Sara Noemí',          'Fernández',           'La Escondida'),
('Antonio',             'Galarza',             'La Escondida'),
('Fabiana',             'Meza',                'La Escondida'),

-- === LA VERDE (fuente: docx, sección "Afiliados de La Verde") ===
('María Elena L.',      'Suarez',              'La Verde'),
('Graciela',            'Dallmann',            'La Verde'),
('Patricia',            'Weisbacher',          'La Verde'),
('Antonio Martín',      'Sosa',                'La Verde'),
('Juan',                'Rodriguez',           'La Verde'),

-- === LAPACHITO (fuente: docx, sección "Afiliados de Lapachito") ===
('Manuel Jose',         'Jara',                'Lapachito'),
('Gregoria',            'Zeniquel',            'Lapachito'),
('Adriana',             'Barrios',             'Lapachito'),

-- === CAPITÁN SOLARI (fuente: xlsx, sección "Capitán Solari") ===
('Norma',               'Ojeda',               'Capitán Solari'),
('Felicita',            'Velazquez',           'Capitán Solari'),
('Juan',                'Galarza',             'Capitán Solari'),
('Carmen',              'Velazquez',           'Capitán Solari'),
('Celestino',           'Benitez',             'Capitán Solari'),

-- === CENTRO DE JUBILADOS COL. ELISA (xlsx) ===
('Ramona D.',           'Gonzalez',            'Col. Elisa'),
('Carmen',              'Obregon',             'Col. Elisa'),
('Bernabe',             'Alvarez',             'Col. Elisa'),
('Gregorio',            'Cabrera',             'Col. Elisa'),
('Rosa',                'Lopez',               'Col. Elisa'),
('Marcos Antonio',      'Romero',              'Col. Elisa'),
('Rito',                'Vera',                'Col. Elisa'),
('Antolin',             'Figueroa',            'Col. Elisa'),
('Ricardo',             'Avalos',              'Col. Elisa'),
('Anacleto',            'Alegre',              'Col. Elisa'),
('Cipriana',            'Cardozo',             'Col. Elisa'),
('Vicente',             'Torres',              'Col. Elisa'),
('Fermin',              'Acevedo',             'Col. Elisa'),

-- Adicionales Col. Elisa con cuota (xlsx)
('Gisela',              'Layus',               'Col. Elisa'),
('Maria Isabel',        'Luque',               'Col. Elisa'),
('Nahuel',              'Sotelo',              'Col. Elisa'),
('María',               'Fernandez',           'Col. Elisa'),
('Secundino',           'Almiron',             'Col. Elisa'),
('Francisca',           'Espinosa',            'Col. Elisa'),
('Marisa Cristina',     'Fernandez',           'Col. Elisa');


-- ============================================================
-- NÚCLEO FAMILIAR
-- Fuente: xlsx (columnas Nucleo Familiar / DNI / Fecha Nac.)
-- Se insertan referenciando al titular por DNI
-- ============================================================

-- Barreto Rosa Mabel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ojeda', 'Brijida', '6353942', 'Familiar'              FROM clients WHERE apellido='Barreto' AND nombre='Rosa Mabel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barreto Fiorella', 'Milagros', '47367879', 'Familiar' FROM clients WHERE apellido='Barreto' AND nombre='Rosa Mabel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Lorente Axel', 'Waldemar', '36113493', 'Familiar'     FROM clients WHERE apellido='Barreto' AND nombre='Rosa Mabel' LIMIT 1;

-- Silguero Eugenio
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Silguero', 'Sara', '36965736', 'Familiar'             FROM clients WHERE apellido='Silguero' AND nombre='Eugenio' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Romero', 'Sara', '11228918', 'Familiar'               FROM clients WHERE apellido='Silguero' AND nombre='Eugenio' LIMIT 1;

-- Gonzalez Dominga Clara
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Vera', 'Elba', '33987300', 'Familiar'                 FROM clients WHERE apellido='Gonzalez' AND nombre='Dominga Clara' LIMIT 1;

-- Gonzalez Juanita
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Vallejos', 'Victor', '21862545', 'Familiar'           FROM clients WHERE apellido='Gonzalez' AND nombre='Juanita' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Vallejos', 'Ester', '23512518', 'Familiar'            FROM clients WHERE apellido='Gonzalez' AND nombre='Juanita' LIMIT 1;

-- Astudillo Susana
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barrios Aylen', '', NULL, 'Familiar'                  FROM clients WHERE apellido='Astudillo' AND nombre='Susana Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barrios Elisa', '', NULL, 'Familiar'                  FROM clients WHERE apellido='Astudillo' AND nombre='Susana Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barroso', 'Lorenzo', NULL, 'Familiar'                 FROM clients WHERE apellido='Astudillo' AND nombre='Susana Beatriz' LIMIT 1;

-- Baldovino Lucio
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Baldovino Belquis', 'Ramona', '22239877', 'Cónyuge'   FROM clients WHERE apellido='Baldovino' AND nombre='Lucio' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Baldovino Mariano', 'Leonel', '49915113', 'Hijo/a'    FROM clients WHERE apellido='Baldovino' AND nombre='Lucio' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Baldovino Andrea', 'Elisabet', '37478921', 'Hijo/a'   FROM clients WHERE apellido='Baldovino' AND nombre='Lucio' LIMIT 1;

-- Barberan Victoria
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barberan', 'Geronimo', '42378800', 'Hijo/a'           FROM clients WHERE apellido='Barberan' AND nombre='Victoria' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barberan', 'Lazaro', '44036676', 'Hijo/a'             FROM clients WHERE apellido='Barberan' AND nombre='Victoria' LIMIT 1;

-- Benitez Celestino
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Cristaldo Hilda', 'de la Cruz', '12452741', 'Cónyuge' FROM clients WHERE apellido='Benitez' AND nombre='Celestino' LIMIT 1;

-- Bordon Omar
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Cardozo', 'Concepción', '5091181', 'Cónyuge'          FROM clients WHERE apellido='Bordon' AND nombre='Omar' LIMIT 1;

-- Cardozo Norma Beatriz
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Goméz Luis', 'Ramon', '21555982', 'Familiar'          FROM clients WHERE apellido='Cardozo' AND nombre='Norma Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Goméz Melina', 'Belén', '47385462', 'Familiar'        FROM clients WHERE apellido='Cardozo' AND nombre='Norma Beatriz' LIMIT 1;

-- Codutti Abel Alberto
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Codutti', 'Abel', '41866249', 'Hijo/a'                FROM clients WHERE apellido='Codutti' AND nombre='Abel Alberto' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Codutti', 'Milagros', '44804419', 'Hijo/a'            FROM clients WHERE apellido='Codutti' AND nombre='Abel Alberto' LIMIT 1;

-- Codutti Griselda Lilian
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mendoza Hector', 'Fabian', '23556277', 'Cónyuge'      FROM clients WHERE apellido='Codutti' AND nombre='Griselda Lilian' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mendoza Codutti Guillermo', 'M.', '47367829', 'Hijo/a' FROM clients WHERE apellido='Codutti' AND nombre='Griselda Lilian' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mendoza Codutti Daira', 'Aylen', '41866223', 'Hijo/a' FROM clients WHERE apellido='Codutti' AND nombre='Griselda Lilian' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mendoza Codutti Araceli', 'M.', '41866222', 'Hijo/a'  FROM clients WHERE apellido='Codutti' AND nombre='Griselda Lilian' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mendoza Codutti Nahiara', 'Aylin', '52248651', 'Hijo/a' FROM clients WHERE apellido='Codutti' AND nombre='Griselda Lilian' LIMIT 1;

-- Escobar Gregoria
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Guerra', 'Eduardo', '10391767', 'Familiar'            FROM clients WHERE apellido='Escobar' AND nombre='Gregoria' LIMIT 1;

-- Escobar Maria Graciela
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ortiz Nelson', 'Dario', '44386762', 'Familiar'        FROM clients WHERE apellido='Escobar' AND nombre='Maria Graciela' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ortiz', 'Jana', '45104199', 'Familiar'                FROM clients WHERE apellido='Escobar' AND nombre='Maria Graciela' LIMIT 1;

-- Gimenez Sabino Cristobal
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ferrari Irma', 'Ester', '21349692', 'Cónyuge'         FROM clients WHERE apellido='Gimenez' AND nombre='Sabino Cristobal' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gimenez Karen Andrea', 'Luz', '42378788', 'Hijo/a'    FROM clients WHERE apellido='Gimenez' AND nombre='Sabino Cristobal' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gimenez Cesar Leandro', 'E.', '39178109', 'Hijo/a'    FROM clients WHERE apellido='Gimenez' AND nombre='Sabino Cristobal' LIMIT 1;

-- Mendez Carlos Roberto
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rojas Catalina', 'Ester', '21971878', 'Cónyuge'       FROM clients WHERE apellido='Mendez' AND nombre='Carlos Roberto' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mendez Carlos', 'Lionel', '53787490', 'Hijo/a'         FROM clients WHERE apellido='Mendez' AND nombre='Carlos Roberto' LIMIT 1;

-- Montenegro Blanca Ester
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gauna', 'Samira', '37478946', 'Familiar'              FROM clients WHERE apellido='Montenegro' AND nombre='Blanca Ester' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Billordo', 'Lucas', '36020498', 'Familiar'            FROM clients WHERE apellido='Montenegro' AND nombre='Blanca Ester' LIMIT 1;

-- Ocampo Clara
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Dominguez', 'Matilde', '3694333', 'Familiar'          FROM clients WHERE apellido='Ocampo' AND nombre='Clara' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Garstein', 'Joel', '34046792', 'Familiar'             FROM clients WHERE apellido='Ocampo' AND nombre='Clara' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ibarra', 'Fidel', '29413484', 'Familiar'              FROM clients WHERE apellido='Ocampo' AND nombre='Clara' LIMIT 1;

-- Ocampo Dolores
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Abraham Nair', '', '34974962', 'Familiar'             FROM clients WHERE apellido='Ocampo' AND nombre='Dolores' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Abraham Amara', '', '52247823', 'Familiar'            FROM clients WHERE apellido='Ocampo' AND nombre='Dolores' LIMIT 1;

-- Piris Casimira
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mazza', 'Miguel', '14904646', 'Cónyuge'               FROM clients WHERE apellido='Piris' AND nombre='Casimira' LIMIT 1;

-- Sanchez Anselma Leonor
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Montiel', 'Osvaldo', '8534133', 'Familiar'            FROM clients WHERE apellido='Sanchez' AND nombre='Anselma Leonor' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Montiel Rolando', 'Gabriel', '36241723', 'Familiar'   FROM clients WHERE apellido='Sanchez' AND nombre='Anselma Leonor' LIMIT 1;

-- Sotelo Analia Soledad
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gusman Hector', 'Fabian', '30670325', 'Cónyuge'       FROM clients WHERE apellido='Sotelo' AND nombre='Analia Soledad' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gusman Hector', 'Luciano', '52247566', 'Hijo/a'       FROM clients WHERE apellido='Sotelo' AND nombre='Analia Soledad' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gusman Ulises', 'Nahuel', '46857970', 'Hijo/a'        FROM clients WHERE apellido='Sotelo' AND nombre='Analia Soledad' LIMIT 1;

-- Viana Fernandez Soledad
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez', 'Dominga', '6347679', 'Familiar'          FROM clients WHERE apellido='Viana Fernandez' AND nombre='Soledad' LIMIT 1;

-- Layus Sonia Elisabeth
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Baldovino Juan', 'Marcelo', '27404938', 'Cónyuge'     FROM clients WHERE apellido='Layus' AND nombre='Sonia Elisabeth' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Baldovino Jeremias', 'Uriel', '50623091', 'Hijo/a'    FROM clients WHERE apellido='Layus' AND nombre='Sonia Elisabeth' LIMIT 1;

-- Winnik Juan Martin
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Winnik Victoria', 'Lucia', '13873267', 'Cónyuge'      FROM clients WHERE apellido='Winnik' AND nombre='Juan Martin' LIMIT 1;

-- Aguirre Valentin
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Escobar Delia', 'Ramona', '20595853', 'Cónyuge'       FROM clients WHERE apellido='Aguirre' AND nombre='Valentin' LIMIT 1;

-- Vargas Luisa Soledad
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rios Vargas', 'Lazaro', '49773112', 'Hijo/a'          FROM clients WHERE apellido='Vargas' AND nombre='Luisa Soledad' LIMIT 1;

-- Arce Ramon Agustin
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arce Brenda', 'Brisa', '50461720', 'Hijo/a'           FROM clients WHERE apellido='Arce' AND nombre='Ramon Agustin' LIMIT 1;

-- Torres Hugo Orlando
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Sosa Nuri', 'Graciela', '25332963', 'Cónyuge'         FROM clients WHERE apellido='Torres' AND nombre='Hugo Orlando' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Torres Abril', 'Sofia', '46777875', 'Hijo/a'          FROM clients WHERE apellido='Torres' AND nombre='Hugo Orlando' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Torres', 'Luz', '52748899', 'Hijo/a'                  FROM clients WHERE apellido='Torres' AND nombre='Hugo Orlando' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Torres Carlos', 'Antonio', '48894282', 'Hijo/a'       FROM clients WHERE apellido='Torres' AND nombre='Hugo Orlando' LIMIT 1;

-- Romano Selva Grisel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Martin', 'G.', '30303119', 'Familiar'       FROM clients WHERE apellido='Romano' AND nombre='Selva Grisel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Peralta', 'Agustin', '46777887', 'Familiar'           FROM clients WHERE apellido='Romano' AND nombre='Selva Grisel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez', 'Julieta', '52248606', 'Familiar'         FROM clients WHERE apellido='Romano' AND nombre='Selva Grisel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Martin', 'A.', '53397303', 'Familiar'       FROM clients WHERE apellido='Romano' AND nombre='Selva Grisel' LIMIT 1;

-- Figueroa Antolin Ramon
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barrientos Teresa', 'Ramona', '6028471', 'Cónyuge'    FROM clients WHERE apellido='Figueroa' AND nombre='Antolin Ramon' LIMIT 1;

-- Diaz Nilda Ermelinda
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Vargas Hugo', 'Angel', '28496861', 'Familiar'         FROM clients WHERE apellido='Diaz' AND nombre='Nilda Ermelinda' LIMIT 1;

-- Cardozo Josefa Dominga
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ibarra Ramon', 'Rodolfo', '7537550', 'Familiar'       FROM clients WHERE apellido='Cardozo' AND nombre='Josefa Dominga' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ibarra Miguel', 'Angel', '27850340', 'Familiar'       FROM clients WHERE apellido='Cardozo' AND nombre='Josefa Dominga' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ibarra Jenifer', 'Xiomara', '45104137', 'Familiar'    FROM clients WHERE apellido='Cardozo' AND nombre='Josefa Dominga' LIMIT 1;

-- Meza Fabiana (Col. Elisa)
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Meza Vicente', 'Alberto', '29897152', 'Cónyuge'       FROM clients WHERE apellido='Meza' AND nombre='Fabiana' AND localidad='Col. Elisa' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Meza Ramon', 'Oscar', '27554330', 'Hijo/a'            FROM clients WHERE apellido='Meza' AND nombre='Fabiana' AND localidad='Col. Elisa' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Meza Melina', 'Narela', '45651922', 'Hijo/a'          FROM clients WHERE apellido='Meza' AND nombre='Fabiana' AND localidad='Col. Elisa' LIMIT 1;

-- Barrios Antolin Esteban
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gomez', 'Isabel', '2426017', 'Familiar'               FROM clients WHERE apellido='Barrios' AND nombre='Antolin Esteban' LIMIT 1;

-- Barrios Delma Gladys
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Leiva Martin', 'Leonardo', '31688990', 'Familiar'     FROM clients WHERE apellido='Barrios' AND nombre='Delma Gladys' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Leiva Lucas', 'Ramon', '36892577', 'Familiar'         FROM clients WHERE apellido='Barrios' AND nombre='Delma Gladys' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Barrios', 'Candelario', '7446808', 'Familiar'         FROM clients WHERE apellido='Barrios' AND nombre='Delma Gladys' LIMIT 1;

-- Fernandez Ramona Beatriz
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rodriguez Maximiliano', 'Ramon', '33930463', 'Familiar' FROM clients WHERE apellido='Fernandez' AND nombre='Ramona Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rodriguez Ramon', 'Apolinario', '11722591', 'Familiar' FROM clients WHERE apellido='Fernandez' AND nombre='Ramona Beatriz' LIMIT 1;

-- Benitez Vicenta Rosalia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Romero', 'Luis', '11866071', 'Familiar'               FROM clients WHERE apellido='Benitez' AND nombre='Vicenta Rosalia' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Romero Laureana', 'Agustina', '45104104', 'Familiar'  FROM clients WHERE apellido='Benitez' AND nombre='Vicenta Rosalia' LIMIT 1;

-- Meza Miguelina
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Cabrera Fernando', 'Luis', '17776679', 'Familiar'     FROM clients WHERE apellido='Meza' AND nombre='Miguelina' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Cabrera Leandro', 'Luis', '37322513', 'Familiar'      FROM clients WHERE apellido='Meza' AND nombre='Miguelina' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Benitez Ruben', 'Domingo', '20263653', 'Familiar'     FROM clients WHERE apellido='Meza' AND nombre='Miguelina' LIMIT 1;

-- Pertiñez Miguel Angel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Dominguez', 'Silveria', '6074316', 'Familiar'         FROM clients WHERE apellido='Pertiñez' AND nombre='Miguel Angel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Pertiñez David Cesar', 'A.', '22337344', 'Hijo/a'    FROM clients WHERE apellido='Pertiñez' AND nombre='Miguel Angel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Dominguez', 'de Jesus', '5227065', 'Familiar'         FROM clients WHERE apellido='Pertiñez' AND nombre='Miguel Angel' LIMIT 1;

-- Gimenez Lila Carmen
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Meza Ramon', 'A.', '11866093', 'Familiar'             FROM clients WHERE apellido='Gimenez' AND nombre='Lila Carmen' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Meza', 'Sergio A.', '29552853', 'Familiar'            FROM clients WHERE apellido='Gimenez' AND nombre='Lila Carmen' LIMIT 1;

-- Ortega Silva Wenceslada
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Sanchez Felix', 'Maria', '92247534', 'Familiar'       FROM clients WHERE apellido='Ortega Silva' AND nombre='Wenceslada' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Sanchez Jaquelina', 'Elisabet', '43479929', 'Familiar' FROM clients WHERE apellido='Ortega Silva' AND nombre='Wenceslada' LIMIT 1;

-- Alfonzo Alfredo Efrain
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Perez', 'Amalia', '6074347', 'Cónyuge'               FROM clients WHERE apellido='Alfonzo' AND nombre='Alfredo Efrain' LIMIT 1;

-- Alvarez Amelia Isabel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Baez Patricia', 'Ines', '36892590', 'Familiar'        FROM clients WHERE apellido='Alvarez' AND nombre='Amelia Isabel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Buittoni Morena Fabiana', 'Ines', '53910871', 'Familiar' FROM clients WHERE apellido='Alvarez' AND nombre='Amelia Isabel' LIMIT 1;

-- Fernandez Isabel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Garcia', 'Mario', '10277947', 'Familiar'              FROM clients WHERE apellido='Fernandez' AND nombre='Isabel' AND localidad='Col. Elisa' LIMIT 1;

-- Leonhard Maria Antonia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Suarez Ramon', 'Dante', '22955073', 'Familiar'        FROM clients WHERE apellido='Leonhard' AND nombre='Maria Antonia' LIMIT 1;

-- Fernandez Martires
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Ana', 'Beatriz', '26615349', 'Familiar'     FROM clients WHERE apellido='Fernandez' AND nombre='Martires' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Melisa', 'Katherina', '45104158', 'Familiar' FROM clients WHERE apellido='Fernandez' AND nombre='Martires' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Lara', 'Jacqueline', '40181339', 'Familiar' FROM clients WHERE apellido='Fernandez' AND nombre='Martires' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Leiva Mario', 'A.', '31688994', 'Familiar'            FROM clients WHERE apellido='Fernandez' AND nombre='Martires' LIMIT 1;

-- Segovia Maria Carmen
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arce', 'Ricardo', '26517969', 'Familiar'              FROM clients WHERE apellido='Segovia' AND nombre='Maria Carmen' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arce Patricia', 'Daniela', '39615066', 'Familiar'     FROM clients WHERE apellido='Segovia' AND nombre='Maria Carmen' LIMIT 1;

-- Escalante Juan
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Almiron Angeles', 'Ailen', '46777575', 'Familiar'     FROM clients WHERE apellido='Escalante' AND nombre='Juan' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Almiron Miqueas Angel', 'Daniel', '47857315', 'Familiar' FROM clients WHERE apellido='Escalante' AND nombre='Juan' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Lugo Ramona', 'Ester', '21849579', 'Familiar'         FROM clients WHERE apellido='Escalante' AND nombre='Juan' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Escalante Jose', 'Andres', '39615014', 'Familiar'     FROM clients WHERE apellido='Escalante' AND nombre='Juan' LIMIT 1;

-- Rojas Hector David
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rojas', 'Carlos', '7537121', 'Familiar'               FROM clients WHERE apellido='Rojas' AND nombre='Hector David' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Aguirre Mariela', 'Veronica', '23031229', 'Cónyuge'   FROM clients WHERE apellido='Rojas' AND nombre='Hector David' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rojas Fatima Veronica', 'G.', '43479980', 'Hijo/a'   FROM clients WHERE apellido='Rojas' AND nombre='Hector David' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rojas Lourdes Aldana', 'Mariel', '44086686', 'Hijo/a' FROM clients WHERE apellido='Rojas' AND nombre='Hector David' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rojas Jeremias', 'David', '48549863', 'Hijo/a'        FROM clients WHERE apellido='Rojas' AND nombre='Hector David' LIMIT 1;

-- Acosta Mirian Cristina
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Encina Jorge', 'Raul', '17776689', 'Cónyuge'          FROM clients WHERE apellido='Acosta' AND nombre='Mirian Cristina' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Encina Alexis Wilson', 'Gaston', '38965651', 'Hijo/a' FROM clients WHERE apellido='Acosta' AND nombre='Mirian Cristina' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Encina Milton Nahuel', 'Norberto', '37322535', 'Hijo/a' FROM clients WHERE apellido='Acosta' AND nombre='Mirian Cristina' LIMIT 1;

-- Salgado Rosa
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Perez Lautaro', 'Nahuel', '44086611', 'Familiar'      FROM clients WHERE apellido='Salgado' AND nombre='Rosa' LIMIT 1;

-- Sotelo Sixta
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Abalos', 'Osvaldo', '20968411', 'Familiar'            FROM clients WHERE apellido='Sotelo' AND nombre='Sixta' LIMIT 1;

-- Espindola Liboria Dorita
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Mendoza', 'Francisco', '8005023', 'Familiar'          FROM clients WHERE apellido='Espindola' AND nombre='Liboria Dorita' LIMIT 1;

-- Paulon Ricardo Enrique
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Leiva', 'Mercedes', '11223137', 'Familiar'            FROM clients WHERE apellido='Paulon' AND nombre='Ricardo Enrique' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Paulon Ivan', 'Alejandro', '39615052', 'Hijo/a'       FROM clients WHERE apellido='Paulon' AND nombre='Ricardo Enrique' LIMIT 1;

-- Fernandez Paulino
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Segovia', 'Paulina', '10908483', 'Cónyuge'            FROM clients WHERE apellido='Fernandez' AND nombre='Paulino' LIMIT 1;

-- Rios Natalia Leticia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Nuñez Cesar', 'Damian', '47225233', 'Familiar'        FROM clients WHERE apellido='Rios' AND nombre='Natalia Leticia' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Nuñez Andres', 'Julian', '50919272', 'Familiar'       FROM clients WHERE apellido='Rios' AND nombre='Natalia Leticia' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Nuñez Pablo', 'Cesar', '24181293', 'Familiar'         FROM clients WHERE apellido='Rios' AND nombre='Natalia Leticia' LIMIT 1;

-- Pereira Graciela Esther
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Nuñez Juan', 'Carlos', '8046763', 'Familiar'          FROM clients WHERE apellido='Pereira' AND nombre='Graciela Esther' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rios Sonia', 'del Pilar', '22205120', 'Familiar'      FROM clients WHERE apellido='Pereira' AND nombre='Graciela Esther' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Avila Pedro', 'Juan', '18512339', 'Familiar'          FROM clients WHERE apellido='Pereira' AND nombre='Graciela Esther' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Avila Lucas', 'Ivan', '43160870', 'Familiar'          FROM clients WHERE apellido='Pereira' AND nombre='Graciela Esther' LIMIT 1;

-- Barrios Esther
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Escobar Santiago Marcos', 'P.', '40181308', 'Familiar' FROM clients WHERE apellido='Barrios' AND nombre='Esther' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Romero Ramon', 'Ignacio', '7921010', 'Familiar'        FROM clients WHERE apellido='Barrios' AND nombre='Esther' LIMIT 1;

-- Benitez Ramona Lucia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Lopez', 'Santo', '11866062', 'Familiar'               FROM clients WHERE apellido='Benitez' AND nombre='Ramona Lucia' LIMIT 1;

-- Vera Tomas Gregorio
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Vera Carola', 'Judith', '45104187', 'Hijo/a'          FROM clients WHERE apellido='Vera' AND nombre='Tomas Gregorio' LIMIT 1;

-- Barberan Adriana Alicia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Minig Catalina', 'Morena', '54044319', 'Familiar'     FROM clients WHERE apellido='Barberan' AND nombre='Adriana Alicia' LIMIT 1;

-- Arce Javier Armando
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Silva Romina', 'Carla', '31688921', 'Cónyuge'         FROM clients WHERE apellido='Arce' AND nombre='Javier Armando' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arce Ivan', 'Agustin', '56839144', 'Hijo/a'           FROM clients WHERE apellido='Arce' AND nombre='Javier Armando' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arce Tiziano', 'Benjamin', '54045982', 'Hijo/a'       FROM clients WHERE apellido='Arce' AND nombre='Javier Armando' LIMIT 1;

-- Roman Mirian Raquel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Durant Gerardo', 'Dante', '13232145', 'Cónyuge'       FROM clients WHERE apellido='Roman' AND nombre='Mirian Raquel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Durant Rocio', 'Belen', '36892509', 'Hijo/a'          FROM clients WHERE apellido='Roman' AND nombre='Mirian Raquel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Durant Franco', 'Fernando', '32752976', 'Hijo/a'      FROM clients WHERE apellido='Roman' AND nombre='Mirian Raquel' LIMIT 1;

-- Covalski Glady Pedro
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Cardozo', 'Francisca', '16703717', 'Cónyuge'          FROM clients WHERE apellido='Covalski' AND nombre='Glady Pedro' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Covalski Martin', 'Esteban', '39615051', 'Hijo/a'     FROM clients WHERE apellido='Covalski' AND nombre='Glady Pedro' LIMIT 1;

-- Senguer Esther Beatriz
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Perez', 'Marcelino', '7930449', 'Cónyuge'             FROM clients WHERE apellido='Senguer' AND nombre='Esther Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Perez Gomez Brisa', 'Milagros', '42732548', 'Familiar' FROM clients WHERE apellido='Senguer' AND nombre='Esther Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Perez Sengher Ignacio', 'B.', '41278750', 'Familiar'  FROM clients WHERE apellido='Senguer' AND nombre='Esther Beatriz' LIMIT 1;

-- Barrios Ana Maria
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Nestor', 'Ezequiel', '42732573', 'Familiar' FROM clients WHERE apellido='Barrios' AND nombre='Ana Maria' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arce', 'Armando', '10908487', 'Familiar'              FROM clients WHERE apellido='Barrios' AND nombre='Ana Maria' LIMIT 1;

-- Rios Eugenia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Rios Mario', 'Oscar', '27002044', 'Familiar'          FROM clients WHERE apellido='Rios' AND nombre='Eugenia' LIMIT 1;

-- Martinez Maria Soledad
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gomez', 'Epifania', '18105568', 'Familiar'            FROM clients WHERE apellido='Martinez' AND nombre='Maria Soledad' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Martinez', 'Domingo', '13745894', 'Familiar'          FROM clients WHERE apellido='Martinez' AND nombre='Maria Soledad' LIMIT 1;

-- Alvarez Amanda Raquel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Lopez', 'Milagros', NULL, 'Familiar'                  FROM clients WHERE apellido='Alvarez' AND nombre='Amanda Raquel' LIMIT 1;

-- Falcon Nelly Emilia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Faule Ida', 'Blandina', '7144317', 'Familiar'         FROM clients WHERE apellido='Falcon' AND nombre='Nelly Emilia' LIMIT 1;

-- Mazza Maria Amelia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez', 'Fortunato', '7902937', 'Familiar'        FROM clients WHERE apellido='Mazza' AND nombre='Maria Amelia' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez', 'Adrian', '25332901', 'Familiar'          FROM clients WHERE apellido='Mazza' AND nombre='Maria Amelia' LIMIT 1;

-- Gonzales Pedro Nolasco
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gomez', 'Ramona', '6074350', 'Cónyuge'               FROM clients WHERE apellido='Gonzales' AND nombre='Pedro Nolasco' LIMIT 1;

-- Arevalo Hugo Daniel
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arevalo', 'Veronica', NULL, 'Familiar'                FROM clients WHERE apellido='Arevalo' AND nombre='Hugo Daniel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arevalo', 'Jorge', NULL, 'Familiar'                   FROM clients WHERE apellido='Arevalo' AND nombre='Hugo Daniel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arevalo', 'Benjamin', NULL, 'Familiar'                FROM clients WHERE apellido='Arevalo' AND nombre='Hugo Daniel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Arevalo Maria', 'del Carmen', NULL, 'Familiar'        FROM clients WHERE apellido='Arevalo' AND nombre='Hugo Daniel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Caballero', 'Genara', NULL, 'Familiar'                FROM clients WHERE apellido='Arevalo' AND nombre='Hugo Daniel' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Roman Nadia', 'Magali', NULL, 'Familiar'              FROM clients WHERE apellido='Arevalo' AND nombre='Hugo Daniel' LIMIT 1;

-- Monzon Carlos Fabian
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Monzon', 'Erlinda', '4177756', 'Familiar'             FROM clients WHERE apellido='Monzon' AND nombre='Carlos Fabian' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Ayala', 'Erminda', '3919121', 'Familiar'              FROM clients WHERE apellido='Monzon' AND nombre='Carlos Fabian' LIMIT 1;

-- Lavia Martha Celia
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Escobar Victor', 'Hugo', '14948810', 'Familiar'       FROM clients WHERE apellido='Lavia' AND nombre='Martha Celia' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Lavia Raul', 'Lorenzo', '7514249', 'Familiar'         FROM clients WHERE apellido='Lavia' AND nombre='Martha Celia' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Baez Ramona', 'Delia', '4178354', 'Familiar'          FROM clients WHERE apellido='Lavia' AND nombre='Martha Celia' LIMIT 1;

-- De Vetak Carlos Alberto
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Nuñez', 'Laura', '11722567', 'Familiar'               FROM clients WHERE apellido='De Vetak' AND nombre='Carlos Alberto' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'De Vetak Danilo', 'Ezequiel', '39615097', 'Hijo/a'   FROM clients WHERE apellido='De Vetak' AND nombre='Carlos Alberto' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Flores De Vetak Pablo', 'Gustavo', '43697625', 'Hijo/a' FROM clients WHERE apellido='De Vetak' AND nombre='Carlos Alberto' LIMIT 1;

-- Riquelme Griselda (Col. Elisa)
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Alicia', 'Susana', '36369296', 'Familiar'   FROM clients WHERE apellido='Riquelme' AND nombre='Griselda' AND localidad='Col. Elisa' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Riquelme', 'Isabel', '21111336', 'Familiar'           FROM clients WHERE apellido='Riquelme' AND nombre='Griselda' AND localidad='Col. Elisa' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Acuña Priscila Aixa', 'Anabella', '41413547', 'Familiar' FROM clients WHERE apellido='Riquelme' AND nombre='Griselda' AND localidad='Col. Elisa' LIMIT 1;

-- Aguirre Sara Mirta
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Paulon Carlos', 'Maria', '4700288', 'Familiar'        FROM clients WHERE apellido='Aguirre' AND nombre='Sara Mirta' LIMIT 1;

-- Rojas Severa
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Alegre Carlos', 'Alberto', '29897116', 'Familiar'     FROM clients WHERE apellido='Rojas' AND nombre='Severa' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Alegre Claudio', 'Andres', '26955975', 'Familiar'     FROM clients WHERE apellido='Rojas' AND nombre='Severa' LIMIT 1;

-- Gonzalez Timoteo (Col. Elisa)
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Vera', 'Maria', '5860628', 'Cónyuge'                  FROM clients WHERE apellido='Gonzalez' AND nombre='Timoteo' AND localidad='Col. Elisa' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gonzalez Daniel', 'Omar', '28496826', 'Hijo/a'        FROM clients WHERE apellido='Gonzalez' AND nombre='Timoteo' AND localidad='Col. Elisa' LIMIT 1;

-- Gomez Jose Eduardo
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Maria', 'del Carmen', '26604096', 'Cónyuge' FROM clients WHERE apellido='Gomez' AND nombre='Jose Eduardo' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gomez Estefani', 'Areli', '54179013', 'Hijo/a'        FROM clients WHERE apellido='Gomez' AND nombre='Jose Eduardo' LIMIT 1;

-- Alegre Demetrio
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Prado Patricia', 'Soledad', '39180798', 'Cónyuge'     FROM clients WHERE apellido='Alegre' AND nombre='Demetrio' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Alegre Joao', 'Sebastian', '54835450', 'Hijo/a'       FROM clients WHERE apellido='Alegre' AND nombre='Demetrio' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Alegre Luana', 'Berenice', '55984186', 'Hijo/a'       FROM clients WHERE apellido='Alegre' AND nombre='Demetrio' LIMIT 1;

-- Abatte Juana Ramona
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Sanchez Mario', 'Jose', '11117938', 'Familiar'        FROM clients WHERE apellido='Abatte' AND nombre='Juana Ramona' LIMIT 1;

-- Cespedes Gregorio
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Paz', 'Raimunda', '11117986', 'Cónyuge'              FROM clients WHERE apellido='Cespedes' AND nombre='Gregorio' LIMIT 1;

-- Castillo Mario Ramon
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Jara', 'Inocencia', '13345006', 'Cónyuge'            FROM clients WHERE apellido='Castillo' AND nombre='Mario Ramon' LIMIT 1;

-- Sosa Martires
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez', 'Dolores', '5758701', 'Familiar'          FROM clients WHERE apellido='Sosa' AND nombre='Martires' LIMIT 1;

-- Barrientos Santiago Ramon
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Fernandez Dora', 'Felisa', '11228975', 'Familiar'     FROM clients WHERE apellido='Barrientos' AND nombre='Santiago Ramon' LIMIT 1;

-- Sotelo Bernardina
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gonzales', 'Martin', '8005307', 'Familiar'            FROM clients WHERE apellido='Sotelo' AND nombre='Bernardina' LIMIT 1;

-- Diaz Graciela
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gomez Francisco', 'Antonio', '12512034', 'Familiar'   FROM clients WHERE apellido='Diaz' AND nombre='Graciela' LIMIT 1;

-- Arce Liliana Graciela
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Romero Arce', 'Jacqueline', '52974112', 'Hijo/a'      FROM clients WHERE apellido='Arce' AND nombre='Liliana Graciela' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Romero Arce Marisol', 'E.', '52974113', 'Hijo/a'     FROM clients WHERE apellido='Arce' AND nombre='Liliana Graciela' LIMIT 1;

-- Gallardo Amelia Monica
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gallardo', 'Martin', '43479963', 'Familiar'           FROM clients WHERE apellido='Gallardo' AND nombre='Amelia Monica' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Nuñez', 'Gustavo', '39615611', 'Familiar'             FROM clients WHERE apellido='Gallardo' AND nombre='Amelia Monica' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Yedro', 'Miguel', '17596189', 'Familiar'              FROM clients WHERE apellido='Gallardo' AND nombre='Amelia Monica' LIMIT 1;

-- Veron Elba Beatriz
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gallardo Pablo', 'Luis', '23417217', 'Familiar'       FROM clients WHERE apellido='Veron' AND nombre='Elba Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Gallardo Gabriel', 'Antonio', '17505682', 'Familiar'  FROM clients WHERE apellido='Veron' AND nombre='Elba Beatriz' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Delseggio Damian', 'Josue', '48339812', 'Familiar'    FROM clients WHERE apellido='Veron' AND nombre='Elba Beatriz' LIMIT 1;

-- Dominguez Glady
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Calvo', 'Guillermo', '43067249', 'Familiar'           FROM clients WHERE apellido='Dominguez' AND nombre='Glady' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Calvo Gaston', 'Edwin', '39615049', 'Familiar'        FROM clients WHERE apellido='Dominguez' AND nombre='Glady' LIMIT 1;
INSERT INTO family_members (cliente_id, nombre, apellido, dni, parentesco)
SELECT id, 'Calvo Silvana', 'Melina', '31688936', 'Familiar'      FROM clients WHERE apellido='Dominguez' AND nombre='Glady' LIMIT 1;


-- ============================================================
-- CONVENIOS
-- Centro de Jubilados Col. Elisa y La Escondida: datos reales
-- ============================================================

INSERT INTO agreements (nombre, tipo, contacto, servicios_prepagos, servicios_usados, saldo_favor) VALUES
  ('Centro de Jubilados Colonia Elisa', 'centro_jubilados', NULL, 0, 0, 0.00),
  ('Afiliados La Escondida',            'localidad',        NULL, 0, 0, 0.00),
  ('Afiliados La Verde',                'localidad',        NULL, 0, 0, 0.00),
  ('Afiliados Lapachito',               'localidad',        NULL, 0, 0, 0.00),
  ('Afiliados Capitán Solari',          'localidad',        NULL, 0, 0, 0.00);