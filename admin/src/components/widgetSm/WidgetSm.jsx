import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./WidgetSm.scss";
import { Visibility } from "@mui/icons-material";
import axios from "axios";
import defaultAvatar from "../../assets/profile_avatar.png";

export default function WidgetSm() {

  const [newUsers, setNewUsers] = useState([]);

  useEffect(() => {
    const getNewUsers = async () => {
      try {
        const res = await axios.get("/api/users?new=true", {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          }
        });
        setNewUsers(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getNewUsers();
  }, [])

  return (
    <div className="widget-sm">
      <span className="widget-header">New Joined Members</span>
      <ul className="widget-list">
        {newUsers.map((user) => (
          <li className="list-item" key={user._id}>
            <img src={user.imgProfile || defaultAvatar} alt="" />
            <div className="user">
              <span className="user-name">{user.username}</span>
            </div>
            <Link
              to={`/user/${user._id}`}
              state={{ user }}
            >
              <button className="widget-btn">
                <Visibility className="icon"/>
                Display
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
