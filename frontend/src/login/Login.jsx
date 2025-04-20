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

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setloading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const login = await axios.post(`https://chat-karo-rg16.onrender.com/api/auth/login`, formData);
      const data = login.data;
      if (data.success === false) {
        setloading(false);
        return toast.error(data.message);
      }
      toast.success(data.message);
      localStorage.setItem('chatapp', JSON.stringify(data));
      setAuthUser(data);
      setloading(false);
      navigate('/Dashboard');
    } catch (error) {
      setloading(false);
      const msg = error.response?.data?.message || error.message || "Server Error";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full text-gray-800">
          <h2 className="text-3xl font-bold text-center mb-6">Chat with Us</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign Up
            </NavLink>
          </p>

          <div className="mt-4 text-center">
            <NavLink to="/" className="text-sm text-gray-500 hover:text-indigo-600 transition">
              ← Back to Home
            </NavLink>
          </div>
        </div>
      </div>

      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-800">
        © 2025 ChatVerse. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
