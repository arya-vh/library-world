import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { backend_server } from "../../main";
import { BsEye, BsEyeSlash } from "react-icons/bs";

import { useLoginState } from "../../LoginState";

const Login = () => {
  const API_URL = `${backend_server}/api/v1/login`;

  const navigate = useNavigate();
  const refUsername = useRef(null);

  const Empty_Field_Object = { email: "", password: "" };
  const [textfield, setTextField] = useState(Empty_Field_Object);
  const [showPassword, setShowPassword] = useState(false);

  const showLoadingToast = () => {
    return toast.loading("Logging in...", {
      position: "top-center",
      duration: Infinity,
    });
  };

  const userLoginState = useLoginState();

  const HandleSubmit = async (e) => {
    const loadingToastId = showLoadingToast();
    try {
      e.preventDefault();
      const email = textfield.email;
      const password = textfield.password;

      const response = await axios.post(API_URL, { email, password });
      const userType = await response.data.userType;

      toast.dismiss(loadingToastId);

      userLoginState.login(email, userType);
      if (userType === "normal_user") {
        toast.success("Login Success");
        navigate("/", { replace: true });
      } else if (userType === "admin_user") {
        window.location.href = "/admin";
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      if (error.response.data.ENTER_OTP === true) {
        navigate("/otp", { replace: true });
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const error_message = error.response.data.message;
        toast.error(error_message);
      }
    }
  };

  const HandleOnChange = (event) => {
    const field_name = event.target.name;
    const field_value = event.target.value;

    setTextField({ ...textfield, [field_name]: field_value });
  };

  useEffect(() => {
    refUsername.current.focus();
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 mb-5">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        {/* Login Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Login</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={HandleSubmit} method="post">
          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter Email"
              value={textfield.email}
              onChange={HandleOnChange}
              name="email"
              className="form-control"
              autoComplete="off"
              required
              ref={refUsername}
            />
          </div>

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={textfield.password}
              onChange={HandleOnChange}
              name="password"
              className="form-control"
              autoComplete="off"
              required
            />
            <span
              onClick={() =>
                setShowPassword((prevShowPassword) => !prevShowPassword)
              }
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {showPassword ? <BsEye /> : <BsEyeSlash />}
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-4">
          <Link
            to="/forgotpassword"
            className="text-decoration-none text-muted"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="text-center mt-2">
          <span>Don't have an account?</span>
          <Link to="/signup" className="text-decoration-none">
            <span className="ms-1">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
