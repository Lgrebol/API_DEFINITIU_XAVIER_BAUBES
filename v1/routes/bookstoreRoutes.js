const express = require("express");
const {
  getAllBookstores,
  getBookstoreById,
  createBookstore,
  updateBookstore,
  deleteBookstore,
  getBookstoresWithBookCopies,
} = require("../models/bookstoreModel");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get all bookstores
router.get("/", authenticate, async (req, res) => {
  const bookstores = await getAllBookstores();
  res.json(bookstores);
});

// Route to get a bookstore by ID
router.get("/:id", authenticate, async (req, res) => {
  const bookstore = await getBookstoreById(req.params.id);
  bookstore ? res.json(bookstore) : res.status(404).json({ error: "Bookstore not found" });
});

// Route to create a new bookstore
router.post("/", authenticate, async (req, res) => {
  const newBookstore = await createBookstore(req.body);
  res.status(201).json(newBookstore);
});

// Route to update a bookstore
router.put("/:id", authenticate, async (req, res) => {
  const updatedBookstore = await updateBookstore(req.params.id, req.body);
  updatedBookstore ? res.json(updatedBookstore) : res.status(404).json({ error: "Bookstore not found" });
});

// Route to delete a bookstore
router.delete("/:id", authenticate, async (req, res) => {
  const result = await deleteBookstore(req.params.id);
  res.json(result);
});

// Route to get bookstores with at least a specific number of copies of a book
router.get("/with-copies/:bookId", authenticate, async (req, res) => {
  const minCopies = parseInt(req.query.minCopies) || 0;
  const bookstores = await getBookstoresWithBookCopies(req.params.bookId, minCopies);
  res.json(bookstores);
});

module.exports = router;
