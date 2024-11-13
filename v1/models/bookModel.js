const fs = require("fs");
const path = require("path");

const booksFilePath = path.join(__dirname, "../data/books.json");


const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(booksFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading books.json file:", err);
        reject("Could not retrieve books.");
      } else {
        try {
          const parsedData = JSON.parse(data); 
          resolve(parsedData.books); 
        } catch (parseError) {
          console.error("Error parsing books.json file:", parseError);
          reject("Could not retrieve books.");
        }
      }
    });
  });
};


const getBookById = (bookId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const books = await getAllBooks();
      const book = books.find((b) => b.id === bookId); 
      if (book) {
        resolve(book);
      } else {
        reject("Book not found.");
      }
    } catch (error) {
      console.error("Error retrieving book by ID:", error);
      reject("Could not retrieve book.");
    }
  });
};

module.exports = { getAllBooks, getBookById };
