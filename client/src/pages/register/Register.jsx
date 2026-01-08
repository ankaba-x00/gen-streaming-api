import './Register.scss';
import logo from '../../assets/netflix_logo.png';
import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const handleStart = () => {
    if (!email.trim()) return alert("Please enter your email!");
    setStep(2);
  }

  const handleFinish = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return alert("Username and password are required!");
    }

    try {
      await axios.post("/api/auth/register", { username, email, password });
      navigate("/login")
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='register'>
      <div className="top">
        <div className="wrapper">
          <img src={logo} alt="Netflix logo" className="logo" />
          <Link to="/login" className="link loginBtn">Sign In</Link>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>Ready to watch? Enter your email to create or restart your membership.</p>
        {step === 1 ? (
          <div className="userInput">
            <input 
              type="email"
              name="email"
              placeholder="email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
            <button 
              className="registerBtn" 
              onClick={handleStart}
            >
              Get Started
            </button>
          </div>
        ) : (
          <form className="userInput">
            <input 
              type="text" 
              name="username"
              placeholder="username"
              value={username} 
              onChange={e => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              name="password"
              placeholder="password"
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              className="registerBtn" 
              onClick={handleFinish}
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
