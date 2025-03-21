const express = require('express')
const router = express.Router()
const {getNotes, addNote, deleteNote, editNote} = require('../controllers/note-controller')
const upload = require('../middleware/upload')

router.get('/notes', getNotes)
router.post('/notes', addNote)
router.delete('/notes/:id', deleteNote)
router.put('/notes/:id', upload.single('image'), editNote)

module.exports = router


