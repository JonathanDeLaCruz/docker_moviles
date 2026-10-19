-- Ejecutar después de crear la colección, alias y relaciones de esquema.json.
ALTER TABLE pedidos_detalle
  ADD CONSTRAINT detalle_cantidad_positiva CHECK (cantidad BETWEEN 1 AND 9999),
  ADD CONSTRAINT detalle_precio_valido CHECK (precio_unitario >= 0),
  ADD CONSTRAINT detalle_producto_unico UNIQUE (pedido, producto);

-- Se conservan las columnas anteriores como campos opcionales de transición.
ALTER TABLE pedidos MODIFY producto INT NULL, MODIFY cantidad INT NULL DEFAULT NULL;

START TRANSACTION;
INSERT INTO pedidos_detalle (pedido, producto, cantidad, precio_unitario)
SELECT p.id, p.producto, p.cantidad, pr.precio
FROM pedidos p JOIN productos pr ON pr.id = p.producto
WHERE p.producto IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM pedidos_detalle d WHERE d.pedido = p.id);
UPDATE pedidos p SET p.producto = NULL, p.cantidad = NULL
WHERE EXISTS (SELECT 1 FROM pedidos_detalle d WHERE d.pedido = p.id);
COMMIT;
