const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authenticate = require('../middlewares/auth');
const { getAllBooks, getBookById } = require('../controllers/bookController');

// POST /books – Add a new book
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    const newBook = new Book({
      title,
      author,
      genre,
      description,
      createdBy: req.user.id,
    });

    await newBook.save();

    res.status(201).json({
      message: 'Book added successfully',
      book: newBook,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding book', error: err.message });
  }
});

// GET /books – Get all books
router.get('/', getAllBooks);

// GET /books/:id – Get book by ID
router.get('/:id', (req, res, next) => {
  console.log('GET /books/:id route hit');
  next();
}, getBookById);

module.exports = router;
