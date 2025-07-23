-- Elimina la base de datos si ya existe para una instalación limpia (opcional)
DROP DATABASE IF EXISTS dbPos;

-- Crea la nueva base de datos
CREATE DATABASE dbPos;

-- Selecciona la base de datos para usarla
USE dbPos;

-- #####################################################################
-- # SECCIÓN 1: GESTIÓN DE LICENCIAS, USUARIOS Y ROLES                 #
-- #####################################################################

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    hash_contrasena VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    id_rol INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id)
);

-- #####################################################################
-- # SECCIÓN 2: INVENTARIO, PRODUCTOS, MESAS Y SALONES               #
-- #####################################################################

CREATE TABLE categorias_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    codigo_cabys VARCHAR(13) DEFAULT '6331000000000',
    id_categoria INT NOT NULL,
    costo DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    precio_base DECIMAL(10, 2) NOT NULL,
    porcentaje_iva DECIMAL(4, 2) NOT NULL DEFAULT 13.00,
    stock_actual DECIMAL(10, 2) NOT NULL DEFAULT 0,
    controla_stock BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_categoria) REFERENCES categorias_productos(id)
);

CREATE TABLE salones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    id_salon INT NOT NULL,
    posicion_x INT DEFAULT 0,
    posicion_y INT DEFAULT 0,
    rotacion INT DEFAULT 0,
    estado ENUM('disponible', 'ocupada', 'reservada') DEFAULT 'disponible',
    FOREIGN KEY (id_salon) REFERENCES salones(id) ON DELETE CASCADE
);

-- #####################################################################
-- # SECCIÓN 3: FACTURACIÓN, ÓRDENES Y CLIENTES                        #
-- #####################################################################

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_identificacion ENUM('fisica', 'juridica', 'dimex', 'nite') NOT NULL,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT
);

CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mesa INT NULL,
    id_usuario_creador INT NOT NULL,
    id_cliente INT NULL,
    tipo ENUM('mesa', 'llevar') NOT NULL,
    estado ENUM('abierta', 'facturada', 'cancelada') NOT NULL DEFAULT 'abierta',
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mesa) REFERENCES mesas(id) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE detalles_orden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_orden INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    precio_unitario_base DECIMAL(10, 2) NOT NULL,
    porcentaje_iva_aplicado DECIMAL(4, 2) NOT NULL,
    comentarios TEXT,
    FOREIGN KEY (id_orden) REFERENCES ordenes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- #####################################################################
-- # SECCIÓN 4: VENTAS Y PAGOS                                       #
-- #####################################################################

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_orden INT UNIQUE,
    id_cliente INT NULL,
    id_usuario_vendedor INT NOT NULL,
    tipo_documento ENUM('tiquete_electronico', 'factura_electronica') NOT NULL,
    consecutivo_hacienda VARCHAR(50) UNIQUE,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10, 2) NOT NULL,
    monto_iva DECIMAL(10, 2) NOT NULL,
    total_final DECIMAL(10, 2) NOT NULL,
    estado ENUM('completada', 'anulada') DEFAULT 'completada',
    FOREIGN KEY (id_orden) REFERENCES ordenes(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_usuario_vendedor) REFERENCES usuarios(id)
);

CREATE TABLE pagos_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'sinpe', 'transferencia') NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    referencia VARCHAR(100),
    FOREIGN KEY (id_venta) REFERENCES ventas(id) ON DELETE CASCADE
);

CREATE TABLE registros_anulacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_usuario_autoriza INT NOT NULL,
    motivo TEXT NOT NULL,
    fecha_anulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_usuario_autoriza) REFERENCES usuarios(id)
);

-- #####################################################################
-- # SECCIÓN 5: GESTIÓN DE CAJA                                      #
-- #####################################################################

CREATE TABLE sesiones_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_apertura INT NOT NULL,
    id_usuario_cierre INT,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP NULL,
    monto_apertura DECIMAL(10, 2) NOT NULL,
    monto_cierre_efectivo_contado DECIMAL(10, 2),
    monto_cierre_dejado_en_caja DECIMAL(10, 2),
    total_calculado_efectivo DECIMAL(10, 2),
    total_calculado_tarjeta DECIMAL(10, 2),
    total_calculado_sinpe DECIMAL(10, 2),
    diferencia DECIMAL(10, 2),
    observaciones_cierre TEXT,
    FOREIGN KEY (id_usuario_apertura) REFERENCES usuarios(id),
    FOREIGN KEY (id_usuario_cierre) REFERENCES usuarios(id)
);

CREATE TABLE movimientos_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sesion_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sesion_caja) REFERENCES sesiones_caja(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- #####################################################################
-- # SECCIÓN 6: ÍNDICES Y OPTIMIZACIÓN                                 #
-- #####################################################################

CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_vendedor ON ventas(id_usuario_vendedor);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_clientes_identificacion ON clientes(identificacion);
CREATE INDEX idx_ordenes_estado ON ordenes(estado);

-- #####################################################################
-- # SECCIÓN 7: TRIGGERS (DISPARADORES)                                #
-- #####################################################################

DELIMITER $$

CREATE TRIGGER trg_after_detalle_orden_insert_update_stock
AFTER INSERT ON detalles_orden
FOR EACH ROW
BEGIN
    IF (SELECT controla_stock FROM productos WHERE id = NEW.id_producto) THEN
        UPDATE productos
        SET stock_actual = stock_actual - NEW.cantidad
        WHERE id = NEW.id_producto;
    END IF;
END$$

CREATE TRIGGER trg_after_detalle_orden_delete_restore_stock
AFTER DELETE ON detalles_orden
FOR EACH ROW
BEGIN
    IF (SELECT controla_stock FROM productos WHERE id = OLD.id_producto) THEN
        UPDATE productos
        SET stock_actual = stock_actual + OLD.cantidad
        WHERE id = OLD.id_producto;
    END IF;
END$$

CREATE TRIGGER trg_after_venta_update_anulada_log
AFTER UPDATE ON ventas
FOR EACH ROW
BEGIN
    IF NEW.estado = 'anulada' AND OLD.estado <> 'anulada' THEN
        INSERT INTO registros_anulacion (id_venta, id_usuario_autoriza, motivo, fecha_anulacion)
        VALUES (NEW.id, NEW.id_usuario_vendedor, 'Venta anulada desde el sistema.', NOW());
    END IF;
END$$

CREATE TRIGGER trg_before_caja_update_check_open_orders
BEFORE UPDATE ON sesiones_caja
FOR EACH ROW
BEGIN
    DECLARE open_orders_count INT;
    IF NEW.fecha_cierre IS NOT NULL AND OLD.fecha_cierre IS NULL THEN
        SELECT COUNT(*)
        INTO open_orders_count
        FROM ordenes
        WHERE estado = 'abierta';

        IF open_orders_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede cerrar caja. Existen órdenes abiertas.';
        END IF;
    END IF;
END$$

DELIMITER ;