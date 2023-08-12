
import React from 'react'

export default function UserProfilePage({params}: any) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        
    <div className='text-4xl'>Profile page <span className='bg-orange-600 p-2'>{params.id}</span> </div>
  
    </div>
  )
}
