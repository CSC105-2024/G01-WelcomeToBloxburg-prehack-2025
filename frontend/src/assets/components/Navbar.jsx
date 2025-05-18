import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DropdownAvatar } from './DropdownAvatar';
function Navbar() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4002/user/api/logout", {}, { withCredentials: true });
      localStorage.removeItem('token');
      window.location.href = "/login";
    } catch (error) {
      console.log(error.message);

    }
  }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4002/user/api/profile", { withCredentials: true })
        setUser(res.data.user.user)

      }
      catch (err) {
        console.error(err);

      }
    }
    fetchUser();
  }, [])
  return (
    <div className='w-full bg-white h-[65px] flex justify-around px-4 font-nunito items-center shadow-md'>
      <div className="flex items-center">
        <h1 className='md:mr-10 mr-50 text-3xl flex flex-nowrap cursor-pointer duration-300 hover:scale-110 active:scale-100'onClick={() => window.location.href = "/dashboard"}>
          <span className=''>🚏</span> 
          <span className='hidden md:inline'>Here</span>
          <span className='hidden md:inline text-myPrimary'>We</span>
          <span className='hidden md:inline text-yellow-500'>Go</span>
        </h1>
      </div>
      <div className='space-x-2 flex flex-nowrap'>
        {!user && (<button className='px-8 py-2 border-1 border-myPrimary rounded-2xl duration-300 hover:bg-myPrimary hover:text-white hover:border-white active:bg-[#02569E]' onClick={() => window.location.href = "/login"}>Login</button>)}
        {!user && (<button className='px-6 py-2 border-1 text-white bg-myPrimary rounded-2xl duration-300 hover:bg-[#02569E] active:bg-myPrimary' onClick={() => window.location.href = "/register"}>Sign Up</button>)}
        {user && (<DropdownAvatar id={user.id} />)}
      </div>
    </div>
  )
}

export default Navbar
