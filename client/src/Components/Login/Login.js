import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import { auth, googleAuthProvider } from "../../firebase";
// import { signInWithPopup } from "firebase/auth";
import "./login.css";
import UserContext from "../../utils/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loggedInUser, setUser} = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://my-trello-api.vercel.app/user/login", {
        email,
        password,
      },{
        withCredentials: true, // This ensures cookies are sent with the request
      });
      const token = response.data.token; // Assuming token is returned in the response
      console.log(response, "response");
      setUser(response.data);
      const logData = JSON.parse(response.config.data);
      console.log(logData, "logdata");
      navigate("/dashboard", { state: { logData } });
    } catch (error) {
      alert("Login failed!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
    //   const result = await signInWithPopup(auth, googleAuthProvider);
    //   // Handle successful authentication here
    //   console.log(result.user);
    //   navigate("/dashboard"); // Navigate to the dashboard
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="login-div">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        /><br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br/>
        <button type="submit">Log In</button>
        <p>
          Don't have an account? <Link to="/signup"> Sign Up</Link>
        </p>
        <button className="g-btn" onClick={handleGoogleLogin}>Login with Google</button>
      </form>
    </div>
  );
};

export default Login;
