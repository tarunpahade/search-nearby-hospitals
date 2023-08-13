'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';


export default function VerifyEmail() {

    const [token, settoken] = useState('')
    const [password, setpassword] = useState(false)
    const [confirmpassword, setconfirmpassword] = useState(false)
    
    const [error, seterror] = useState(false)


    const changePassword = async (e: any) => {
        console.log(password, confirmpassword);

        e.preventDefault()
        if (password === confirmpassword) {


            try {
                const res = await axios.post('/api/users/resetpassword', { token, password })
                console.log(res);
                if (res.data.error === 'Token Expired') {
                    seterror(true)
                }
                else if (res.data.message === 'Password changed successfully') {
                    alert('Password changed successfully')
                    window.location.href = '/login'

                }
            } catch (error: any) {
                console.log(error.response.data);

            }
        } else {
            seterror(true)
        }
    }

    useEffect(() => {

        const urlToken = window.location.search.split('=')[1];
        console.log('url ', urlToken);
        settoken(urlToken)

    }, [])




    return (

        <div className="flex column-1 justify-center items-center h-screen" style={{ flexDirection: 'column' }}>
            <h1 className='text-4xl'>Reset Pssword </h1>
            <form action="">
                {error && <h2 className='p-2 '>Password Does Not Match</h2>}
                <input type="text" onChange={(e: any) => setpassword(e.target.value)} placeholder='Enter New Password' className='p-2 m-2 text-black' />
                <input type="text" onChange={(e: any) => setconfirmpassword(e.target.value)} placeholder='Retype Password' className='p-2 m-2 text-black' />
                <button onClick={changePassword}       style={{
                padding: 10,
                borderWidth: 1,
                paddingRight: 15,
                paddingLeft: 15,
                margin: 5,
                borderRadius: 12,
                alignContent: "center",
              }}>Submit</button>
                {<p  className="border border-red-500 p-2 mt-4">Session Expired</p>}
            </form>

        </div>
    )

}