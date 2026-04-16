const request = require("supertest");
const app = require("../server");

let token;
let livroId;

beforeAll(async () => {
  const res = await request(app)
    .post("/login")
    .send({
      email: "teste@teste.com",
      senha: "123"
    });

  token = res.body.token;
});

describe("Livros CRUD", () => {

  it("não acessa livros sem token", async () => {
    const res = await request(app).get("/livros");

    expect(res.statusCode).toBe(401);
  });

  it("lista livros com token", async () => {
    const res = await request(app)
      .get("/livros")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("cria livro", async () => {
    const res = await request(app)
      .post("/livros")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Livro Teste",
        autor_id: 1,
        ano: 2024,
        genero: "Ficção",
        quantidade: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();

    livroId = res.body.id;
  });

  it("busca livro por id", async () => {
    const res = await request(app)
      .get(`/livros/${livroId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("atualiza livro", async () => {
    const res = await request(app)
      .put(`/livros/${livroId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Livro Atualizado",
        autor_id: 1,
        ano: 2025,
        genero: "Drama",
        quantidade: 2
      });

    expect(res.statusCode).toBe(200);
  });

  it("deleta livro", async () => {
    const res = await request(app)
      .delete(`/livros/${livroId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});