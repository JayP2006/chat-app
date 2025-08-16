import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Send, Search, LogOut, ChevronLeft } from 'lucide-react';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Socket } from 'socket.io-client';
import { useSocketContext } from '../Context/SocketContext';
import notify from '../assets/sound/sound.wav'

const ChatHomePage = () => {
  const { authUser, setAuthUser } = useAuth();
  const {socket} =useSocketContext();
  const navigate = useNavigate();
  const [searchInput, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [latestmessage,setlatestmessage] = useState('')
  const chatEndRef = useRef(null);

  const currentUser = {
    name: authUser?.fullname,
    avatar: authUser?.profilepic || `https://i.pravatar.cc/150?u=${authUser?._id}`,
    id: authUser?._id,
  };

  useEffect(()=>{
      socket?.on("newMessage",(newMessage)=>{
        const sound=new Audio(notify)
        sound.play();
        setMessages([...messages,newMessage])
      })
      return ()=>socket?.off("newMessage")
  },[socket,setMessages,messages])
const profilesend=()=>{
  setLoading(true)
  try {
      navigate('/profile');
  } catch (error) {
    console.log(error.message);
  }
}
  useEffect(() => {
    const savedSelectedUser = JSON.parse(localStorage.getItem('selectedUser'));
    const savedMessages = JSON.parse(localStorage.getItem('messages'));
  
    if (
      savedSelectedUser &&
      Array.isArray(savedMessages) &&
      savedSelectedUser._id !== authUser._id // Avoid restoring if current user is same as previous selected
    ) {
      setSelectedUser(savedSelectedUser);
      setMessages(savedMessages);
    } else {
      // Clear old data
      localStorage.removeItem('selectedUser');
      localStorage.removeItem('messages');
    }
  }, [authUser]);
  

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://chatobi-backend.onrender.com/api/user/currentchatters?currentchatters=${authUser._id}`
        );
        setChatUser(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    chatUserHandler();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://chatobi-backend.onrender.com/api/message/${selectedUser?._id}?user=${authUser._id}`
        );
        const data = response.data;
        if (data.success === false) {
          console.log("Error fetching messages:", data.message);
        } else {
          // ✅ FIX: Always set an array to messages
          setMessages(Array.isArray(data.messages) ? data.messages : []);
        }
      } catch (error) {
        console.log("Fetch messages error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedUser?._id) getMessages();
  }, [selectedUser?._id]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://chatobi-backend.onrender.com/api/user/search?search=${searchInput}`
      );
      if (data.length === 0) {
        toast.info("User not found");
        setSearchUser([]);
      } else {
        setSearchUser(data);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      setlatestmessage(newMessage)
      const msgPayload = { message: newMessage };
      const { data } = await axios.post(
        `https://chatobi-backend.onrender.com/api/message/send/${selectedUser._id}?user=${authUser._id}`,
        msgPayload
      );

      const msgToDisplay = {
        message: data.message,
        senderid: data.senderid,
        receiverid: data.receiverid,
        createdAt: data.createdAt,
      };

      setMessages((prev) => [...prev, msgToDisplay]);
      setNewMessage('');
    } catch (err) {
      console.error('Send Error:', err);
    }
  };

  const handleLogout = async () => {
    const confirm = window.prompt("Type username to LOGOUT");
    if (confirm === authUser.username) {
      try {
        const { data } = await axios.post(`https://chatobi-backend.onrender.com/api/auth/logout`);
        toast.success(data.message);
        localStorage.removeItem('chatapp');
        setAuthUser(null);
        navigate('/login');
      } catch (err) {
        toast.error("Logout failed");
      }
    } else {
      toast.info("Logout cancelled");
    }
  };

  const handleBackToSidebar = () => setSelectedUser(null);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white border-r w-full md:w-80 flex-shrink-0 flex-col transition-all duration-300 ease-in-out ${
        selectedUser ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Search */}
        <div className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-400"
              />
            </div>
            <button type="submit" className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-2">
  {loading ? (
    <p className="text-center text-gray-400 mt-4">Loading...</p>
  ) : searchUser.length > 0 ? (
    <>
      <p className="text-sm font-semibold px-2 py-2 text-purple-600">Search Results</p>
      {searchUser.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-100 border-b border-gray-200"
        >
          <img
            src={user.profilepic || `https://i.pravatar.cc/150?u=${user._id}`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-medium text-black text-sm">{user.username}</h4>
            <p className="text-xs text-black">{user.gender}</p>
          </div>
        </div>
      ))}
    </>
  ) : chatUser.length > 0 ? (
    <>
      <p className="text-sm font-semibold px-2 py-2 text-purple-600">Recent Chats</p>
      {chatUser.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-100 border-b border-gray-200"
        >
          <img
            src={user.profilepic || `https://i.pravatar.cc/150?u=${user._id}`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-medium text-black text-sm">{user.username}</h4>
            <p className="text-xs text-gray-500 truncate">Say Hello 🙋‍♂️</p>
          </div>
        </div>
      ))}
    </>
  ) : (
    <div className="text-center text-gray-500 mt-10 text-lg">😢 Why are you alone?</div>
  )}
</div>


        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t">
          <div className="flex gap-3 items-center">
            <img onClick={profilesend} src={authUser?.profilepic} alt="avatar" className="w-10 h-10 rounded-full" />
            <div className="flex flex-col">
              <h4 className="font-bold text-blue-500 text-sm">{authUser?.fullname}</h4>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center gap-3 shadow">
              <button
                className="md:hidden mr-2 text-gray-600 hover:text-purple-600"
                onClick={handleBackToSidebar}
              >
                <ChevronLeft size={24} />
              </button>
              <img
                src={selectedUser.profilepic || `https://i.pravatar.cc/150?u=${selectedUser._id}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-lg text-black">{selectedUser.username}</h4>
                <p className="text-xs text-gray-500">Name: {selectedUser.fullname}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
            {Array.isArray(messages) && messages.map((msg, index) => {
  const isCurrentUser = msg.senderid === authUser._id;

  return (
    <div
      key={index}
      className={`flex w-full my-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <img
          src={isCurrentUser ? authUser.profilepic : selectedUser.profilepic}
          alt="avatar"
          className="w-8 h-8 rounded-full mx-2"
        />
        <div
          className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl text-sm shadow-md ${
            isCurrentUser
              ? 'bg-blue-600 text-white rounded-br-none ml-2'
              : 'bg-gray-200 text-gray-900 rounded-bl-none mr-2'
          }`}
        >
          <p>{msg.message}</p>
          <span
  className={`inline-block text-[11px] font-medium mt-1 px-2 py-[2px] rounded-full ${
    isCurrentUser
      ? 'bg-white/20 text-white/80 text-right self-end'
      : 'bg-gray-300 text-gray-700 text-left self-start'
  }`}
>
  {(() => {
    const date = new Date(msg.createdAt);
    if (isNaN(date)) return 'Invalid Time';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return `${day}/${month}/${year} · ${time}`;
  })()}
</span>
        </div>
      </div>
    </div>
  );
})}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Select a user to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHomePage;
