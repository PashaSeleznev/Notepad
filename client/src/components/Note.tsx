import { FC} from "react";
import { NoteType } from "../containers/MainContainer";

export type NoteProps = {
  note: NoteType,
  setSelectedNote: (note: NoteType | null) => void,
  onDelete: (id: string) => void
};

const Note: FC<NoteProps> = ({ note, setSelectedNote, onDelete }) => {
  return (
    <li className="note">
      <div className="note-title" onClick={() => setSelectedNote(note)}>{note.title}</div>
      <img 
        src="src/images/delete-img.png"  
        className="note-delete" 
        onClick={() => onDelete(note._id)}>
      </img>
    </li>
  )
}

export default Note
