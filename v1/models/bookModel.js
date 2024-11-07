const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const booksFile = path.join(__dirname, "../data/books.json");

async function getAllBooks() {
  const data = await fs.readFile(booksFile, "utf-8");
  return JSON.parse(data).sort((a, b) => a.title.localeCompare(b.title));
}

async function getBookById(id) {
  const books = await getAllBooks();
  return books.find((book) => book.id === id);
}

// More CRUD operations for books

module.exports = { getAllBooks, getBookById };
