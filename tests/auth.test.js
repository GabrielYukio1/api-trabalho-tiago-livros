const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {

  it("login inválido deve retornar 401", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "naoexiste_999@test.com",
        senha: "senhaerrada"
      });

    expect(res.statusCode).toBe(401);
  });

  it("login válido deve retornar token", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "teste@teste.com",
        senha: "123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});