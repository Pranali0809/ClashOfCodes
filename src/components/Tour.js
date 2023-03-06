import axios from "axios";
  import { useState, useEffect } from "react";
  import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    CardActions,
    Button,
  } from "@mui/material";

  function Tours() {
    const [tours, setTours] = useState([]);
    const fetchTours = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trips/`);

        setTours(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const addRSVP = async (id) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/trips/rsvp`,
          JSON.stringify({ trip_id: id, email: localStorage.getItem("email") }), // data can be `string` or {object}!
          {
            headers: { "Content-Type": "application/json" },
            withCredential: true,
          }
        );
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const delRSVP = async (id) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/trips/drsvp`,
          JSON.stringify({ trip_id: id, email: localStorage.getItem("email") }), // data can be `string` or {object}!
          {
            headers: { "Content-Type": "application/json" },
            withCredential: true,
          }
        );
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      fetchTours();
    }, []);
    if (tours.length === 0) {
      return (
        <main>
          <div className="title">
            <h2>no tours left</h2>
            <button className="btn" onClick={() => fetchTours()}>
              refresh
            </button>
          </div>
        </main>
      );
    }
    return (
      <>
        <div>
          <ul className="tours-ul">
            {tours.map((tour) => {
              return (
                <li className="tour-li" key={tour.id}>
                  <Card className="tour-card" style={{ position: "relative" }}>
                    {/* {console.log(httpimage_url)} */}
                    <CardMedia
                      component="img"
                      height="140"
                      image={tour.image_url}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {tour.location}
                      </Typography>
                      <Typography color="textSecondary">
                        {tour.date.substring(0, 10)}
                      </Typography>
                      <Typography color="textSecondary" style={{position:"absolute",top:"0px", right:"0px", backgroundColor:"white", padding:"8px",borderRadius:"2px" ,color:"black"


                      
                      }}>
                        Rs{tour.estimated_budget}
                      </Typography>
                      {tour.womens_only && 
                      <Typography style={{backgroundColor:"pink",width:"100px",borderRadius:"2px" ,paddng:"5px"}}>
                        <i style={{marginRight:"5px"}}class="ri-women-line"></i>
                        Female </Typography>
                      
                      }
                      <Typography>No. of RSVPs{tour.rsvp_count}</Typography>
                      <Typography variant="body2" component="p">
                        {tour.description}
                      </Typography>
                    </CardContent>
                      
                    <CardActions
                      style={{
                        position: "absolute",
                        bottom: "15px",
                        right: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <Button size="small " style={{color:"green" ,padding:"3px"}} onClick={() => addRSVP(tour._id)}>
                        RSVP
                      </Button>
                      <Button size="small" style={{color:"red"}} onClick={() => delRSVP(tour._id)}>
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  }

  export default Tours;