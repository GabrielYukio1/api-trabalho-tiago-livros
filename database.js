const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Banco conectado.");
  }
});

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      senha TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS autores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      autor_id INTEGER,
      ano INTEGER,
      genero TEXT,
      quantidade INTEGER,
      FOREIGN KEY (autor_id) REFERENCES autores(id)
    )
  `);

  db.run("INSERT OR IGNORE INTO autores (id, nome) VALUES (1, 'Autor Teste')");
});

module.exports = db;