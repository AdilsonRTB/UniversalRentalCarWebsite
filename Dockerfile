# Etapa 1: Build do Vue
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar template do nginx
COPY nginx.template.conf /etc/nginx/templates/default.conf.template

# Variáveis de ambiente (podem ser passadas no docker-compose)
ENV API_TARGET=http://localhost:8000
ENV HEALTH_TARGET=http://localhost:8000
ENV VEHICLE_TARGET=http://84.247.171.243:8090

# Substituir variáveis e iniciar nginx
CMD envsubst '$API_TARGET $HEALTH_TARGET $VEHICLE_TARGET' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
