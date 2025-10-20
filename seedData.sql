-- Insertar usuario de ejemplo
INSERT INTO "user" (name, email, password, birthdate, gender) 
VALUES ('Rubén García', 'ruben@example.com', 'password123', '1990-05-15', 'M');

-- Insertar medicinas de ejemplo
INSERT INTO medicine (pactive, trade_name, dose, unit)
VALUES 
  ('Paracetamol', 'Tafirol', '500', 'mg'),
  ('Ibuprofeno', 'Ibupirac', '400', 'mg'),
  ('Amoxicilina', 'Amoxil', '500', 'mg');

-- Insertar tratamientos de ejemplo (userId = 1)
INSERT INTO treatment (name, user_id, start_date, end_date)
VALUES 
  ('Dolor de cabeza', 1, '2025-10-20', '2025-10-27'),
  ('Infección', 1, '2025-10-15', '2025-10-29'),
  ('Alergia', 1, '2025-09-01', NULL);

-- Insertar intakes (tomas de medicinas)
INSERT INTO intake (start_date, end_date, frequency, medicine_id, user_id, dose_intake, hour)
VALUES 
  ('2025-10-20', '2025-10-27', 'cada 8 horas', 1, 1, '500mg', '08:00:00'),
  ('2025-10-15', '2025-10-29', 'cada 12 horas', 3, 1, '500mg', '09:00:00'),
  ('2025-09-01', NULL, 'diaria', 2, 1, '400mg', '20:00:00');

-- Relacionar intakes con tratamientos
INSERT INTO intake_treatment (intake_id, treatment_id)
VALUES 
  (1, 1),
  (2, 2),
  (3, 3);