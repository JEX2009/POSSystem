
# **Sistema POS - Sistema de Gestión para Restaurantes**

Un sistema integral para la gestión de operaciones de restaurantes, diseñado para optimizar desde la toma de pedidos hasta el control de inventario y la generación de reportes de ventas.

## 🚀 **Tecnologías Utilizadas**

Este proyecto se construye con una pila de tecnologías modernas para garantizar rendimiento, escalabilidad y una excelente experiencia de usuario.

### **Frontend**

  * **HTML5:** Estructura semántica del contenido web.
  * **CSS3:** Estilos visuales de la aplicación.
  * **JavaScript (ES6+):** Lógica interactiva del lado del cliente.
  * **React:** Librería principal para la construcción de interfaces de usuario interactivas y componentes reutilizables.
  * **Tailwind CSS:** Framework CSS utility-first para un desarrollo rápido y un diseño altamente personalizable.
  * **Recharts:** Librería para la visualización de datos en el Dashboard (gráficos de ventas, estadísticas, etc.).
  * **React-dnd:** Toolkit para implementar funcionalidades de "drag and drop" (arrastrar y soltar), utilizada para la gestión visual de mesas.
  * **Day.js:** Librería ligera para el parseo, manipulación y formateo de fechas.

### **Backend**

  * **Python:** Lenguaje de programación principal del lado del servidor.
  * **Django:** Framework web de alto nivel que permite un desarrollo rápido y limpio.
  * **Django REST Framework:** Para la creación de APIs RESTful.
  * **django-cors-headers:** Para manejar las políticas de Cross-Origin Resource Sharing (CORS).
  * **SQL (Directo):** Interacción con la base de datos relacional utilizando consultas SQL directamente para un control preciso.

### **Base de Datos**

  * **MySQL:** Base de datos relacional robusta y escalable para almacenar toda la información del restaurante.

### **Autenticación**

  * **JWT (JSON Web Tokens):** Para un sistema de autenticación seguro y sin estado entre el frontend y el backend.

### **Herramientas y Despliegue**

  * **Git:** Sistema de control de versiones para gestionar el código fuente.
  * **Docker & Docker Compose:** Para la contenerización de la aplicación (frontend, backend, base de datos), facilitando el desarrollo y despliegue consistente.

## ✨ **Características Principales**

A continuación se detallan las funcionalidades clave del sistema:

  * **Gestión de Licencias y Usuarios:**

      * Registro y autenticación segura para diferentes roles de usuario.

  * **Dashboard Interactivo:**

      * Visión general de las operaciones con accesos rápidos personalizables.
      * Filtros de ventas avanzados (Hoy, Semana, Mes, Vendedor, Rango de fechas).
      * Estadísticas clave: cantidad de órdenes, total de ingresos, mejor vendedor, productos más vendidos.

  * **Módulo de Facturación / Punto de Venta (POS):**

      * **Navegación y Búsqueda:** Búsqueda de productos y navegación por categorías.
      * **Gestión Visual de Mesas y Salones:** Interfaz para añadir salones y gestionar mesas con drag-and-drop. Permite editar órdenes, mostrar ocupación, cambiar órdenes de mesa y eliminar registros.
      * **Órdenes Dinámicas:** Tabla para agregar/eliminar productos, modificar cantidad, precios (con/sin IVA), y añadir comentarios a la orden.
      * **Gestión de Clientes:** Búsqueda y registro de clientes (físicos/jurídicos) para facturación electrónica.
      * **Pedidos "Para Llevar":** Apartado específico para gestionar este tipo de órdenes.
      * **Flujo de Facturación Avanzado:**
          * División de cuentas por productos.
          * Selección de tipo de comprobante (Factura / Tiquete Electrónico).
          * Múltiples métodos de pago (Tarjeta, Efectivo, Sinpe).
          * Cálculo automático de vuelto.

  * **Gestión de Caja:**

      * **Apertura y Cierre:** Resumen de entradas (efectivo, tarjeta, Sinpe), registro de salidas, y observaciones.
      * Cálculo de diferencias entre el efectivo esperado y el contado.

  * **Historial y Reportes:**

      * **Historial de Ventas:** Consulta de transacciones con filtros y opción para imprimir o anular (dejando registro de auditoría).
      * **Movimientos de Caja:** Historial de todas las entradas y salidas de dinero.

  * **Reservas:**

      * Gestión de reservas con indicación visual en el plano de mesas (p. ej., la mesa se muestra en rojo 30 minutos antes).

  * **Compras e Inventario:**

      * **Gestión de Compras:** Registro manual de facturas de proveedores.
      * **Control de Inventario:** Creación, modificación y eliminación de productos (nombre, código CABYS, categoría, costo, impuesto, precio, stock) y gestión de categorías.

  * **Generación de Menú QR:**

      * Creación de un código QR que enlaza a un menú virtual para los clientes.

