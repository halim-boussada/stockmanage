import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/");
    } else {
      const user = JSON.parse(userString);
      try {
        const res = await axios.get(
          `http://localhost:3637/auth/user/getUserById/${user._id}`
        );
        setUser(res.data);
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []); //

  const onButtonClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setUsernameError("");
    setPhoneError("");

    let isValid = true;

    if (email === "") {
      setEmailError("Email is required");
      toast.error("Email is required");
      isValid = false;
    }
    if (username === "") {
      setUsernameError("Username is required");
      toast.error("Username is required");
      isValid = false;
    }
    if (phone === "" || !/^\d+$/.test(phone)) {
      setPhoneError("Phone is required in the digits format");
      toast.error("Phone is required in the digits format");
      isValid = false;
    }

    if (isValid) {
      try {
        const res = await axios.put(
          `http://localhost:3637/auth/user/${user._id}`,
          {
            email,
            username,
            phone,
          }
        );
        fetchUserDetails();
        toast.success("User details updated successfully!", {
          position: "top-right",
          icon: "🚀",
        });
        localStorage.setItem("user", JSON.stringify(res.data.getUpdatedUser));
      } catch (err) {
        console.error("Error updating user:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); // Reset loading state if form is invalid
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg w-full max-w-2xl p-10 items-center">
        <div className="w-full px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74] text-center mb-5">
            Account Settings
          </h2>

          <form className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className={`p-2 rounded-xl border text-sm w-full ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className={`p-2 rounded-xl border text-sm w-full ${
                usernameError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className={`p-2 rounded-xl border text-sm w-full ${
                phoneError ? "border-red-500" : "border-gray-300"
              }`}
            />

            <button
              onClick={(e) => onButtonClick(e)}
              className="bg-[#002D74] rounded-xl text-white py-3 hover:bg-[#001F56] transition-transform transform hover:scale-105 duration-300 w-full"
            >
              Update Account
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Settings;
