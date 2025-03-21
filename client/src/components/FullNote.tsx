import { FC, useState } from "react";
import { NoteType } from "../containers/MainContainer";

export type FullNoteProps = {
  note: NoteType,
  onBack: () => void,
  fetchNotes: () => void,
  updateSelectedNote: (updatedNote: NoteType) => void
};

const FullNote: FC<FullNoteProps> = ({ note, onBack, fetchNotes, updateSelectedNote }) => {
  
  const [isEditing, setIsEditing] = useState(false)
  // Файл с изображением
  const [file, setFile] = useState<File | null>(null)
  // Название загруженного файла
  const [fileName, setFileName] = useState<string>("📂 Загрузить изображение")
  // Копия заметки для режима редактирования
  const [editNote, setEditNote] = useState<NoteType>({...note})

  // Сохранение заметки после редактирования
  const handleSave = async () => {
    const updatedNote: NoteType = {
      ...note,
      title: editNote.title.trim() ? editNote.title : "Без названия",
      plot: editNote.plot.trim() ? editNote.plot : "Без описания",
      image: file === null ? "" : editNote.image
    }

    if (file) {
      // Если есть файл, отправляем его через FormData
      const formData = new FormData()
      formData.append("title", updatedNote.title)
      formData.append("plot", updatedNote.plot)
      formData.append("image", file)
      // console.log(file)
      try {
        const response = await fetch(`/notes/${note._id}`, {
          method: "PUT",
          body: formData,
        })
        if (!response.ok) throw new Error("Ошибка при редактировании!")
        // const result = await response.json()
        // console.log(result)
      } catch (error) {
        console.error(error)
      }
    } else {
      // Если файла нет, отправляем JSON
      const response = await fetch(`/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      })
      if (!response.ok) throw new Error("Ошибка при редактировании!")
      // const result = await response.json()
      // console.log(result)
    }

    updateSelectedNote(updatedNote)
    fetchNotes()
    setIsEditing(false)
  }

  // Удаление изображения при редактировании
  const handleDeleteImage = async () => {
    setEditNote(prev => ({ ...prev, image: "" }))
    setFile(null)
    setFileName("📂 Загрузить изображение")
  }

  // Обновление файла при загрузке картинки
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setFileName(selectedFile ? `📄 ${selectedFile.name}` : "📂 Загрузить изображение")
  }

  return (
    <div className="note-info">
      <img 
        src="src/images/back-img.png"
        className="back-btn" 
        onClick={onBack}>
      </img>
      <div >
        {isEditing ? (
          <div className="note-edit">
            <input 
              className="edit-title" 
              value={editNote.title} 
              onChange={(e) => setEditNote({...editNote, title: e.target.value})} 
            />
            <textarea 
              className="edit-plot" 
              value={editNote.plot} 
              onChange={(e) => setEditNote({...editNote, plot: e.target.value})}  
            />
            {editNote.image ? (
              <div className="edit-img">
                <img 
                  className="note-edit-img"
                  src={`http://localhost:5000/${editNote.image}`}
                />
                <img 
                  src="src/images/delete-img.png"  
                  className="delete-img" 
                  onClick={handleDeleteImage}>
                </img>
              </div>
            ) : (
                <label className="add-img">
                <input type="file" onChange={handleFileChange} />{fileName}
                </label>
            )}
            <div className="save-cancel-btns">
              <button className="save-btn" onClick={handleSave}>Сохранить</button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false)
                  setEditNote(note)
                  setFile(null)
                  setFileName("📂 Загрузить изображение")
                }}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="note-details">
            <div className="note-details-title">{note.title}</div>
            <div className="note-details-plot">{note.plot}</div>
            {note.image && (
                <img
                src={`http://localhost:5000/${note.image}`}
                className="note-details-img"
              />
            )}
            <button 
              className="edit-btn" 
              onClick={() => {
                setIsEditing(true) 
                setEditNote(note)
                }}>
                Редактировать
            </button>
          </div>
        )}
        </div>
      </div>
    )
}

export default FullNote
