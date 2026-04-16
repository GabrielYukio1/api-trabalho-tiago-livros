const db = require("./database");
const bcrypt = require("bcrypt");

const senha = bcrypt.hashSync("123", 10);

db.run(
  "INSERT OR IGNORE INTO usuarios (email, senha) VALUES (?, ?)",
  ["teste@teste.com", senha],
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Usuário criado!");
    }
  }
);