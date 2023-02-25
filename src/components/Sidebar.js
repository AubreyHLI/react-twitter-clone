import React, { useRef, useEffect }from 'react';
import './Sidebar.css';
import SidebarOption from './SidebarOption';
import TwitterIcon from '@mui/icons-material/Twitter';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { Avatar } from '@mui/material';
import { auth } from '../firebase';
import { signOut } from "firebase/auth"; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';


const Sidebar = ({showAccountChange, setShowAccountChange}) => {
    const menuRef = useRef();
    const userAuth = useAuth();
    const navigate = useNavigate();
    

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(!menuRef.current?.contains(e.target)) {
                setShowAccountChange(false);
            }
        } 
        document.addEventListener('click', handleClickOutside); // event listener for whole html file

        return () => document.removeEventListener('click', handleClickOutside);  // clean up
    });


    // const handleSwitchAccount = () => {
    //     setShowAccountChange(false);
    //     navigate('/Login');
    // }

    const handleLogout = async() => {
        try{
            await signOut(auth);
            userAuth.resetCurrentAccount();
            setShowAccountChange(false);
            console.log('Sign-out successful');
            navigate('/Login');
        } catch(error) {
            console.log('Sign-out fail');
        };
    }


    return (
        <div className='sidebar'>
            <TwitterIcon className='twitter-icon'/>
            {/* <img className='kitty-icon' src='/images/kitty.png' alt=''/> */}
            
            <nav className='navigation'>
                <SidebarOption label='Home' Icon={HomeOutlinedIcon} isActive={true} path='/' />
                <SidebarOption label='Explore' Icon={SearchOutlinedIcon} path='/Explore' />
                <SidebarOption label='Notifications' Icon={NotificationsNoneIcon} isHidden={true} path='/Notifi' />
                <button className='tweet-btn tweet-btn-row'>
                    <AddIcon className='btn-icon' />
                    <span className='btn-text'>Tweet</span>
                </button>
                <SidebarOption label='Messages' Icon={MailOutlineIcon} path='#' />
                <SidebarOption label='Bookmarks' Icon={BookmarkBorderIcon} isHidden={true} path='#'/>
                <SidebarOption label='Log in' Icon={ListAltIcon} isHidden={true} path='/Login'/>
                <SidebarOption label='Profile' Icon={PersonOutlineIcon} path='#'/>
                <SidebarOption label='More' Icon={MoreHorizIcon} isHidden={true} path='#'/>
            </nav>
        
            <button className='tweet-btn tweet-btn-col'>
                <AddIcon className='btn-icon' />
                <span className='btn-text'>Tweet</span>
            </button>
            

            <div className='account-box' ref={menuRef}>
                <div className='account-info' onClick={() => setShowAccountChange(prev => !prev)}>
                    {/* <Avatar alt='' src={userAuth.currentAccount?.userImage} className='account-info-avatar'>{userAuth.currentAccount?.username === '' ? null : userAuth?.currentAccount?.username.charAt(0)}</Avatar> */}
                    <Avatar alt='' src={userAuth.currentAccount?.userImage} className='account-info-avatar'/>
                    <div className='account-info-text'>
                        <h4>{userAuth.currentAccount?.username}</h4>
                        <p>@{userAuth.currentAccount?.tag}</p>
                    </div>
                </div>
                {showAccountChange && (
                <div className='account-change-menu'>
                    <div className='account-change'>
                        {/* <span onClick={handleSwitchAccount}>Switch account</span> */}
                        <span onClick={handleLogout}>Log out</span>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar
