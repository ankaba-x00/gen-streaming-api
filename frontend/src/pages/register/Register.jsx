import './Register.scss';
import logo from '../../assets/netflix_logo.png';
import { useRef, useState } from 'react';

export default function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleStart = () => {
    setEmail(emailRef.current.value)
  }
  const handleFinish = () => {
    setPassword(passwordRef.current.value)
  }

  return (
    <div className='register'>
      <div className="top">
        <div className="wrapper">
          <img src={logo} alt="Netflix logo" className="logo" />
          <button className="loginBtn">Sign In</button>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>Ready to watch? Enter your email to create or restart your membership.</p>
        {!email ? (
          <div className="userInput">
            <input type="email" placeholder="email address" ref={emailRef} />
            <button className="registerBtn" onClick={handleStart}>Get Started</button>
          </div>
        ) : (
          <form className="userInput">
            <input type="password" placeholder="password" ref={passwordRef} />
            <button className="registerBtn" onClick={handleFinish}>Register</button>
          </form>
        )}
      </div>
    </div>
  )
}
