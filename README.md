# Book Review RESTful API

A RESTful API built using **Node.js**, **Express**, and **MongoDB** that allows users to register, log in, add books, post reviews, and interact with book-related data. It supports user authentication via JWT and modular architecture for scalability and clarity.

---

## Features

- User Registration & Login with JWT
- Add, View, Filter Books
- Add, Edit, Delete Reviews
- View Books by Specific User
- View User Profile (Authenticated)
- Environment Variables & Modular Structure

---

## Project Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api

```
### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` file in the root directory and add:
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bookReview
JWT_SECRET=book_review_library


### 4. Run Locally
npm run dev


