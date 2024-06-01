import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/4359230.jpg";
import { toast } from "react-toastify";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const onButtonClick = async (e) => {
    e.preventDefault();

    if (email === "") {
      setEmailError("Email is required");
    }
    if (password === "") {
      setPasswordError("Password is required");
    }
    if (email !== "" && password !== "") {
      await axios
        .post(process.env.REACT_APP_API_BASE_URL + "/auth/user/signin", {
          email: email,
          password: password,
        })
        .then((res) => {
          if (res.data.msg === "wrong Email") {
            setEmailError("Wrong Email try again");
            toast.error("Wrong Email try again");
          } else if (res.data.msg === "wrong password") {
            setPasswordError("Wrong Password try again");
            toast.error(" Wrong Password try again");
          } else if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-5xl p-10 items-center">
        <div className="md:w-1/2 px-12 md:px-20">
          <h2 className="font-bold text-3xl text-[#002D74]">Login</h2>
          <p className="text-sm mt-6 text-[#002D74]">
            If you already a member, easily login
          </p>
          <form className="flex flex-col gap-6">
            <input
              type="email"
              placeholder="Email"
              onChange={handleEmailChange}
              className={`p-3 mt-10 rounded-xl border text-base
             ${emailError ? "border-red-500" : ""}`}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handlePasswordChange}
                className={`p-3 rounded-xl border w-full text-base ${
                  passwordError ? "border-red-500" : ""
                }`}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="gray"
                className="bi bi-eye absolute top-1/2 right-4 -translate-y-1/2"
                viewBox="0 0 16 16"
                onClick={handleShowPassword}
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
            </div>
            <button
              onClick={(e) => onButtonClick(e)}
              className="bg-[#002D74] rounded-xl text-white py-3 hover:scale-105 duration-300"
            >
              Login
            </button>
          </form>
          <div className="mt-7 text-sm border-b border-[#002D74] py-4 text-[#002D74]">
            <a href="#">Forgot your password?</a>
          </div>
        </div>

        <div className="md:block hidden w-1/2">
          <img src={logo} alt="logo" className="rounded-2xl" />
        </div>
      </div>
    </section>
  );
};

export default Login;
