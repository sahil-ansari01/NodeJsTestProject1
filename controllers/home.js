const Book = require("../models/book");
const axios = require("axios");
const path = require("path");

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postBooks = async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }
    const borrowedDate = new Date();
    const returnDate = new Date(borrowedDate.getTime() + 60 * 60000);
    const newBook = await Book.create({ title, borrowedDate, returnDate });
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.postReturnFine = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const now = new Date();
    let fineAmount = 0;
    if (!book.returned && now > book.returnDate) {
      const diffMilliseconds = now - book.returnDate;
      const diffHours = Math.ceil(diffMilliseconds / (1000 * 60 * 60));
      fineAmount = diffHours * 10;
    }
    console.log("BEFORE RETURN !!");
    return res.json({ fine: fineAmount });
  } catch (err) {
    console.log(err);
  }
};
exports.postReturnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const now = new Date();
    let fineAmount = 0;
    if (!book.returned && now > book.returnDate) {
      const diffMilliseconds = now - book.returnDate;
      const diffHours = Math.ceil(diffMilliseconds / (1000 * 60));
      fineAmount = diffHours * 10;
    }

    await book.update({ returned: true, fine: fineAmount });
    res.json({ fine: fineAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postPayFine = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    await book.update({ finePaid: true });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postDeleteBook = async (req, res) => {
  try {
    const { id, fine } = req.params;
    const book = await Book.findByPk(id);
    await book.update({
      finePaid: true,
      actualReturnDate: new Date(),
      fine: fine,
      returned : true,
    });
    res.json({msg : "Book Returned Successfully and DB updated"})
  } catch (err) {
    console.log(err);
  }
};