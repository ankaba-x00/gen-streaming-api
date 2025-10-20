import './Navbar.scss';
import logo from '../../assets/netflix_logo.png';
import { Search, NotificationsNone, ArrowDropDown } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../../authContext/AuthContext";
import { logout } from "../../authContext/AuthActions";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const {dispatch} = useContext(AuthContext);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  }
  
  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <img src={logo} alt="" />
          <Link to="/" className="link">
            <span>Home</span>
          </Link>
          <Link to="/series" className="link">
            <span>Shows</span>
          </Link>
          <Link to="/movies" className="link">
            <span>Movies</span>
          </Link>
          <span>New & Popular</span>
          <span>My List</span>
          <span>Browse by Language</span>
        </div>
        <div className="right">
        <span><Search /></span>
        <span>Kids</span>
        <span><NotificationsNone /></span>
        <div className='profile'>
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Netflix avatar" />
          <ArrowDropDown />
          <div className="dropdown-options">
            <span>Settings</span>
            <span onClick={() => dispatch(logout())}>Logout</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar