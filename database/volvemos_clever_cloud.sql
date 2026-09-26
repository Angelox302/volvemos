-- ================================================
-- VOLVEMOS — Script para Clever Cloud
-- ================================================
-- En Clever Cloud la base de datos ya viene creada,
-- NO hay que hacer CREATE DATABASE ni USE.
-- Ejecuta este archivo directamente.
-- ================================================

-- TABLA: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT           NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100)  NOT NULL,
  username   VARCHAR(50)   NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  rol        ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (id)
);

-- TABLA: acciones
CREATE TABLE IF NOT EXISTS acciones (
  id          INT           NOT NULL AUTO_INCREMENT,
  titulo      VARCHAR(150)  NOT NULL,
  descripcion TEXT          NULL,
  porcentaje  INT           NOT NULL,
  tipo        ENUM('positivo', 'negativo') NOT NULL,
  fecha       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  creado_por  INT           NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

-- USUARIOS INICIALES
-- Keyla → keyla123 (admin)
-- Angelo → angelo123 (usuario)
INSERT INTO usuarios (nombre, username, password, rol) VALUES
  ('Keyla',  'keyla',  '$2a$10$BrBCv7Gb/amRSSMwTPYnY.c5ZiIlxKhwwvrTP/vJNjizYE1uiMzuO', 'admin'),
  ('Angelo', 'angelo', '$2a$10$ZxKBTBd3U4yHde0Fc7kCh.UMT48T66UPLtKSvXLLc05ddLWkkzT1u', 'usuario');
