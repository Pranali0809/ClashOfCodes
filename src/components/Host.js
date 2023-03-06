import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';


export default function Host () {
    const history = useHistory();





    const [userid,setUserid]=useState(localStorage.getItem('email'));
    


      



    const [from,setFrom]=React.useState(new Date());
    const [credentials, setCredentials] = useState({
        location:"",
        host_name:"",
        estimated:"",
        womens_only:"",
        description:"",
        image:"",
    }) ;
     const onChange = (e) => {
      
        setCredentials({...credentials, [e.target.name]: e.target.value});
 
    }
    
   
    const handleSubmit= async (e)=>{
        e.preventDefault();
        try {


            const res = await axios.post(`http://localhost:5000/api/trips/create`,
                JSON.stringify({         
                    location: credentials.location,
                host_username: credentials.host_name,
                estimated_budget : credentials.estimated,
                womens_only: credentials.womens_only,
                description: credentials.description,
                date: from,
                
                image: credentials.image,
            }),
                {
                    headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
                    withCredential: true
                });
                history.push("/");

        } catch (err) {
            if (!err?.res) {
                console.log('NO RESPONSE');

            } else if (err.res?.status === 409) {
                console.log("Product exists")
            } else console.log("product addition failed");

        }
    }

    return (
        <div className="signup" style={{marginLeft:"300px",marginRight:"300px",marginTop:"70px"}}>
            <h1>ADD A TRIP</h1>
            <form  onSubmit={handleSubmit} >
                
                  
                    

                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input type="text" className="form-control" value={credentials.location} onChange={onChange} name="location" id="location"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="host_name" className="form-label">Host Name</label>
                    <input type="text" className="form-control" value={credentials.name} onChange={onChange} name="name" id="name"/>
                </div>
    

                <div className="mb-3">
                    <label htmlFor="budget" className="form-label">Estimated Budget in Rs.</label>
                    <input type="number" className="form-control" value={credentials.estimated} onChange={onChange} name="estimated" id="estimated"/>
                </div>

                <div className='mb-3 mt-6' >
                <label htmlFor="only" className="form-label " style={{marginLeft:"10px"}}>Womens Only:</label>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                <div className="form-check" >
                <input className="form-check-input" type="radio" name="womens_only" id="only" value="true" checked={credentials.womens_only === "true"} onChange={onChange} />
                <label className="form-check-label" htmlFor="only">
                    True
                </label>
</div>

<div className="form-check">
  <input className="form-check-input" type="radio" name="womens_only" id="only2" value="false" checked={credentials.womens_only === "false"} onChange={onChange} />
  <label className="form-check-label" htmlFor='only2'>
    False
  </label>
</div>
</div>
</div>



<div >
 <label for="date">Date</label>
 <Calendar onChange={setFrom} value={from} id="date"/>
   </div>

   <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <input type="text" className="form-control" value={credentials.description} onChange={onChange} name="description" id="desc"/>
                </div>

                <div class="mb-3">
  <label htmlFor="formFile" class="form-label">UPLOAD LOCATION IMAGE</label>
  <input className="form-control" type="file" id="formFile" name="image" onChange={onChange} value={credentials.image}/>
</div>




             
                <button type="submit" className="btn btn-primary" style={{float:"right"}}>Add Trip</button>
               
               
            </form>
        </div>
    )
}



  






