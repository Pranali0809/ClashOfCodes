import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';


export default function Profile () {
    const [aadhar,setAadhar]=useState();

    const [userid,setUserid]=useState(localStorage.getItem('email'));
    
    const getData = async () => {
        const res = await axios.get(`http://localhost:5000/api/users/?email=${userid}`);
        setInter(res.data.interests);
        setCredentials({...credentials, [credentials.age]: res.data.age});
        setCredentials({...credentials, [credentials.regions]: res.data.regions});
        setCredentials({...credentials, [credentials.ratings]: res.data.ratings});
        setCredentials({...credentials, [credentials.contact]: res.data.phone});
        setCredentials({...credentials, [credentials.gender]: res.data.gender});
        setFrom(res.data.from_date);
        setTo(res.data.to_data)
        setAadhar(res.data.aadhar_verified);
        console.log(res.data);
    }

    React.useEffect(()=>{
        getData();
    },
    [])
    const [inter, setInter] = React.useState([]);
    const interests = [
        "movies",
        "sports",
        "music",
        "reading",
        "travelling",
        "cooking",
        "photography",
        "painting",
        "dancing",
        "writing",
        "fashion",
        "technology",
        "science",
        "politics",
      ];

      const handleClick = (e,name) => {
        e.preventDefault();
        setInter((prev) => [...prev,name]);
      };



    const [from,setFrom]=React.useState(new Date());
    const [to,setTo]=React.useState(new Date());
    const [credentials, setCredentials] = useState({
        age: "",
        contact: "",
        gender: "male",
        aadharcard: "",
        language:"",
        regions:"",
        ratings:""
    })
    const [msg, setmsg] = useState("");
    const onChange = (e) => {
      
        setCredentials({...credentials, [e.target.name]: e.target.value});
 
    }
    
   
    const handleSubmit= async (e)=>{
        e.preventDefault();
        try {


            const res = await axios.post(`http://localhost:5000/api/users/profile/${userid}`,
                JSON.stringify({         
                    age: credentials.age,
                phone: credentials.contact,
                gender : credentials.gender,
                aadhar_verified: true,
                regions: credentials.regions,
                ratings : credentials.ratings,
                from_date: from,
                to_data: to,
                interests: inter,

            }),
                {
                    headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
                    withCredential: true
                });
            // handleClose();

        } catch (err) {
            if (!err?.res) {
                console.log('NO RESPONSE');

            } else if (err.res?.status === 409) {
                console.log("Product exists")
            } else console.log("product addition failed");

        }
    }

    return (
        <div className="signup" style={{marginLeft:"250px",marginRight:"250px",marginTop:"70px"}}>
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input type="number" className="form-control" value={credentials.age} onChange={onChange} name="age" id="age"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="contact" className="form-label">Contact</label>
                    <input type="tel" className="form-control" value={credentials.contact} onChange={onChange} name="contact" id="contact"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="language" className="form-label">Language of communination</label>
                    <input type="" className="form-control" value={credentials.contact} onChange={onChange} name="contact" id="contact"/>
                </div>

                <div className='mb-3'>
                <label htmlFor="gender" className="form-label">Gender</label>
                <div className="form-check">
                <input className="form-check-input" type="radio" name="gender" id="gender1" value="male" checked={credentials.gender === "male"} onChange={onChange} />
                <label className="form-check-label" for="gender1">
                    Male
                </label>
</div>
<div className="form-check">
  <input className="form-check-input" type="radio" name="gender" id="gender2" value="female" checked={credentials.gender === "female"} onChange={onChange} />
  <label className="form-check-label" for="gender2">
    Female
  </label>
</div>


</div>

{!aadhar && <div className="custom-file">
  <input type="file" className="custom-file-input" id="customFile" name="aadharcard" value={credentials.aadharcard} onChange={onChange}/><br></br>
  <label className="custom-file-label" for="customFile">Upload aadhar card</label>
</div>}
<div style={{display:'flex',justifyContent:"space-around"}}>
<div >
 <label for="date">From:</label>
 <Calendar onChange={setFrom} value={from} id="date"/>
   </div>

   <div >
 <label for="to">To:</label>
 <Calendar onChange={setTo} value={to} id="date" style={{width:"100px"}}/>
   </div>
   </div>
   {/* <div className="text-center">
      Selected date: {from.toDateString()}
   </div> */}



<div className="interest-container">
      <ul className="interest-ul">
        {interests.map((item, index) => (

          <li key={index} className={`inter.includes({item}) ? "active interest-li" : "interest-li"}`}>
            <button onClick={(e) => handleClick(e,item)} > {item} </button>
          </li>
        ))}
      </ul>
    </div>

    
                <p>{msg}</p>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}



  






