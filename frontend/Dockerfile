# Usamos Node 20 Slim (Debian)
FROM node:20-slim

WORKDIR /app

# 1. Copiamos SOLO el package.json (Ignoramos el lockfile del host)
COPY package.json ./

# 2. Instalamos dependencias limpias para Linux
RUN npm install

# 3. Copiamos el código fuente
COPY . .

# Exponemos el puerto
EXPOSE 5173

# Arrancamos
CMD ["npm", "run", "dev", "--", "--host"]