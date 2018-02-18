INSERT INTO `escng_schedule`.`status` 
(`name`, `created_at`, `updated_at`) 
VALUES 
('Activo', NOW(), NOW()), ('Inactivo', NOW(), NOW());

INSERT INTO `escng_schedule`.`profile` 
(`name`, `created_at`, `updated_at`) 
VALUES 
('Administrador', NOW(), NOW()), ('Supervisor', NOW(), NOW());

INSERT INTO `escng_schedule`.`user`
(`user_name`, `password`, `full_name`, `profile_id`, `status_id`, `created_at`, `updated_at`)
VALUES
('omar.melendrez', 'master1*', 'Omar Melendrez', 1, 1, NOW(), NOW());

INSERT INTO `escng_schedule`.`branch`
(`name`, `status_id`, `created_at`, `updated_at`)
VALUES
('Donado', 1, NOW(), NOW());

INSERT INTO `escng_schedule`.`sector`
(`name`, `created_at`, `updated_at`)
VALUES
('Entrenamiento', NOW(), NOW()),
('Cocina', NOW(), NOW()),
('Cajas', NOW(), NOW()),
('Cafetería', NOW(), NOW()),
('Salón', NOW(), NOW()),
('Depositos', NOW(), NOW()),
('Eventos', NOW(), NOW());

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, `name`, '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Entrenamiento';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Elaboración', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Cocina';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Cocción', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Cocina';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Runner', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Cajas';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Cajero', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Cajas';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Barra', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Cafetería';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Mozo', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Cafetería';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Servicio', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Salón';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, 'Valle', '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Salón';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, `name`, '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Depósitos';

INSERT INTO `escng_schedule`.`position`
(`sector_id`, `name`, `color`, `created_at`, `updated_at`)
SELECT id, `name`, '#000000', NOW(), NOW() 
FROM `escng_schedule`.`sector`
WHERE `name` = 'Eventos';