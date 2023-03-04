import React, { useContext } from 'react'
import notescontext from "../context/notes/NoteContext"

const NotesItem = (props) => {
    const context = useContext(notescontext);
    const {deleteNote} = context;
    const {note, updateNote} = props;

    return (
        <div className='col-md-3'>
            <div className="card my-3 mx-1">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <i className="fa-sharp fa-solid fa-trash mx-3" onClick={() => {deleteNote(note._id)}}></i>
                    <i className="fa-solid fa-pen-to-square mx-3" onClick={()=>{updateNote(note)}}></i>
                </div>
            </div>
        </div>
    )
}
export default NotesItem