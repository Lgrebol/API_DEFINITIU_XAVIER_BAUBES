const express = require("express");
const Joi = require("joi");
const { getAllBooks, getBookById } = require("../models/bookModel");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// Book schema for validation
const bookSchema = Joi.object({
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
  publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  genres: Joi.array().items(Joi.string().trim()).required(),
  summary: Joi.string().trim().required(),
});

// Route to get all books
router.get("/", authenticate, async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Error retrieving books:", error);
    res.status(500).json({ error: "Could not retrieve books" });
  }
});

// Route to get a book by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    book ? res.json(book) : res.status(404).json({ error: "Book not found" });
  } catch (error) {
    console.error("Error retrieving book:", error);
    res.status(500).json({ error: "Could not retrieve book" });
  }
});

// Filtering route to get books by author, genre, or publishedYear
router.get("/filter", authenticate, async (req, res) => {
  const { author, genre, publishedYear } = req.query;

  try {
    const books = await getAllBooks();
    const filteredBooks = books.filter((book) => {
      return (
        (!author || book.details.author === author) &&
        (!genre || book.details.genres.includes(genre)) &&
        (!publishedYear || book.details.publishedYear === parseInt(publishedYear))
      );
    });
    res.json(filteredBooks);
  } catch (error) {
    console.error("Error filtering books:", error);
    res.status(500).json({ error: "Could not retrieve books" });
  }
});

// Export the router
module.exports = router;
