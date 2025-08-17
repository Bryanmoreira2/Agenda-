FROM node:latest

WORKDIR /

COPY . .

RUN rm -rf node_modules  # Remove os módulos existentes

RUN npm install  # Instala as dependências

RUN npm run build  # Gera os arquivos de produção

RUN mkdir -p /var/www/html  # Cria o diretório para os arquivos do NGINX

RUN mv dist/* /var/www/html  # Move os arquivos gerados para o diretório do NGINX

VOLUME /var/www/html  # Define o volume para compartilhar os arquivos

WORKDIR /

RUN rm -rf /tmp/react  # Limpeza de arquivos temporários








