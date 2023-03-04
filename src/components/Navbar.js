import React from 'react'
import {Link, useLocation} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
export const Navbar = () => {
    let location = useLocation();
    const navigate = useNavigate();
    const HandleLogout = () => {
        console.log("loguottt")
        navigate("/login"); 
        localStorage.removeItem('token')
    }
    return (
        <div>
            <ul className="nav justify-content-center py-2 bg-dark">
            <li className="nav-item">
                <Link className={`nav-link ${location.pathname==="/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${location.pathname==="/about" ? "active" : ""}`} to="/about">About Us</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="#">Notes</Link>
            </li>
            {
                !localStorage.getItem('token') ? <><li className='nav-item'>
                        <Link className='nav-link' to='/login'>Login</Link>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/signup'>Signup</Link>
                    </li></>
                :
                <li className="nav-item">
                    <Link className="nav-link" onClick={HandleLogout}>Logout</Link>
                </li>
            }
            </ul>
        </div>
    )
}