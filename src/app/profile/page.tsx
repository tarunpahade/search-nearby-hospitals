'use client'
import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export default function ProfilePage() {
  const [data, setData] = React.useState('nothing');
  const router = useRouter();
  const logout = async () => {
    try {
      const res = await axios.get('/api/users/logout')
      console.log(res);
      router.push('/login')
    } catch (error: any) {
      console.log(error.message);

    }
  }
  const getUserDetails = async () => {
 const res=await axios.get('/api/users/me')
  console.log(res.data.data.isVerified);
  setData(res.data.data.username)

  
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
      <h1>Profile   </h1>
      <span>      ,</span>
      <h2>{data==='nothing' ? " , No data  ": <Link href={`/profile/${data}`}> {data} </Link>}</h2>
      <button onClick={logout} style={{ padding: 10, borderWidth: 1, paddingRight: 15, paddingLeft: 15, margin: 5, borderRadius: 12, alignContent: 'center' }}
      >Logout</button>
       <button onClick={getUserDetails} style={{ padding: 10, borderWidth: 1, paddingRight: 15, paddingLeft: 15, margin: 5, borderRadius: 12, alignContent: 'center' }}
      >Get user Details</button>
      
    </div>
  )
}
