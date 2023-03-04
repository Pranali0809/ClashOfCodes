import React, { useContext, useState } from 'react'
import notescontext from "../context/notes/NoteContext"

export const AddNote = () => {
    const context = useContext(notescontext)
    const [note, setNote] = useState({
        title : "",
        description : "",
        tag : ""
    })
    const {addNote} = context;
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({
            title : "",
            description : "",
            tag : ""
        })
    }
    const onChange = (e) => {
        setNote({...note, [e.target.name] : e.target.value})
    }
    return (
        <div>
            <h2>Add a Note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Title of Note</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onChange} name="title" minLength={5} required value={note.title}/>
                </div> 
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Enter Description</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" onChange={onChange} name="description" minLength={5} required value={note.description}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Enter Tag</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" onChange={onChange} name="tag" value={note.tag}/>
                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Submit</button>
            </form>
        </div>
    )
}