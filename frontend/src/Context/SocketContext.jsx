import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineuser, Setonlineuser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      const socketInstance = io("https://chat-karo-rg16.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });

      socketInstance.on("getonlineusers", (users) => {
        Setonlineuser(users);
      });

      setSocket(socketInstance);

      return () => socketInstance.close(); // close on unmount
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineuser }}>
      {children}
    </SocketContext.Provider>
  );
};
