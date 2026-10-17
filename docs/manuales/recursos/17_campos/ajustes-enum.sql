ALTER TABLE ejemplos_campos
  MODIFY correo VARCHAR(100) NOT NULL,
  MODIFY sitio_web VARCHAR(100) NULL,
  MODIFY tipo ENUM('curso','taller') NOT NULL,
  MODIFY modalidad ENUM('presencial','en_linea') NOT NULL,
  MODIFY estado ENUM('pendiente','confirmado','cancelado') NOT NULL DEFAULT 'pendiente';
