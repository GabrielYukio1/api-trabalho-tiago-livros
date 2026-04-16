const express = require("express");
const cors = require("cors");
const db = require("./database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "segredo");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}


app.get("/", (req, res) => {
  res.json({ mensagem: "API de Livros funcionando!" });
});


app.get("/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios", [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});


app.post("/register", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);

  db.run(
    "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
    [email, senhaHash],
    function (err) {
      if (err) {
        return res.status(400).json({ erro: "Usuário já existe." });
      }

      res.status(201).json({ mensagem: "Usuário criado com sucesso." });
    }
  );
});


app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  db.get(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, usuario) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ erro: "Erro no banco." });
      }

      if (!usuario) {
        return res.status(401).json({ erro: "Usuário não encontrado." });
      }

      const senhaValida = bcrypt.compareSync(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ erro: "Senha inválida." });
      }

      const token = jwt.sign(
        { id: usuario.id },
        "segredo",
        { expiresIn: "1d" }
      );

      res.json({ token });
    }
  );
});


app.get("/livros", authMiddleware, (req, res) => {
  db.all("SELECT * FROM livros", [], (err, rows) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar livros." });
    res.json(rows);
  });
});

app.get("/livros/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM livros WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar livro." });

    if (!row) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    res.json(row);
  });
});

app.post("/livros", authMiddleware, (req, res) => {
  const { titulo, autor_id, ano, genero, quantidade } = req.body;

  if (!titulo || !autor_id || !ano || !genero) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando." });
  }

  const anoNum = Number(ano);
  const qtdNum = Number(quantidade);

  if (isNaN(anoNum) || isNaN(qtdNum)) {
    return res.status(400).json({ erro: "Ano e quantidade devem ser números." });
  }

  db.run(
    `INSERT INTO livros (titulo, autor_id, ano, genero, quantidade)
     VALUES (?, ?, ?, ?, ?)`,
    [titulo, autor_id, anoNum, genero, qtdNum],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao cadastrar livro." });
      }

      res.status(201).json({
        mensagem: "Livro cadastrado com sucesso.",
        id: this.lastID
      });
    }
  );
});

app.put("/livros/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { titulo, autor_id, ano, genero, quantidade } = req.body;

  db.run(
    `UPDATE livros
     SET titulo=?, autor_id=?, ano=?, genero=?, quantidade=?
     WHERE id=?`,
    [titulo, autor_id, ano, genero, quantidade, id],
    function (err) {
      if (err) return res.status(500).json({ erro: "Erro ao atualizar." });

      if (this.changes === 0) {
        return res.status(404).json({ erro: "Livro não encontrado." });
      }

      res.json({ mensagem: "Atualizado com sucesso." });
    }
  );
});

app.delete("/livros/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM livros WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ erro: "Erro ao deletar." });

    if (this.changes === 0) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    res.json({ mensagem: "Deletado com sucesso." });
  });
});


app.get("/livros-com-autores", (req, res) => {
  const sql = `
    SELECT 
      livros.id,
      livros.titulo,
      livros.genero,
      autores.nome AS autor
    FROM livros
    INNER JOIN autores 
    ON livros.autor_id = autores.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: "Erro no JOIN" });
    res.json(rows);
  });
});

module.exports = app;