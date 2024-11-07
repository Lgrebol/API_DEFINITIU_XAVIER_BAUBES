// models/saleModel.js
const fs = require("fs").promises;
const path = require("path");

const salesFile = path.join(__dirname, "../data/sales.json");

// Helper function to load all sales
async function getAllSales() {
  const data = await fs.readFile(salesFile, "utf-8");
  return JSON.parse(data).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
}

// Get total copies sold for a specific book
async function getTotalCopiesSold(bookId) {
  const sales = await getAllSales();
  return sales.reduce((total, sale) => {
    if (sale.bookId === bookId) {
      total += sale.copies;
    }
    return total;
  }, 0);
}

// Get total revenue for a specific bookstore
async function getRevenueByBookstore(bookstoreId) {
  const sales = await getAllSales();
  return sales
    .filter((sale) => sale.bookstoreId === bookstoreId)
    .reduce((total, sale) => total + sale.price * sale.copies, 0);
}

module.exports = {
  getAllSales,
  getTotalCopiesSold,
  getRevenueByBookstore,
};
