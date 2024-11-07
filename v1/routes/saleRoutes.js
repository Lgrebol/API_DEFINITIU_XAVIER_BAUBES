const express = require("express");
const { getAllSales, getTotalCopiesSold, getRevenueByBookstore } = require("../models/saleModel");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get all sales
router.get("/", authenticate, async (req, res) => {
  const sales = await getAllSales();
  res.json(sales);
});

// Route to get total copies sold for a specific book
router.get("/copies-sold/:bookId", authenticate, async (req, res) => {
  const totalCopies = await getTotalCopiesSold(req.params.bookId);
  res.json({ bookId: req.params.bookId, totalCopies });
});

// Route to get revenue for a specific bookstore
router.get("/revenue/:bookstoreId", authenticate, async (req, res) => {
  const revenue = await getRevenueByBookstore(req.params.bookstoreId);
  res.json({ bookstoreId: req.params.bookstoreId, revenue });
});

module.exports = router;
