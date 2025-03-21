const Note = require('../models/Note')

const getNotes = (req, res) => {
    Note.find()
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
          });
}

const addNote = async (req, res) => {
    try {
      if (req.body) {
        console.log('Получен запрос на сохранение заметки:', req.body)
        const { title, plot, image } = req.body
        const note = new Note({
          title: title,
          plot: plot,
          image: image || ''
         })
        const result = await note.save()
        console.log('Заметка сохранена:', result)
        res.status(201).json(result)
      } else {
        console.log('Тело запроса пустое')
        res.status(400).send('Тело запроса пустое')
      }
    } catch (error) {
      console.error('Ошибка при сохранении заметки:', error)
      res.status(500).send('Ошибка при сохранении заметки')
    }
  }

  const deleteNote = async (req, res) => {
    try {
      const { id } = req.params
      await Note.findByIdAndDelete(id)
      res.status(200).send(`Заметка с ID ${id} была удалена.`)
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error)
      res.status(500).send('Ошибка при удалении заметки')
    }
  }

  const editNote = async (req, res) => {
    console.log("req.body:", req.body);
    try {
      const { title, plot} = req.body
      const imagePath = req.file ? `uploads/${req.file.filename}` : req.body.image
      
      const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        {title, plot, image: imagePath},
        {new: true}
      )
      res.json(updatedNote)
    } catch (error) {
      console.error('Ошибка при обновлении заметки:', error)
      res.status(500).send('Ошибка при обновлении заметки')
    }
  }

  module.exports = {
    getNotes,
    addNote,
    deleteNote,
    editNote
  }