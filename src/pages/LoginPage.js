import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";
import "./style.css";
const LoginPage = ({ setUserUuid }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    login_username: "",
    login_password: "",
    domains:
      window.location.host +
      (window.localStorage.port ? ":" + window.localhost.port : ""),
  });

  const Navigate = useNavigate();
  const loginHandler = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true);

      const response = await axios({
        method: "post",
        url: "/Organization/login",
        data: userData,
        headers: {
          "Content-Type": "application/json",
        },
      });



      if (response.data.success) {
        let data = response.data.result;
        console.log(data)
        setUserUuid(data.organization_uuid);
        localStorage.setItem("organization_uuid", data.organization_uuid);
        localStorage.setItem("organization_title", data.organization_title);

        localStorage.setItem("user_mobile", data.user_mobile);
        localStorage.setItem("warehouse", JSON.stringify(data.warehouse));

        window.location.assign("/admin");

        setIsLoading(false);
      }else setIsLoading(false)
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div
      id="login-container"
      onKeyDown={(e) => (e.key === "Enter" ? loginHandler() : "")}
    >
      {/* <div className="foodDoAdmin"><img src={foodDoAdmin} alt="" /></div> */}

      <div className="form">
        <h1>Sign In</h1>
        <div className="input-container">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="username"
            className="form-input"
            name="username"
            id="username"
            value={userData.login_username}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                login_username: e.target.value,
              }))
            }
            autoComplete="off"
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-input"
            name="password"
            id="password"
            value={userData.login_password}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                login_password: e.target.value,
              }))
            }
            minLength="5"
            autoComplete="off"
            required
          />
        </div>

        {!isLoading ? (
          <button className="submit-btn" onClick={loginHandler}>
            Log In
          </button>
        ) : (
          <button className="submit-btn" id="loading-screen">
            <svg viewBox="0 0 100 100">
              <path
                d="M10 50A40 40 0 0 0 90 50A40 44.8 0 0 1 10 50"
                fill="#ffffff"
                stroke="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="1s"
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  values="0 50 51;360 50 51"
                ></animateTransform>
              </path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
