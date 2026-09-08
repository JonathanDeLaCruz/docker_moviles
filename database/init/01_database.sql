USE moviles;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (
    nombre,
    correo,
    password
)
VALUES (
    'Administrador',
    'admin@ejemplo.com',
    '123456'
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    stock
)
VALUES
(
    'Laptop',
    'Producto de prueba',
    15000,
    5
),
(
    'Teclado',
    'Producto de prueba',
    850,
    10
);