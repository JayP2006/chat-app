import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/AuthContext';

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`rounded-xl px-5 py-2 font-semibold transition duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center shadow-md bg-opacity-20 backdrop-blur-md relative z-10 text-white">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Sparkles className="text-yellow-400" />
        ChatVerse
      </div>

      <div className="hidden md:flex gap-4">
        <NavLink to="/login">
          <Button className="border border-white hover:bg-white hover:text-black">Login</Button>
        </NavLink>
        <NavLink to="/register">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Register</Button>
        </NavLink>
      </div>

      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full flex flex-col items-center gap-4 bg-black bg-opacity-90 p-6 md:hidden">
          <NavLink to="/login" onClick={() => setMenuOpen(false)}>
            <Button className="w-full border border-white hover:bg-white hover:text-black">Login</Button>
          </NavLink>
          <NavLink to="/register" onClick={() => setMenuOpen(false)}>
            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300">Register</Button>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    gender: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', formData);
      toast.success(res.data.message);
      localStorage.setItem('chatapp', JSON.stringify(res.data));
      setAuthUser(res.data);
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || error.message || "Server Error";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full text-gray-800">
          <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <NavLink to="/login" className="text-indigo-600 hover:underline font-medium">
              Login
            </NavLink>
          </p>
        </div>
      </div>

      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-800">
        © 2025 ChatVerse. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;
