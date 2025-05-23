FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Construir aplicação
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build da aplicação
COPY --from=build /app/build /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
