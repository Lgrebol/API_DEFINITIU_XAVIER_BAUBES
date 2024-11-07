const express = require("express");
const { getAllBooks, getBookById } = require("../models/bookModel");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");

// Route to get all books
router.get("/", authenticate, async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve books" });
  }
});

// Route to get a book by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve book" });
  }
});

// More CRUD routes for books

module.exports = router;
