const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.json({ mensagem: "API de Livros funcionando!" });
});

// GET - listar todos os livros
app.get("/livros", (req, res) => {
  db.all("SELECT * FROM livros", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar livros." });
    }
    res.status(200).json(rows);
  });
});

// GET - buscar livro por ID
app.get("/livros/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM livros WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar livro." });
    }

    if (!row) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    res.status(200).json(row);
  });
});

// POST - criar livro
app.post("/livros", (req, res) => {
  const { titulo, autor, ano, genero, quantidade } = req.body;

  if (!titulo || !autor || !ano || !genero || quantidade === undefined) {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios."
    });
  }

  if (typeof ano !== "number" || typeof quantidade !== "number") {
    return res.status(400).json({
      erro: "Ano e quantidade devem ser números."
    });
  }

  if (quantidade < 0) {
    return res.status(400).json({
      erro: "Quantidade não pode ser negativa."
    });
  }

  const sql = `
    INSERT INTO livros (titulo, autor, ano, genero, quantidade)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [titulo, autor, ano, genero, quantidade], function (err) {
    if (err) {
      return res.status(500).json({ erro: "Erro ao cadastrar livro." });
    }

    res.status(201).json({
      mensagem: "Livro cadastrado com sucesso.",
      id: this.lastID
    });
  });
});

// PUT - atualizar livro
app.put("/livros/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano, genero, quantidade } = req.body;

  if (!titulo || !autor || !ano || !genero || quantidade === undefined) {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios."
    });
  }

  if (typeof ano !== "number" || typeof quantidade !== "number") {
    return res.status(400).json({
      erro: "Ano e quantidade devem ser números."
    });
  }

  if (quantidade < 0) {
    return res.status(400).json({
      erro: "Quantidade não pode ser negativa."
    });
  }

  const sql = `
    UPDATE livros
    SET titulo = ?, autor = ?, ano = ?, genero = ?, quantidade = ?
    WHERE id = ?
  `;

  db.run(sql, [titulo, autor, ano, genero, quantidade, id], function (err) {
    if (err) {
      return res.status(500).json({ erro: "Erro ao atualizar." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    res.status(200).json({ mensagem: "Atualizado com sucesso." });
  });
});

// DELETE - remover livro
app.delete("/livros/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM livros WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ erro: "Erro ao deletar." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: "Livro não encontrado." });
    }

    res.status(200).json({ mensagem: "Deletado com sucesso." });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});