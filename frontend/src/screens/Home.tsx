import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      Hello Home Page
      <button onClick={() => navigate("/register")}>Get Started</button>
      <button onClick={() => navigate("/login")}>Log In</button>
    </div>
  );
};

export default Home;
