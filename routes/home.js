const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');

router.get('/books', homeController.getBooks);

router.post('/books', homeController.postBooks);

router.post('/return-book/:id', homeController.postReturnBook);

router.post('/pay-fine/:id', homeController.postPayFine);

module.exports = router;