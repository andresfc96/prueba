# api

## Descripción
Esta API proporciona funcionalidades para la gestión de usuarios y tareas. Está construida con **NestJS** y utiliza **PostgreSQL** como base de datos.

## Características
- Crear y consultar Usuarios.
- Autenticación con JWT.
- Gestión de tareas (crear, asignar, actualizar, eliminar).

## Tecnologías
- **Node.js**
- **NestJS**
- **PostgreSQL**
- **Prisma ORM**

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/andresfc96/prueba.git
   cd prueba

2. Instalar dependencias:
    ```bash
    npm install

3. Configurar el .env:

    Crea un archivo `.env` en el directorio raíz del proyecto con el siguiente contenido:

    ```properties
    DATABASE_URL=postgresql://${SQL_USER}:${SQL_PASSWORD}@${SQL_HOST}:${SQL_PORT}/${SQL_DB}
    SQL_USER=postgres
    SQL_PASSWORD=123456
    SQL_HOST=db
    SQL_PORT=5432
    SQL_DB=prueba
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=123456
    POSTGRES_DB=prueba
    JWT_EXPIRATION_TIME=1d
    JWT_SECRET=df6412ef6a52903ef75a7e58a7cc0021e425b00fb3e41b6b4d678451f9e1616a772e84e6641821499bac9b782f8dbe5c992452d4cb72965761391899eafd1efa
    PORT=3000

4. Construir y ejecutar los contenedores:
    ```bash
    docker-compose --env-file .env up -d --build

5. Verificar que esten arriba los contenedores:
    ```bash
    docker-compose ps

6. Ejecutar el despliegue de la base de datos mediante el ORM Prisma:
    ```bash
    docker-compose exec api npx prisma migrate deploy