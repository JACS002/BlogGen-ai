# Usamos Node.js
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto de Vite (generalmente 5173)
EXPOSE 5173

# Comando para iniciar
CMD ["npm", "run", "dev", "--", "--host"]