"use client"
import Link from "next/link";
import React   from "react";
import { useRouter } from "next/navigation";
import axios  from 'axios';
import { useState,useEffect } from "react";
//import toast from "react-hot-toast";


export default function SignUpPage() {
  const router = useRouter();
 
  
  const [user, setuser] = useState({
    email: '',
    password: '',
    username: ''
  })
  const [buttonDisabled,setDisabled]=useState(true)
  const [loading,setLoading]=useState(false)
  const onSignup = async (e:any) => {
    e.preventDefault();
   console.log('yoyo');
   
    try {
      setLoading(true)
      console.log(user,'user');
    console.log('Hiiiiiiiiiiiii');
      //featch post request

      
       const res = await axios.post("api/users/signup", user);
      // console.log(res,'responste from signup');
       router.push('/login')
    } catch (error:any) {
      //toast.error(error.message)
      console.log('Sign Up Failed',error);
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {
  return () => {
    if(user.email.length > 0 && user.password.length > 0 ){
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }
  
}, [user])
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >

      <form  style={{ width: '200px' }}>
      <h1>{loading ? 'Loading ':'Sign Up' }</h1>
        <div style={{ display: "inline-block"}}>
          <label style={{padding:10}} className="label">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setuser({ ...user, email: e.target.value })
            
            }
            className="text-black"
            required
          />
        </div>
        <div>

          <label style={{padding:10}}>Username:</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setuser({ ...user, username: e.target.value })}
            className="text-black"
            required
          />
        </div>
        <label style={{padding:10}}>Password:</label>
        <div>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setuser({ ...user, password: e.target.value })}
            className="text-black"
            autoComplete="off"
            required
          />
        </div>
        <button type="submit" onClick={onSignup} style={{padding:10,borderWidth:1,paddingRight:15,paddingLeft:15,margin:5,borderRadius:12,alignContent:'center'}}
        
        >
        {buttonDisabled ? 'No sign up': 'Sign Up'}
        </button>
        <Link href="/login">Visit Login</Link>
      </form>
    </div >
  );
};

