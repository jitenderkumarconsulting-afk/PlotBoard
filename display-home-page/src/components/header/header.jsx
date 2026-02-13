import React, { useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authentication"
import { useEffect, useState } from 'react';
import css from "./header.module.css";
import { socketService } from '../../api/socketGatewayService';


const ComponentHeader = (props) => {

    const [open, setOpen] = useState(false);
    const state = useSelector((store) => store.auth)
    const [hideHeader, setHideHeader] = useState(false)
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate = useNavigate();
    const extemptUrls = ["/login", "/signup"];

    const cm = useRef(null);

    useEffect(() => {
        if (extemptUrls.includes(location.pathname)) {
            setHideHeader(true)
        } else {
            setHideHeader(false)
        }
    }, [])

    const logoutClick = () => {
        console.log('window.location.pathname: ',window.location.pathname);
        console.log('window.location.pathname: ',window.location.pathname);
        const gameTokenPattern = /\/play-game\/([A-Za-z0-9]+)/;
    
        // Use a regular expression to match the game token
        const match = window.location.pathname.match(gameTokenPattern);
        
        if (match && match[1]) {
          const gameToken = match[1];
          
          // Now you have the game token, and you can perform the logout action
          // For example, you can send a request to your server to log the user out
          // or clear the user's session.
          
          // Perform the logout action here using the gameToken
          console.log('Logged out with game token:', gameToken);
          socketService.leaveRoom({ gameToken: gameToken,userId:state.user.id });
          // After logging out, you can redirect the user to another page if needed
          // window.location.href = '/login'; // Redirect to the login page
        }
        dispatch(logout((result) => {
            navigate('/')
        }));
    }

    return (
        !hideHeader ?
            (
                <div className={`${css.header}`}>
                    <div className={`${css.header_container}`}>
                        <div className={`${css.header_logo}`}>
                            <Link to="/">
                                <img src='/assets/logo-sm.png' alt='' />
                            </Link>
                        </div>
                        {
                            state.isAuthenticated ?
                                <div className={`${css.header_nav}`}>
                                    
                                    <Link to="/browse-games"> Browse Games</Link>
                                    <Link to="/add-game">Add Game</Link>
                                    <Link to="/my-games">My Games</Link>

                                    <div className="d-flex">
                                        <div className="position-relative">
                                            <div onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                                                <span className={`py-3 ${css.profile_img}`}>
                                                    <span className={`me-3 ${css.profile}`}>
                                                        <img src="images/profile-img.png" alt="" />
                                                    </span>
                                                    <span>
                                                        <p>{state.user.name}!</p>
                                                    </span>
                                                </span>
                                            </div>

                                            <ul className={`${css.profile_icon_text} dropdown-menu ${open ? "show" : ""}`} onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                                                <li className='d-flex justify-content-start align-items-center'>
                                                    <span>
                                                        <span className={`${css.profile_icon}`}>
                                                            <i className="bi bi-person"></i>
                                                        </span>
                                                        <span className={`${css.profile_text}`}>
                                                            <Link to="/profile">My Profile</Link>
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className='d-flex justify-content-start align-items-center'>
                                                    <span>
                                                        <span className={`${css.profile_icon}`}>
                                                            <i className="bi bi-power"></i>
                                                        </span>
                                                        <span className={`${css.profile_text}`}>
                                                            <Link onClick={() => logoutClick()}>Logout</Link>
                                                        </span>
                                                    </span>
                                                </li>
                                            </ul>

                                        </div>
                                    </div>

                                </div>
                                :
                                <div className={`${css.header_nav}`}>
                                    <Link to="/browse-games"> Browse Games</Link>
                                    <Link to="/login">Login</Link>
                                    <Link to="/signup" className={`${css.highlight}`}>Sign Up</Link>
                                </div>
                        }
                    </div>
                </div>
            ) : null
    )
}


export default ComponentHeader