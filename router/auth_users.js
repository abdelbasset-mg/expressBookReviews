const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    // Check if the username and password match the records
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username exists
    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if the provided username and password match
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username: username }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token: token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your_secret_key');
    const username = decoded.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Add or modify the review
    if (books[isbn].reviews.hasOwnProperty(username)) {
        books[isbn].reviews[username] = review;
    } else {
        books[isbn].reviews[username] = review;
    }

    return res.status(200).json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your_secret_key');
    const username = decoded.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for the book
    if (!books[isbn].reviews.hasOwnProperty(username)) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review if it exists for the user
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
