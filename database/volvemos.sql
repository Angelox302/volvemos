-- ================================================
-- VOLVEMOS — Script de base de datos
-- ================================================
-- Para ejecutar: abre MySQL Workbench, conecta
-- tu servidor y ejecuta este archivo completo.
-- ================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS volvemos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE volvemos;

-- ================================================
-- TABLA: usuarios
-- ================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT           NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100)  NOT NULL,
  username   VARCHAR(50)   NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,  -- Hash bcrypt, NUNCA texto plano
  rol        ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (id)
);

-- ================================================
-- TABLA: acciones
-- ================================================
CREATE TABLE IF NOT EXISTS acciones (
  id          INT           NOT NULL AUTO_INCREMENT,
  titulo      VARCHAR(150)  NOT NULL,
  descripcion TEXT          NULL,
  porcentaje  INT           NOT NULL,  -- Siempre positivo (ej: 15)
  tipo        ENUM('positivo', 'negativo') NOT NULL,
  fecha       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  creado_por  INT           NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

-- ================================================
-- USUARIOS INICIALES
-- ================================================
-- Contraseñas hasheadas con bcrypt (cost 10):
--   Keyla   → keyla123
--   Angelo  → angelo123
--
-- IMPORTANTE: Cámbialas después de la primera prueba.
-- ================================================

INSERT INTO usuarios (nombre, username, password, rol) VALUES
  ('Keyla',  'keyla',  '$2a$10$BrBCv7Gb/amRSSMwTPYnY.c5ZiIlxKhwwvrTP/vJNjizYE1uiMzuO', 'admin'),
  ('Angelo', 'angelo', '$2a$10$ZxKBTBd3U4yHde0Fc7kCh.UMT48T66UPLtKSvXLLc05ddLWkkzT1u', 'usuario');

-- ================================================
-- ACCIONES DE EJEMPLO (opcionales)
-- ================================================
-- Descomenta estas líneas si quieres datos de prueba
-- desde el principio.
-- ================================================

-- INSERT INTO acciones (titulo, descripcion, porcentaje, tipo, fecha, creado_por) VALUES
--   ('Hablamos las cosas', 'Tuvimos una conversación importante', 15, 'positivo', NOW(), 1),
--   ('Tuvimos una cita',   'Salimos a comer juntos',               10, 'positivo', NOW(), 1),
--   ('Me dejó en visto',   NULL,                                    5, 'negativo', NOW(), 1),
--   ('Tuvimos una pelea',  'Discutimos por tonterías',             10, 'negativo', NOW(), 1);
