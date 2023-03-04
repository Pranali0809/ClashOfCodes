import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesinitial = [];
    const [notes, setNotes] = useState(notesinitial)
  
    // get all notes
    const getNotes = async () => {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token' : localStorage.getItem('token') 
        }
      });
      const json = await response.json();
      setNotes(json)
    }

    // Add a note
      const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token') 
          },
          body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        setNotes(notes.concat(json));
      }
    // Delete a note
      const deleteNote = async (id) => {
        // TODO API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token') 
          },
        });
        const temp = notes;
        // console.log(notes);
        const newNotes = temp.filter((note) => { return note._id !== id })
        setNotes(newNotes)
        // console.log(json);
      }
    // Edit a note
      const editNote = async (id, title, description, tag) => {
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token') 
          },
          body: JSON.stringify({title, description, tag})
        });
        // const json = await response.json(); 
        // console.log(json);
        let newnotes = JSON.parse(JSON.stringify(notes)) // creates a deep copy
        for(let index=0; index < newnotes.length; index++){
          let element = newnotes[index];
          if(element._id === id){
            element.title = title;
            element.description = description;
            element.tag = tag;
            newnotes[index] = element;
            break;
          }
        }
        setNotes(newnotes);
      }
    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;