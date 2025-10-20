import './Login.scss';
import logo from '../../assets/netflix_logo.png';
import { useContext, useState } from "react";
import { loginCall } from "../../authContext/ApiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {dispatch} = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    loginCall({ email, password }, dispatch) 
  }

  return (
    <div className='login'>
      <div className="top">
        <div className="wrapper">
          <img src={logo} alt="Netflix logo" className="logo" />
        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In</h1>
          <input type="email" placeholder="Email or phone number" onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          <button className="loginBtn" onClick={handleLogin}>Sign In</button>
          <span>New to Netflix? <Link to="/register" className="link"><b>Sign up now.</b></Link></span>
          <small>
            This page is protected by Google reCAPTCHA to ensure you're not a bot. 
            <b>Learn more</b>.
          </small>
        </form>
      </div>
    </div>
  )
}
