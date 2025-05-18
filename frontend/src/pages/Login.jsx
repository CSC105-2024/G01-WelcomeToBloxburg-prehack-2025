import React from 'react'
import { useState } from 'react'
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import axios from 'axios';
function Login() {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [hidePassword,setHidePassword] = useState(true);
    const handleSubmit = async () => {
      try{
        const data = {
          email : email,
          password: password
        }
        const res = await axios.post("http://localhost:4002/user/api/login",data,{withCredentials: true})
        console.log(res.data);
        localStorage.setItem('token',res.data.token)
        window.location.href = "/dashboard"
        
      }
      catch(err){
        console.log(err);
        window.location.reload();
      }
    }
  return (
    <div className='flex justify-center items-center font-nunito h-[90vh]'>
      <div className='border-1 rounded-xl flex flex-col items-center p-12 w-2xl space-y-3'>
        <h1 className='text-4xl'>Login</h1>
        <div>
            <p>Email</p>
            <input type="text" placeholder='Email' className='p-2 rounded-xl min-w-sm' value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className='relative'>
            <p>Password</p>
            <input type={hidePassword ? "password" : "text"} placeholder='Password' className='p-2 rounded-xl min-w-sm' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className='absolute top-8 right-5' onClick={() => setHidePassword(!hidePassword)}>{hidePassword ? <IoIosEyeOff className='text-2xl'/> : <IoIosEye className='text-2xl'/> }</button>
        </div>
        
        <button className='bg-myPrimary py-2 px-4 text-white rounded-2xl w-sm mt-6 duration-300 hover:border-1 hover:border-myPrimary hover:bg-white hover:text-myPrimary' onClick={handleSubmit}>Login</button>
        <p className='text-sm'>Don't have an account? <span className='text-myPrimary cursor-pointer' >Sign Up</span></p>
      </div>
    </div>
  )
}

export default Login
