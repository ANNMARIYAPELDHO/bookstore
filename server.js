require("dotenv").config()
const express = require("express")
const bcrypt = require("bcrypt")
const connection = require("./config/db")
const User = require("./model/user")
const Book = require("./model/book")

const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.redirect("/login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)
    await User.create({ username, email, password: hashed })
    res.redirect("/login")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.send("No account found. <a href='/signup'>Sign up</a>")
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.send("Wrong password. <a href='/login'>Try again</a>")
    res.redirect("/home?user=" + user.username)
})

app.get("/home", async (req, res) => {
    const username = req.query.user
    if (!username) return res.redirect("/login")
    const books = await Book.find()
    res.render("home", { books, user: username })
})

app.get("/add-book", (req, res) => {
    const username = req.query.user
    res.render("add-book", { user: username })
})

app.post("/add-book", async (req, res) => {
    const { title, author, price, description, user } = req.body
    await Book.create({ title, author, price, description })
    res.redirect("/home?user=" + user)
})

app.post("/delete/:id", async (req, res) => {
    const username = req.body.user
    await Book.findByIdAndDelete(req.params.id)
    res.redirect("/home?user=" + username)
})

app.get("/edit-book/:id", async (req, res) => {
    const book = await Book.findById(req.params.id)
    const username = req.query.user
    res.render("edit-book", { book, user: username })
})

app.post("/edit-book/:id", async (req, res) => {
    const { title, author, price, description, user } = req.body
    await Book.findByIdAndUpdate(req.params.id, { title, author, price, description })
    res.redirect("/home?user=" + user)
})

app.get("/logout", (req, res) => {
    res.redirect("/login")
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})