# Usa una imagen base de Node.js
FROM node:18.18.0

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el proyecto
COPY . .

# Generar Prisma Client dentro del contenedor
RUN npx prisma generate

# Exponer el puerto y arrancar la app
EXPOSE 3000
CMD ["npm", "start"]