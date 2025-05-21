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

// POST /books/:id/reviews – Add a review to a book
router.post('/:id/reviews', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
  
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const newReview = {
        user: req.user.id,
        rating: Number(rating),
        comment,
      };
  
      book.reviews.push(newReview);
      await book.save();
  
      res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
      res.status(500).json({ message: 'Error adding review', error: error.message });
    }
  });

// PUT /books/:id – Update a book
  router.put('/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
  
      if (!book) return res.status(404).json({ message: 'Book not found' });
      if (book.createdBy.toString() !== req.user.id)
        return res.status(403).json({ message: 'Not authorized to update this book' });
  
      const { title, author, genre, description } = req.body;
  
      book.title = title || book.title;
      book.author = author || book.author;
      book.genre = genre || book.genre;
      book.description = description || book.description;
  
      await book.save();
  
      res.json({ message: 'Book updated successfully', book });
    } catch (error) {
      res.status(500).json({ message: 'Error updating book', error: error.message });
    }
  });

// DELETE /books/:id – Delete a book
  router.delete('/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
  
      if (!book) return res.status(404).json({ message: 'Book not found' });
      if (book.createdBy.toString() !== req.user.id)
        return res.status(403).json({ message: 'Not authorized to delete this book' });
  
      await book.deleteOne();
  
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
  });
  
// PUT /books/:bookId/reviews/:reviewId – Update a review
  router.put('/:bookId/reviews/:reviewId', authenticate, async (req, res) => {
    try {
      const { bookId, reviewId } = req.params;
      const { rating, comment } = req.body;
  
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: 'Book not found' });
  
      const review = book.reviews.id(reviewId);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      if (review.user.toString() !== req.user.id)
        return res.status(403).json({ message: 'Not authorized to update this review' });
  
      review.rating = rating ?? review.rating;
      review.comment = comment ?? review.comment;
  
      await book.save();
      res.json({ message: 'Review updated successfully', review });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  });
  
// DELETE /books/:bookId/reviews/:reviewId – Delete a review
  router.delete('/:bookId/reviews/:reviewId', authenticate, async (req, res) => {
    try {
      const { bookId, reviewId } = req.params;
  
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: 'Book not found' });
  
      const review = book.reviews.id(reviewId);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      if (review.user.toString() !== req.user.id)
        return res.status(403).json({ message: 'Not authorized to delete this review' });
  
      book.reviews.pull(reviewId);
      await book.save();
  
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  });
  
  

module.exports = router;
