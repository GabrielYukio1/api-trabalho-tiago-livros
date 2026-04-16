# API de Livros - Node.js + Express + JWT

API REST desenvolvida para gerenciamento de livros com autenticação JWT, CRUD completo, relacionamentos entre tabelas e testes automatizados.

Tecnologias utilizadas: Node.js, Express, SQLite3, JWT (jsonwebtoken), bcrypt, Jest, Supertest e CORS.

Deploy da API: https://api-livros-11qx.onrender.com

## Instalação do projeto

Clone o repositório:
git clone https://github.com/seu-usuario/api-livros.git

Entre na pasta:
cd api-livros

Instale as dependências:
npm install

Execute o projeto:
npm start

Ou modo desenvolvimento:
npm run dev

## Autenticação JWT

Registrar usuário:
POST /register
Body:
{
  "email": "teste@teste.com",
  "senha": "123456"
}

Login:
POST /login
Body:
{
  "email": "teste@teste.com",
  "senha": "123456"
}

Resposta:
{
  "token": "JWT_TOKEN_AQUI"
}

## Uso do token

Todas as rotas de livros são protegidas.
Enviar no header:
Authorization: Bearer SEU_TOKEN

## Rotas da API

Usuários:
GET /usuarios

Livros (protegido):
GET /livros
GET /livros/:id
POST /livros
PUT /livros/:id
DELETE /livros/:id

Body do POST e PUT:
{
  "titulo": "Livro exemplo",
  "autor_id": 1,
  "ano": 2024,
  "genero": "Ficção",
  "quantidade": 10
}

Relacionamento (JOIN):
GET /livros-com-autores

## Testes automatizados

Executar testes:
npm test

Ferramentas: Jest e Supertest

## Estrutura do projeto

api-livros/
database.js
server.js
index.js
tests/
  auth.test.js
  livros.test.js
postman/
  api-livros.postman_collection.json
README.md

## Observações

Senhas criptografadas com bcrypt.
Autenticação feita com JWT.
Banco de dados SQLite.
API pronta para deploy no Render.
Middleware protege rotas de livros.

## Projeto acadêmico

Desenvolvido para disciplina de backend com Node.js, Express e SQLite.