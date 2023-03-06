import './App.css';
import 'react-calendar/dist/Calendar.css';
import React from "react";

import {   BrowserRouter as Router,
  Switch,
  Route,
  Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { About } from './components/About';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import Profile from './components/Profile';
import ChatroomPage from './components/Chating/ChatroomPage';
import Dashboard from './components/Chating/Dashboard';
import io from "socket.io-client";
import makeToast from "./components/Chating/Toaster";
import Host from './components/Host';
import Tour from './components/Tour'
import Friends from './components/Friend';

function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("token");
    if (token && !socket) {
      const newSocket = io("http://localhost:5000", {
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
    //eslint-disable-next-line
  }, []);

  return (
    <div className="App">
  
        <Router>
          <Navbar />
         
          <div className='container'>
            <Switch>
              <Route exact path="/"> <Home /></Route>
              <Route exact path="/about"><About /></Route> 
              <Route exact path="/login"><Login /></Route> 
              <Route exact path="/signup"><Signup /></Route> 
              <Route exact path="/profile"><Profile /></Route> 
              <Route exact path="/owntrips"><Host /></Route> 
              <Route exact path="/tours"><Tour /></Route> 
              <Route exact path="/friends"><Friends /></Route> 
              <Route exact path="/hangout"><Dashboard /></Route> 
              <Route
          exact path="/dashboard"><Dashboard socket={socket}/></Route>
        <Route
          exact path="/chatroom/:id"><ChatroomPage socket={socket} /></Route>
           
            </Switch>
          </div>
        </Router>

    </div>
  );
}

export default App;
