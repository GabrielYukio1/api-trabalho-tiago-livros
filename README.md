# API de Livros - Node.js

## Descrição
API REST completa desenvolvida em Node.js com Express e banco de dados SQLite.

## Tecnologias utilizadas
- Node.js
- Express
- SQLite
- Cors
- Nodemon
- Postman

## Como executar

```bash
npm install
npm run dev

Servidor:
http://localhost:3000

Endpoints
- GET / → API funcionando
- GET /livros → Lista todos os livros
- GET /livros/:id → Busca por ID
- POST /livros → Cria novo livro
- PUT /livros/:id → Atualiza livro
- DELETE /livros/:id → Deleta livro

Exemplo de POST
{
  "titulo": "Livro Teste",
  "autor": "Yukio",
  "ano": 2023,
  "genero": "Teste",
  "quantidade": 5
}
Validações
Campos obrigatórios
Ano deve ser número
Quantidade não pode ser negativa
Erros
400 → Dados inválidos
404 → Não encontrado
Testes

Testado no Postman com:

GET
POST
PUT
DELETE
erro 400
erro 404