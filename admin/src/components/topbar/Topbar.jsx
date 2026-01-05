import "./Topbar.scss";
import logo from "../../assets/adminlogo.png";
import avatar from "../../assets/profile_avatar.png";
import Toggle from "../toggle/Toggle";
import { NotificationsNone, Language, Settings } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { logout } from "../../context/authContext/AuthActions";

export default function Topbar({ handleChange, isChecked }) {
  const { user, dispatch } = useContext(AuthContext);

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
          <NotificationsNone className="icon inactive" />
          <span className="icon-badge">2</span>
        </div>
        <div className="icon-container">
          <Language className="icon inactive" />
          <span className="icon-badge">2</span>
        </div>
        <div className="icon-container">
          <Settings className="icon inactive" />
        </div>
        <div className="icon-container dropdown">
          <img src={user?.imgProfile || avatar} alt="" />
          <div className="dropdown-options">
            <span>Settings</span>
            <span onClick={() => dispatch(logout())}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}