const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors')
const app = express();
const PORT = 3000;
const DATA_FILE = 'books.json';

app.use(bodyParser.json());

// Middleware to handle CORS

app.use(cors());
// Read all books
app.get('/books', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const books = JSON.parse(data);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Read one book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const books = JSON.parse(data);
        const book = books.find(b => b.id === parseInt(req.params.id, 10));

        if (!book) {
            res.status(404).send('Book not found');
        } else {
            res.json(book);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Create a new book
app.post('/books', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const books = JSON.parse(data);
        const newBook = {
            id: books.length + 1,
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            price: req.body.price,
        };

        books.push(newBook);
        await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));

        res.json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        let books = JSON.parse(data);
        const index = books.findIndex(b => b.id === parseInt(req.params.id, 10));

        if (index === -1) {
            res.status(404).send('Book not found');
        } else {
            const updatedBook = {
                id: parseInt(req.params.id, 10),
                title: req.body.title,
                author: req.body.author,
                year: req.body.year,
                price: req.body.price,
            };

            books[index] = updatedBook;
            await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));

            res.json(updatedBook);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        let books = JSON.parse(data);
        const index = books.findIndex(b => b.id === parseInt(req.params.id, 10));

        if (index === -1) {
            res.status(404).send('Book not found');
        } else {
            const deletedBook = books.splice(index, 1)[0];
            await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));

            res.json(deletedBook);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
