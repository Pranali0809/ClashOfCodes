import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';
import Webcam from 'react-webcam';
import { MultiSelect } from "react-multi-select-component";
import { borderColor } from '@mui/system';

const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user',
  }

export default function Profile () {
    const history = useHistory();
     
      const [picture, setPicture] = useState('');
      const webcamRef = React.useRef(null)
      const capture = React.useCallback(() => {
        const pictureSrc = webcamRef.current.getScreenshot()
        setPicture(pictureSrc)
      })




    const [userid,setUserid]=useState(localStorage.getItem('email'));
    
    const getData = async () => {
        const res = await axios.get(`http://localhost:5000/api/users/?email=${userid}`);
        setSelected(res.data.interests);
        setCredentials({...credentials, [credentials.age]: res.data.age});
        setCredentials({...credentials, [credentials.regions]: res.data.regions});
        setCredentials({...credentials, [credentials.ratings]: res.data.ratings});
        setCredentials({...credentials, [credentials.contact]: res.data.phone});
        setCredentials({...credentials, [credentials.gender]: res.data.gender});
        // setFrom(res.data.from_date);
        // setTo(res.data.to_data)
        
        console.log(res.data);
    }

    React.useEffect(()=>{
        getData();
    },
    [])

    const options = [
      { label: "movies", value: "movies" },
      { label: "sports", value: "sports" },
      { label: "music", value: "music" },
      {label: "reading", value: "reading", disabled: true }
    ];

    const [selected, setSelected] = useState([]);
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
        setSelected((prev) => [...prev,name]);
      };



    const [from,setFrom]=React.useState(new Date());
    const [to,setTo]=React.useState(new Date());
    const [credentials, setCredentials] = useState({
        photo:"",
        age: "",
        contact: "",
        gender: "male",
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


            const res = await axios.post(`http://localhost:5000/upload/profile/${userid}`,
                JSON.stringify({         
                    age: credentials.age,
                phone: credentials.contact,
                gender : credentials.gender,
                regions: credentials.regions,
                ratings : credentials.ratings,
                from_date: from,
                to_data: to,
                interests: selected,
                image: picture
            }),
                {
                    headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
                    withCredential: true
                });
                history.push("/home");

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
            <form  onSubmit={handleSubmit} >
                <div className='container'>
                    <div classname="row">
                        <div className='col-md-6'>

                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input type="number" className="form-control" value={credentials.age} onChange={onChange} name="age" id="age"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="contact" className="form-label">Contact</label>
                    <input type="tel" className="form-control" value={credentials.contact} onChange={onChange} name="contact" id="contact"/>
                </div>
                </div>
                <div className='col-md-6'>

                <div className="mb-3">
                    <label htmlFor="language" className="form-label">Preffered Language</label>
                    <input type="text" className="form-control" value={credentials.language} onChange={onChange} name="language" id="language"/>
                </div>

                <div className='mb-3 mt-6' >
                <label htmlFor="gender" className="form-label " style={{marginLeft:"10px"}}>Gender:</label>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                <div className="form-check" >
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
</div>

</div>


<div style={{display:'flex',justifyContent:"space-around"}}>
<div >
 <label for="date" style={{marginBottom:"10px"}}>From:</label>
 <Calendar onChange={setFrom} value={from} id="date"/>
   </div>

   <div >
 <label for="to">To:</label>
 <Calendar onChange={setTo} value={to} id="date" style={{width:"70px"}}/>
   </div>
   </div>
   {/* <div className="text-center">
      Selected date: {from.toDateString()}
   </div> */}


<div style={{marginTop:"20px"}}>
      <h4>Select Interests</h4>
     
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy="Select"
      />
    </div>



  <select className="form-check-input" style={{marginTop:"20px", width:"450px",height:"40px" ,borderRadius:"2px", borderColor:"lightgrey"}} className="custom-select" id="inputGroupSelect01" name="regions" onChange={onChange} value={credentials.regions}>
    <option selected>Region..</option>
    <option value="north">North</option>
    <option value="south">South</option>
    <option value="east">East</option>
    <option value="west">West</option>
  </select>

           
  <div>
      <h2 className="mb-5 text-center" style={{marginTop:"20px"}}>
        Take a photo
      </h2>
      <div style={{marginLeft:"220px"}}>
        {picture == '' ? (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={picture} />
        )}
      </div>
      <div>
        {picture != '' ? (
          <button style={{marginLeft:"368px",marginTop:"10px"}}
            onClick={(e) => {
              e.preventDefault()
              setPicture()
            }}
            className="btn btn-primary"
          >
            Retake
          </button>
        ) : (
          <button style={{marginLeft:"368px",marginTop: "10px"}}
            onClick={(e) => {
              e.preventDefault()
              capture()
            }}
            className="btn btn-danger"
          >
            Capture
          </button>
        )}
      </div>
    </div>





             
                <button type="submit" className="btn btn-primary" style={{float:"right"}}>Add Profile</button>
                </div>
                </div>
            </form>
        </div>
    )
}



  






