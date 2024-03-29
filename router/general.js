const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username and password are provided
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    if (users.includes(req.body.username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add the new user to the list of users
    users.push({ username: req.body.username, password: req.body.username });
    
    return res.status(201).json({ message: "User registered successfully" });
  });
  


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json({ book: book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});
  


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
  
    // Iterate through all books to find ones by the provided author
    Object.keys(books).forEach(isbn => {
      const book = books[isbn];
      if (book.author === author) {
        matchingBooks.push(book);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "Books by the author not found" });
    }
  });
  


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
  
     //Iterate through all books to find ones with the provided title
    Object.keys(books).forEach(isbn => {
      const book = books[isbn];
      if (book.title.toLowerCase().includes(title.toLowerCase())) {
        matchingBooks.push(book);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "Books with the title not found" });
    }
  });
  

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      const reviews = book.reviews;
      return res.status(200).json({ reviews: reviews });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
