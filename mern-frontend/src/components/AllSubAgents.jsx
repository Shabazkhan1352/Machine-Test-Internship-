import React, { useState } from 'react'
import AgentCard from './AgentCard'
import SubAgentCard from './SubAgentCard'
import Navbar from './Navbar'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

const AllSubAgents = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    return (
        <>
        {isAuthenticated ? <div className=' flex flex-col bg-gray-100 min-h-screen'>
            <Navbar />
            <SubAgentCard  role = "subagent"/>
        </div > : <div className='flex flex-col gap-5 justify-center items-center min-h-[100vh]'>
                <h1 className='font-bold '>Please Login to View the Page </h1>
                <button onClick={() => {
                    navigate('/')
                }
                } className="w-[5%] py-2 mt-2 bg-black text-white font-semibold rounded-md hover:bg-gray-200 transition cursor-pointer" >Login</button>
            </div> }
        
        </>
    )
}

export default AllSubAgents