import React from 'react'
import { Link, useLocation,useHistory } from "react-router-dom";

export const Navbar = () => {
    let location = useLocation();
    const history = useHistory();
    const HandleLogout = () => {
        console.log("logout")
        localStorage.removeItem('token')
        history("/login");
    }
    return (
        <div className='navbar navbar-expand-sm   navbar-light'     >
            <img src="/img/logo1.svg" style={{ width: "200px",height:"80px" }}></img>
            <div className="">
                <ul className="navbar-nav ">
                    <li className="nav-item fw-bold ">
                        <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item fw-bold">
                        <Link className={`nav-link ${location.pathname === "/ownTrips" ? "active" : ""}`} to="/ownTrips">Own Trips</Link>
                    </li>
                    {/* <li className="nav-item fw-bold">
                        <Link className={`nav-link ${location.pathname === "/login" ? "active" : ""}`} to="/jobs">Login</Link>
                    </li>
                    <li className="nav-item fw-bold">
                        <Link className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`} to="/news">Sign-up</Link>
                    </li> */}
                    <li className="nav-item fw-bold">
                        <Link className={`nav-link ${location.pathname === "/tours" ? "active" : ""}`} to="/tours">Trips</Link>
                    </li>
                    
                    <li className="nav-item fw-bold">
                        <Link className={`nav-link ${location.pathname === "/friends" ? "active" : ""}`} to="/friends">Friends</Link>
                    </li>
                    <li className="nav-item fw-bold">
                        <Link className={`nav-link ${location.pathname === "/hangout" ? "active" : ""}`} to="/hangout">Hangout</Link>
                    </li>
                    <li className="nav-item fw-bold">
                        <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">Profile </Link>
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
                                <Link className="nav-link fw-bold" onClick={HandleLogout}>Logout</Link>
                            </li>
                    }
                </ul>
            </div>
        </div >

    )
}