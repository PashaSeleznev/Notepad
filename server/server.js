const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const noteRoutes = require('./routes/note-route')
const app = express()
require('dotenv').config()

const db = process.env.MONGO_URL

mongoose
    .connect(db)
    .then((res) => console.log('connected!'))
    .catch((error) => console.log(error))

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(noteRoutes)

app.listen(5000, () => { console.log("Server started") })