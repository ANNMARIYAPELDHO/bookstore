const mongoose = require('mongoose')

const connection = mongoose.connect(process.env.DB_URL).then(() => {
    console.log("DB Connected")
})

module.exports = connection