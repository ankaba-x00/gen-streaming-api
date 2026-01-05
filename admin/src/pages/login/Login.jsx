import "./Login.scss";
import Toggle from "../../components/toggle/Toggle";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { loginCall } from "../../context/authContext/ApiCalls";

export default function Login({ handleChange, isChecked }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    loginCall( { identifier, password }, dispatch);
  }

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
    </div>
  )
}
