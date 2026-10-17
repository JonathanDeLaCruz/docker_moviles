ALTER TABLE pedidos
  MODIFY estado ENUM('pendiente','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  ADD CONSTRAINT pedidos_cantidad_positiva CHECK (cantidad > 0);
