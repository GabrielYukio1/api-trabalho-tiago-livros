 const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./livros.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Conectado ao banco SQLite.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      ano INTEGER NOT NULL,
      genero TEXT NOT NULL,
      quantidade INTEGER NOT NULL CHECK (quantidade >= 0)
    )
  `);

  db.get("SELECT COUNT(*) AS total FROM livros", (err, row) => {
    if (err) {
      console.error("Erro ao verificar registros:", err.message);
      return;
    }

    if (row.total === 0) {
      const stmt = db.prepare(`
        INSERT INTO livros (titulo, autor, ano, genero, quantidade)
        VALUES (?, ?, ?, ?, ?)
      `);

      const livrosIniciais = [
        ["Dom Casmurro", "Machado de Assis", 1899, "Romance", 5],
        ["O Hobbit", "J.R.R. Tolkien", 1937, "Fantasia", 8],
        ["1984", "George Orwell", 1949, "Ficção", 6],
        ["Capitães da Areia", "Jorge Amado", 1937, "Romance", 4],
        ["A Revolução dos Bichos", "George Orwell", 1945, "Satírico", 7],
        ["Harry Potter e a Pedra Filosofal", "J.K. Rowling", 1997, "Fantasia", 10],
        ["Percy Jackson", "Rick Riordan", 2005, "Fantasia", 9],
        ["O Pequeno Príncipe", "Antoine de Saint-Exupéry", 1943, "Infantil", 12],
        ["Memórias Póstumas de Brás Cubas", "Machado de Assis", 1881, "Romance", 3],
        ["Senhora", "José de Alencar", 1875, "Romance", 2]
      ];

      livrosIniciais.forEach((livro) => stmt.run(livro));
      stmt.finalize();

      console.log("10 registros iniciais inseridos.");
    }
  });
});

module.exports = db;               