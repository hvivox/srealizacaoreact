# Etapa 1 - build com Node
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install

# Copia o restante dos arquivos do projeto
COPY . .
RUN yarn run build
# Verifica se os arquivos foram copiados corretamente
RUN ls -la /app


# Etapa 2 - NGINX para servir os arquivos
FROM nginx:alpine

# Copia artefatos de build da ETAPA 1
COPY --from=builder /app/build /usr/share/nginx/html

# Copia a config customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]