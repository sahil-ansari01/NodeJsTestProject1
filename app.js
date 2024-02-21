const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const Book = require('./models/book');
const homeRoutes = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', homeRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await db.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
});
