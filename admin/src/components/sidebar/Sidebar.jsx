import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { Home, BarChart, TrendingUp, People, Person, LocalMovies, Movie, List, Input, Mail, DynamicFeed, Chat, BusinessCenter, Report } from "@mui/icons-material";

export default function Sidebar() {
  return (
    <div className="sidebar">
       <div className="menu-container">

        <div className="menu-block">
          <h3 className="block-title">Performance</h3>
          <ul className="block-selection">
            <Link to="/" className="link"><li className="block-item active"><Home className="icon" />Home</li></Link>
            <li className="block-item inactive"><TrendingUp className="icon" />Sales</li>
          </ul>
        </div>

        <div className="menu-block">
          <h3 className="block-title">Operations</h3>
          <ul className="block-selection">
            <Link to="/users" className="link"><li className="block-item"><People className="icon" />All Users</li></Link>
            <Link to="/newuser" className="link"><li className="block-item"><Person className="icon" />Log User</li></Link>
            <Link to="/movies" className="link"><li className="block-item"><LocalMovies className="icon" />All Media</li></Link>
            <Link to="/newmovie" className="link"><li className="block-item"><Movie className="icon" />Log Media</li></Link>
            <Link to="/lists" className="link"><li className="block-item"><List className="icon" />All Lists</li></Link>
            <Link to="/newlist" className="link"><li className="block-item"><Input className="icon" />Log List</li></Link>
          </ul>
        </div>

        <div className="menu-block">
          <h3 className="block-title">Staff</h3>
          <ul className="block-selection">
            <li className="block-item inactive"><BusinessCenter className="icon" />Manage</li>
            <li className="block-item inactive"><BarChart className="icon" />Analytics</li>
            <li className="block-item inactive"><Report className="icon" />Reports</li>
          </ul>
        </div>

        <div className="menu-block">
          <h3 className="block-title">Notifications</h3>
          <ul className="block-selection">
            <li className="block-item inactive"><Mail className="icon" />Mail</li>
            <li className="block-item inactive"><DynamicFeed className="icon" />Feedback</li>
            <li className="block-item inactive"><Chat className="icon" />Messages</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
