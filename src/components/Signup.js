import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

export const Signup = () => {
    const history=useHistory();
   
    const [credentials, setCredentials] = useState({
        name : "",
        email : "",
        password : "",
        cpassword :""
    })
    const [msg, setmsg] = useState("");
    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(credentials.password != credentials.cpassword){
            setmsg("Password did not matched");
            return;
        }
        const response = await fetch("http://localhost:5000/api/auth/createUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: credentials.name, email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        // console.log(json);
        if(json.success){
            localStorage.setItem('token', json.authToken)
      history.push("/login");
            
        }else{
            alert("Invalid Credential");
        }
    }
    return (
        <div className="signup">
            <form  onSubmit={handleSubmit} style={{marginLeft:"300px",marginRight:"300px",marginTop:"90px"}}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Name</label>
                    <input type="text" className="form-control" value={credentials.name} onChange={onChange} id="name" name="name" aria-describedby="emailHelp" required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" required/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" required minLength={5}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" value={credentials.cpassword} onChange={onChange} name="cpassword" id="cpassword" required minLength={5}/>
                </div>
                <p>{msg}</p>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}