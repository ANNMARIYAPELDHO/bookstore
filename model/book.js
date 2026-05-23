const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    description: String
})

const Book = mongoose.model("books", bookSchema)

module.exports = Book