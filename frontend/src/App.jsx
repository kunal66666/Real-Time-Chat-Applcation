import { Toaster } from "react-hot-toast";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/Signup";
import {Navigate, Route,Routes} from 'react-router-dom';
import { useAuthContext } from "./context/AuthContext";
export default function App() {
  const {authUser}= useAuthContext();
  return (


   <div className="p-4 h-screen flex items-center justify-center">

   <Routes>
   <Route path='/' element={authUser ? < Home />: <Navigate to={"/Login"} />}/>
   <Route path='/login' element={authUser ? <Navigate to="/" />:<Login />}/>
   <Route path='/signup' element={authUser ? <Navigate to="/" />:<SignUp />}/>


   </Routes>
   <Toaster/>
   </div>
  );
}
