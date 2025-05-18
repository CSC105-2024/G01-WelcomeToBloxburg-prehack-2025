import React from 'react'
import { useState } from 'react'
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
function Register() {
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [name , setName ]= useState("");
    const [password,setPassword] = useState("");
    const [hidePassword,setHidePassword] = useState(true)
    
  return (

    <div className='flex justify-center items-center font-nunito h-[90vh]'>
      <div className='border-1 rounded-xl flex flex-col items-center p-12 w-2xl space-y-3'>
        <h1 className='text-4xl'>Sign up</h1>
        <div>
            <p>Email</p>
            <input type="text" placeholder='Email' className='p-2 rounded-xl min-w-sm' value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
            <p>Username</p>
            <input type="text" placeholder='Username' className='p-2 rounded-xl min-w-sm'value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div>
            <p>Name</p>
            <input type="text" placeholder='Name' className='p-2 rounded-xl min-w-sm'value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className='relative'>
            <p>Password</p>
            <input type={hidePassword ? "password" : "text"} placeholder='Password' className='p-2 rounded-xl min-w-sm'value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className='absolute top-8 right-5' onClick={() => setHidePassword(!hidePassword)}>{hidePassword ? <IoIosEyeOff className='text-2xl'/> : <IoIosEye className='text-2xl'/> }</button>
        </div>
        <div className=''>
            <p>Date of Birth</p>
            <input type='date'  className='p-2 rounded-xl w-sm'  />
        </div>
        <div className='w-sm'>
            <p>Gender</p>
            <select name="gender"  className='p-2 rounded-xl border-1 '>
                <option value="m">Male</option>
                <option value="f">Female</option>
                <option value="lgbtq">LGBTQ+</option>
                <option value="no">Prefer not to say</option>
            </select>
        </div>
        <button className='bg-myPrimary py-2 px-4 text-white rounded-2xl w-sm mt-6 duration-300 hover:border-1 hover:border-myPrimary hover:bg-white hover:text-myPrimary'>Sign Up</button>
        <p className='text-sm'>Already have an account? <span className='text-myPrimary cursor-pointer'>Login</span></p>
      </div>
    </div>
  )
}

export default Register
