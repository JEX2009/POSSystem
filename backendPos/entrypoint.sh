#!/bin/sh

# Salir inmediatamente si un comando falla
set -e

# Esperar a que la base de datos esté disponible
echo "Esperando a que la base de datos esté disponible..."

until python -c "import sys, socket; from urllib.parse import urlparse; result = urlparse(sys.argv[1]); s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); sys.exit(0) if s.connect_ex((result.hostname, result.port)) == 0 else sys.exit(1)" "$DATABASE_URL"; do
  >&2 echo "La base de datos no está disponible - esperando..."
  sleep 1
done

>&2 echo "¡La base de datos está disponible! Iniciando el servidor..."

# Iniciar el servidor (ejecuta el comando que se le pase)
exec "$@"
