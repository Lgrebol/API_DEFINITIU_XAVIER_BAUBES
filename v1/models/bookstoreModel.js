const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const bookstoresFile = path.join(__dirname, "../data/bookstores.json");

// Helper function to load all bookstores
async function getAllBookstores() {
  const data = await fs.readFile(bookstoresFile, "utf-8");
  return JSON.parse(data).sort((a, b) => a.name.localeCompare(b.name));
}

// Get a bookstore by ID
async function getBookstoreById(id) {
  const bookstores = await getAllBookstores();
  return bookstores.find((store) => store.id === id);
}

// Create a new bookstore
async function createBookstore(newBookstore) {
  const bookstores = await getAllBookstores();
  newBookstore.id = uuidv4();
  newBookstore.createdAt = new Date().toISOString();
  newBookstore.updatedAt = newBookstore.createdAt;
  bookstores.push(newBookstore);
  await fs.writeFile(bookstoresFile, JSON.stringify(bookstores, null, 2));
  return newBookstore;
}

// Update a bookstore by ID
async function updateBookstore(id, updatedData) {
  const bookstores = await getAllBookstores();
  const index = bookstores.findIndex((store) => store.id === id);
  if (index === -1) return null;

  bookstores[index] = {
    ...bookstores[index],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(bookstoresFile, JSON.stringify(bookstores, null, 2));
  return bookstores[index];
}

// Delete a bookstore by ID
async function deleteBookstore(id) {
  const bookstores = await getAllBookstores();
  const updatedBookstores = bookstores.filter((store) => store.id !== id);
  await fs.writeFile(bookstoresFile, JSON.stringify(updatedBookstores, null, 2));
  return { message: "Bookstore deleted" };
}

// Get bookstores with more than X copies of a specific book
async function getBookstoresWithBookCopies(bookId, minCopies) {
  const bookstores = await getAllBookstores();
  return bookstores.filter((store) =>
    store.inventory.some((book) => book.bookId === bookId && book.copies >= minCopies)
  );
}

module.exports = {
  getAllBookstores,
  getBookstoreById,
  createBookstore,
  updateBookstore,
  deleteBookstore,
  getBookstoresWithBookCopies,
};
