-- ============================================================
-- EVENSER - Datos de ejemplo (seed)
-- Ejecutar DESPUÉS del schema.sql
-- ============================================================

-- Clientes de ejemplo
INSERT INTO clients (nombre, apellido, dni, telefono, ocupacion, obra_social, localidad, carpeta_nacimiento) VALUES
  ('María Elena', 'González', '18543210', '3624155200', 'Ama de casa', 'PAMI', 'Col. Elisa', 'CF-001'),
  ('Roberto', 'Sánchez', '24876543', '3624266310', 'Comerciante', 'OSDE', 'La Escondida', 'CF-002'),
  ('Carmen', 'López', '31209876', '3624377420', 'Docente', 'IOMA', 'Tirol', 'CF-003'),
  ('Juan Carlos', 'Martínez', '15678901', '3624488530', 'Jubilado', 'PAMI', 'La Verde', 'CF-004'),
  ('Ana Rosa', 'Fernández', '27345678', '3624599640', 'Empleada', 'Swiss Medical', 'Colonias Unidas', 'CF-005'),
  ('Pedro', 'Díaz', '33112233', '3624610750', 'Agricultor', NULL, 'Las Garcitas', 'CF-006'),
  ('Lucía', 'Romero', '29988776', '3624721860', 'Enfermera', 'OSECAC', 'Col. Elisa', 'CF-007'),
  ('Héctor', 'Torres', '20654321', '3624832970', 'Mecánico', NULL, 'La Escondida', 'CF-008');

-- Familiares de ejemplo (para el primer cliente)
INSERT INTO family_members (cliente_id, nombre, apellido, dni, edad, parentesco)
SELECT id, 'Carlos Alberto', 'González', '48112233', 35, 'Hijo'
FROM clients WHERE dni = '18543210';

INSERT INTO family_members (cliente_id, nombre, apellido, dni, edad, parentesco)
SELECT id, 'Patricia', 'González', '50998877', 32, 'Hija'
FROM clients WHERE dni = '18543210';

INSERT INTO family_members (cliente_id, nombre, apellido, dni, edad, parentesco)
SELECT id, 'Jorge Luis', 'Sánchez', '27115544', 45, 'Cónyuge'
FROM clients WHERE dni = '24876543';

-- Pagos de ejemplo
INSERT INTO payments (cliente_id, monto, fecha, metodo_pago, estado, tipo_pago, descripcion)
SELECT id, 4500.00, CURRENT_DATE - INTERVAL '5 days', 'efectivo', 'pagado', 'mensual', 'Cuota noviembre 2024'
FROM clients WHERE dni = '18543210';

INSERT INTO payments (cliente_id, monto, fecha, metodo_pago, estado, tipo_pago, descripcion)
SELECT id, 4500.00, CURRENT_DATE - INTERVAL '35 days', 'mercado_pago', 'vencido', 'mensual', 'Cuota octubre 2024'
FROM clients WHERE dni = '24876543';

INSERT INTO payments (cliente_id, monto, fecha, metodo_pago, estado, tipo_pago, descripcion)
SELECT id, 4500.00, CURRENT_DATE - INTERVAL '2 days', 'transferencia', 'pagado', 'mensual', 'Cuota noviembre 2024'
FROM clients WHERE dni = '31209876';

INSERT INTO payments (cliente_id, monto, fecha, metodo_pago, estado, tipo_pago, descripcion)
SELECT id, 9000.00, CURRENT_DATE, 'efectivo', 'pagado', 'unico', 'Servicio de cremación'
FROM clients WHERE dni = '15678901';

INSERT INTO payments (cliente_id, monto, fecha, metodo_pago, estado, tipo_pago, descripcion)
SELECT id, 4500.00, CURRENT_DATE - INTERVAL '60 days', 'efectivo', 'vencido', 'mensual', 'Cuota septiembre 2024'
FROM clients WHERE dni = '27345678';

-- Servicios de ejemplo
INSERT INTO services (cliente_id, tipo, fecha, estado, observaciones)
SELECT id, 'traslado', CURRENT_DATE - INTERVAL '10 days', 'completado', 'Traslado desde Hospital Central al domicilio'
FROM clients WHERE dni = '15678901';

INSERT INTO services (cliente_id, tipo, fecha, estado, observaciones)
SELECT id, 'capilla_ardiente', CURRENT_DATE - INTERVAL '10 days', 'completado', 'Sala principal, 24 horas'
FROM clients WHERE dni = '15678901';

INSERT INTO services (cliente_id, tipo, fecha, estado, observaciones)
SELECT id, 'cremacion', CURRENT_DATE - INTERVAL '9 days', 'completado', 'Cremación con urna estándar'
FROM clients WHERE dni = '15678901';

INSERT INTO services (cliente_id, tipo, fecha, estado, observaciones)
SELECT id, 'tramite_registro', CURRENT_DATE - INTERVAL '8 days', 'en_proceso', 'Tramitando certificado de defunción'
FROM clients WHERE dni = '15678901';

INSERT INTO services (cliente_id, tipo, fecha, estado, observaciones)
SELECT id, 'traslado', CURRENT_DATE + INTERVAL '2 days', 'pendiente', 'Traslado programado interurbano'
FROM clients WHERE dni = '31209876';

-- Convenios de ejemplo
INSERT INTO agreements (nombre, tipo, contacto, telefono, servicios_prepagos, servicios_usados, saldo_favor) VALUES
  ('Municipalidad de Col. Elisa', 'municipio', 'Lic. Ramírez', '3624100200', 6, 2, 15000.00),
  ('Sindicato de Trabajadores Rurales', 'sindicato', 'Sr. Pérez', '3624200300', 12, 5, 0.00),
  ('Empresa Agropecuaria El Ceibo', 'empresa', 'Ing. Castro', '3624300400', 3, 0, 45000.00),
  ('Residencia San José - Adultos Mayores', 'residencia_adultos', 'Dra. Morales', '3624400500', 0, 0, 8500.00);
