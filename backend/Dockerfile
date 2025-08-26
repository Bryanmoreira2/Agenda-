# Use a imagem oficial do Node.js v22.14.0
FROM node:22.14.0

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /backend

COPY package*.json ./


RUN npm install

COPY . .

# Exponha a porta 8080 (caso a API use essa porta)
EXPOSE 5002

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]
