import React from "react";


import { Rating } from "react-simple-star-rating";



import axios from "axios";
import { useState, useEffect } from "react";


function Friends() {
  const [rating, setRating] = useState(0);
  const [rateId, setRateId] = useState();
  const [open, setOpen] = useState(false);

  const [friends, setFriends] = useState([]);
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleClickToOpen = (id) => {
    setRateId(id);
    setOpen(true);
    console.log("here");
    
  };
  const handleRatingSubmit = async (id, rating) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ratings/",
        JSON.stringify({receiver_id:id, rating:rating}),  // data can be `string` or {object}!
        {
          headers: { "Content-Type": "application/json" },
          withCredential: true,
        }
      );
     
    } catch (err) {
      console.log(err);
    }
  }
  const handleToClose = (e) => {
    setOpen(false);
    handleRatingSubmit(rateId, rating);
  };


  const fetchFriends = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/similar/${localStorage.getItem("email")}`);

      setFriends(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFriends();
    // console.log(friends);
  }, []);
  return (
    <>
      <ul style={{display:"flex",justifyContent:"center",flexWrap:"wrap",boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",listStyleType:"none",padding:"0px",margin:"0px",width:"fitContent",borderRadius:"10px", marginTop:"50px"}}
        className="friends-ul"
      >
        {friends.map((friend) => (
          <>
            <li>
            <div className="card" style={{margin:"20px",padding:"10px"}}>
            <div className="card-body">
              <h3 className="card-title">{friend.name}</h3>
              
              <i class="ri-map-pin-line"></i>
              <span style={{marginLeft:"5px"}}>{friend.regions}</span>
              
              <h6>{friend.ratings}</h6>
              <ul className="interest-ul" style={{width:"fitContent"}}>
                        {friend.interests.map((item, index) => (
                          <li key={index} className="interest-li">
                            {item}{" "}
                          </li>
                        ))}
              </ul>
            </div>
          </div>
            </li>
            </>
          
        ))}
        </ul>
      
   </>
    
  );
}

export default Friends;