const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    plot: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },

}, {versionKey: false})

const Note = mongoose.model('Note', noteSchema)
module.exports = Note