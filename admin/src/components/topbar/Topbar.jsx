import "./Topbar.scss";
import logo from "../../assets/adminlogo.png";
import avatar from "../../assets/profile_avatar.png";
import Toggle from "../toggle/Toggle";
import { NotificationsNone, Language, Settings } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { logout } from "../../context/authContext/AuthActions";

export default function Topbar({ handleChange, isChecked }) {
  const { dispatch } = useContext(AuthContext);

  return (
    <div className="topbar">
      <div className="top-left">
        <img src={logo} alt="" />
      </div>
      <div className="top-right">
        <div className="toggle-container">
          <Toggle handleChange={handleChange} isChecked={isChecked} />
        </div>
        <div className="icon-container">
          <NotificationsNone className="icon" />
          <span className="icon-badge">2</span>
        </div>
        <div className="icon-container">
          <Language className="icon" />
          <span className="icon-badge">2</span>
        </div>
        <div className="icon-container">
          <Settings className="icon" />
        </div>
        <div className="icon-container dropdown">
          <img src={avatar} alt="" />
          <div className="dropdown-options">
            <span>Settings</span>
            <span onClick={() => dispatch(logout())}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}