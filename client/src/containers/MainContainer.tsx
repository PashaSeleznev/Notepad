import {useEffect, useState } from "react"
import Note from "../components/Note"
import FullNote from "../components/FullNote"

export type NoteType = {
  _id: string,
  title: string,
  plot: string,
  image: string | null
}

const MainContainer = () => {
  
  const [notes, setNotes] = useState<NoteType[]>([])
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null)

  // Загрузка заметок с сервера
  const fetchNotes = async () => {
    try {
      const response = await fetch("/notes")
      const data: NoteType[] = await response.json()
      setNotes(data)
    } catch {
      console.log("Ошибка при загрузке данных!")
    }
  }

  useEffect(() => {  
    fetchNotes()
  }, [])

  // Синхронизация выбранной заметки с текущим списком заметок
  useEffect(() => {
    setSelectedNote((prev) => {
      if (!prev) return null
      return notes.find((note) => note._id === prev._id) || null
    })
  }, [notes])


  // Добавление заметки
  const addNote = async () => {
    const newNote = {
      title: "Новая заметка",
      plot: "Описание...",
      image: null
    }
    
    try {
      const response = await fetch("/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      })
      if (!response.ok) throw new Error("Ошибка при добавлении!")
      fetchNotes()
    } catch (error) {
        console.error(error)
    }
  }
    
  // Удаление заметки
  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/notes/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Ошибка при удалении!")
      setNotes(notes.filter((note) => note._id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  // Обновление значения выбранной заметки
  const updateSelectedNote = (updatedNote: NoteType) => {
    setSelectedNote(updatedNote)
  }

  // Функция возврата к списку заметок
  const goBack = () => {
    setSelectedNote(null)
  }
  

  const notesList = notes.map((note) => (
    <Note
      key = {note._id} 
      note = {note}
      setSelectedNote={setSelectedNote}
      onDelete = {deleteNote}
    />
  ))
  
  return (
    <div>
      {selectedNote ? (
        <FullNote 
          note={selectedNote} 
          onBack={goBack} 
          fetchNotes={fetchNotes} 
          updateSelectedNote={updateSelectedNote}
        />
      ) : (
        <>
          <div className="header">Мои заметки</div>
          <ul className="notes-list">{notesList}</ul>
          <button className="create-note-btn" onClick={addNote}>Добавить заметку</button>
        </>
      )}
    </div>
  )
}

export default MainContainer