## 🛠️ **Configuración e Instalación**

Para levantar el proyecto en tu entorno local, sigue los siguientes pasos:

### **Prerrequisitos**

  * Git
  * Docker y Docker Compose
  * Node.js (para el desarrollo del frontend fuera de Docker)
  * Python 3.x (para el desarrollo del backend fuera de Docker)

### **Pasos de Instalación**

1.  **Clonar el Repositorio:**

    ```bash
    git clone https://github.com/JEX2009/POSSystem.git
    cd POSSystem
    ```

2.  **Configurar Variables de Entorno:**

      * Crea un archivo `.env` en la raíz de la carpeta `backendPos/` basándote en el archivo `.env.example` si existe. Deberá contener la `DATABASE_URL`, `SECRET_KEY` y `DEBUG`.
      * Verifica el archivo `docker-compose.yml` para asegurarte de que las variables de entorno coinciden con tu configuración.

3.  **Levantar Servicios con Docker Compose:**
    Desde la raíz del proyecto, ejecuta:

    ```bash
    docker-compose up --build
    ```

    Este comando construirá las imágenes de Docker para el frontend, backend y la base de datos, y los iniciará. El backend ejecutará automáticamente las migraciones.

4.  **Crear un Superusuario (Opcional):**
    Para acceder al panel de administrador de Django, abre otra terminal y ejecuta:

    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```

5.  **Acceder a la Aplicación:**

      * **Frontend:** `http://localhost:5173`
      * **Backend API:** `http://localhost:8000`

## 💡 **Consideraciones Adicionales**

  * **Seguridad:** Implementar validaciones robustas en el backend, sanitización de entradas y protección contra ataques comunes. Las contraseñas deben estar hasheadas y los JWTs manejados de forma segura.
  * **Pruebas:** Es fundamental escribir pruebas unitarias y de integración para garantizar la calidad y estabilidad del código.
  * **Optimización:** Considerar técnicas como *lazy loading* en React, optimización de imágenes y caché de respuestas de la API para mejorar el rendimiento.
  * **Auditoría:** Para acciones críticas (anulación de facturas, eliminación de productos), implementar un sistema que registre `quién`, `qué`, `cuándo` y `por qué`.
  * **Contabilidad:** Para funcionalidades complejas como la prorrata, se recomienda la consulta con un experto contable para asegurar la conformidad legal y funcional.

  * **Errores** Si el contenedor backend no levanta revisa que el entrypoint no este en CRLF
## 🤝 **Contribución**

¡Las contribuciones son bienvenidas\! Si deseas aportar al proyecto, por favor, sigue el flujo estándar:

1.  Haz un "fork" de este repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3.  Realiza tus cambios y haz commit (`git commit -m 'feat: añade nueva característica'`).
4.  Sube tu rama (`git push origin feature/nueva-caracteristica`).
5.  Abre un Pull Request.



© 2026 Jason Orozco Ruiz. Todos los derechos reservados.