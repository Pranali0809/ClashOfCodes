import './App.css';
import 'react-calendar/dist/Calendar.css';
import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { About } from './components/About';
import NoteState from './context/notes/NoteState';
import { Alert } from './components/Alert';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import Profile from './components/Profile';
import ChatroomPage from './components/Chating/ChatroomPage';
import DashboardPage from './components/Chating/Dashboard';
import io from "socket.io-client";
import makeToast from "./components/Chating/Toaster";




function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
  }, []);



  return (
    <div className="App">
    <NoteState>
        <Router>
          <Navbar />
          <Alert message="This is amazing"/>
          <div className='container'>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route
          path="/dashboard"
          render={() => <DashboardPage socket={socket} />}
          exact
        />
        <Route
          path="/chatroom/:id"
          render={() => <ChatroomPage socket={socket} />}
          exact
        />

            </Routes>
          </div>
        </Router>
      </NoteState>
    </div>
  );
}

export default App;
