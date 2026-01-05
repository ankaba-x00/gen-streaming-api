import "./Login.scss";
import Toggle from "../../components/toggle/Toggle";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { loginCall } from "../../context/authContext/ApiCalls";
import Notification from "../../components/notification/Notification"; 

export default function Login({ handleChange, isChecked }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, dispatch } = useContext(AuthContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginCall( 
      { identifier, password }, 
      dispatch
    );

    if (!result.success) {
      setSnackbarMessage(result.message);
      setSnackbarOpen(true);
    }
  }

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <div className="login">
      <div className="toggle">
        <Toggle handleChange={handleChange} isChecked={isChecked} />
      </div>
      <div className="login-container">
      <h3 className="login-title">Admin Dashboard Login</h3>
      <form className="login-form">
        <input 
          type="text" 
          placeholder="Email or username" 
          className="login-input"
          onChange={(e) => {setIdentifier(e.target.value)}}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="login-input"
          onChange={(e) => {setPassword(e.target.value)}}
        />
        <button 
          className="login-btn"
          onClick={handleLogin}
          disabled={isFetching}
        >
          Sign In
        </button>
      </form>
      </div>
      <Notification
        snType="auth"
        snOpen={snackbarOpen}
        snClose={handleSnackbarClose}
        snMessage={snackbarMessage}
      />
    </div>
  )
}
