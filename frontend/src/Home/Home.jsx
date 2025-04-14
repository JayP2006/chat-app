import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";

// Reusable Button
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`rounded-xl px-5 py-2 font-semibold transition duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-4 py-3 flex justify-between items-center shadow-md bg-opacity-20 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="text-yellow-400" />
          ChatVerse
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4">
          <Link to="/login">
            <Button className="border border-white hover:bg-white hover:text-black">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full flex flex-col items-center gap-4 bg-black bg-opacity-90 p-6 md:hidden">
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full border border-white hover:bg-white hover:text-black">
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300">
                Register
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-8 py-16"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Connect. Chat. Collaborate.
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-10 max-w-xl text-gray-300">
          Welcome to ChatVerse – your space to connect with friends, collaborate with peers,
          and enjoy seamless communication in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login">
            <Button className="bg-white text-black hover:bg-gray-200 px-6 py-2 text-base sm:text-lg w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link to="/register">
            <Button className="border border-white text-white hover:bg-white hover:text-black px-6 py-2 text-base sm:text-lg w-full sm:w-auto">
              Join Now
            </Button>
          </Link>
        </div>
      </motion.section>

     
      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-800">
        © 2025 ChatVerse. Chat with anyone you want ,Buit by Patel Jay R contactUs-jay91451@gmail.com.
      </footer>
    </div>
  );
}
