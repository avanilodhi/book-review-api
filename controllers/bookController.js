const Book = require('../models/Book');

// GET /books – Get all books 
const getAllBooks = async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;

    const query = {};
    if (author) query.author = new RegExp(author, 'i'); // case-insensitive
    if (genre) query.genre = new RegExp(genre, 'i');

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      books,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// GET /books – Get all books by ID
const getBookById = async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 5 } = req.query;
  
      const book = await Book.findById(id).populate('reviews.user', 'name');
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      // Calculate average rating
      const totalRatings = book.reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = book.reviews.length ? (totalRatings / book.reviews.length).toFixed(1) : null;
  
      // Paginate reviews
      const start = (page - 1) * limit;
      const paginatedReviews = book.reviews.slice(start, start + parseInt(limit));
  
      res.json({
        book: {
          id: book._id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          description: book.description,
          averageRating: avgRating,
        },
        totalReviews: book.reviews.length,
        page: parseInt(page),
        limit: parseInt(limit),
        reviews: paginatedReviews,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details', error: error.message });
    }
  };

module.exports = {
  getAllBooks, getBookById, 
};
