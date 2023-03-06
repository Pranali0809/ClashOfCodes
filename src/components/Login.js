import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

export const Login = (props) => {
    const history=useHistory();
    const [credentials, setCredentials] = useState({email: "", password: ""}) 
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(credentials);
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        console.log(json);
        if(json.success){
            localStorage.setItem('token', json.authToken);
            localStorage.setItem('email',json.email);
            history.push("/");
        }else{
            alert("Invalid Credential");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    return (
        <div>
            <form  onSubmit={handleSubmit} style={{marginLeft:"300px",marginRight:"300px",marginTop:"190px"}}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
