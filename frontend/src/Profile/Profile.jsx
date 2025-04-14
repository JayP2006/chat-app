import React from "react";
import {
  FaEnvelope,
  FaVenusMars,
  FaCalendarAlt
} from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate(); // Fix here: no need to destructure

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const gotohome = () => {
    try {
      navigate("/Dashboard"); // Navigate to /Dashboard on button click
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0c3fc] via-[#8ec5fc] to-[#d9afd9] overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute w-[700px] h-[700px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob -top-48 -left-48"></div>
      <div className="absolute w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 -bottom-32 -right-32"></div>

      {/* Profile Card */}
      <div className="relative z-10 bg-white/30 backdrop-blur-md shadow-2xl rounded-3xl px-8 py-10 w-full max-w-md text-center border border-white/30">
        <img
          src={authUser.profilepic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-md mb-4"
        />
        <h2 className="text-4xl font-extrabold text-gray-800">{authUser.fullname}</h2>
        <p className="text-gray-600 text-md mb-6">@{authUser.username}</p>

        <div className="text-left space-y-4 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-blue-600" />
            <span>{authUser.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaVenusMars className="text-pink-500" />
            <span className="capitalize">{authUser.gender}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-green-500" />
            <span>Joined on {formatDate(authUser.createdAt)}</span>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={gotohome}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
