import Login from "./login/login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {Route,Routes} from 'react-router-dom'
import Register from "./register/register";
import Home from "./Home/Home";
import Dashboard from "./Dashboard/Dashboard";
import { VerifyUser } from "./utils/VerifyUser";
import Profile from "./Profile/Profile";

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route element={<VerifyUser/>}>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        
        </Route>

      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}

export default App
