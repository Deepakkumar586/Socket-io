import React from 'react'
import { useEffect } from 'react'
import {io} from 'socket.io-client'

const App = () => {
  const socket = io('http://localhost:2000')
  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected",socket.id)
    })
  },[])
  return (
    <div>
      App
    </div>
  )
}

export default App
