import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "./Toaster";

const DashboardPage = (props) => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const getChatrooms = () => {
    axios
      .get("http://localhost:5000/chatroom", {
        headers: {
            'auth-token': localStorage.getItem('token')
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);
  
  const createChatroom = () => {
    const chatroomName = chatroomNameRef.current.value;

    axios
      .post("http://localhost:5000/chatroom", {
        name: chatroomName,
      }, {
        headers: {
            'auth-token': localStorage.getItem('token'),
        },
      })
      .then((response) => {
        makeToast("success", response.data.message);
        getChatrooms();
        chatroomNameRef.current.value = "";
      })
      .catch((err) => {
        // console.log(err);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };
  
  const chatroomNameRef = React.createRef();

  return (
    <div className="card1" >
      <div className="cardHeader1">Chatrooms</div>
      <div className="cardBody1">
        <div className="inputGroup1">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            ref={chatroomNameRef}
            placeholder="ChatterBox Bandra"
          />
        </div>
      </div>
      <button onClick={createChatroom}>Create Chatroom</button>
      <div className="chatrooms1">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;