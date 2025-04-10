'use client'
import Navbar from '@/components/ui/Navbar'
import React, { useEffect, useRef, useState } from 'react'

function page() {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([
    { 'role': "user", 'content': "What is your name? SJXkjsx KJS CKjas kJACS kjasKJA hat.Msc KSLC Lskc lKSC Lskc lksc" },
    { 'role': "assistant", 'content': "My name is this and that.Msc KSLC Lskc lKSC Lskc lksc hat.Msc KSLC Lskc lKSC Lskc lksc" }
  ])

  function submitText() {
    setMessages((prev) => [...prev, { 'role': 'user', 'content': text }])
    fetch('http://localhost:3001?prompt=' + encodeURIComponent(text))
      .then(res => {
        return res.json()
      })
      .then((data => {
        console.log(data)
        setMessages((prev) => [...prev, data])
      }))

    setText('')
  }

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth', // 👈 makes it scroll slowly
    })
  }, [messages]); // whenever messages change, scroll to bottom


  return (
    <div className='flex flex-col items-center'>
      <Navbar />
      <div className='w-[70vw] h-[75vh] flex flex-col overflow-y-auto duration-500' ref={chatContainerRef}>
        {messages.map((item, index) => {
          if (item.role == 'user') {
            return <div key={index} className=' flex justify-end mt-2'><div className='p-2 bg-lime-300 rounded-lg max-w-[85%]'><h2>{item.content}</h2></div></div>
          }
          else {
            return <div key={index} className='flex justify-start mt-2'>🤖<div className='p-2 bg-lime-950 text-white rounded-lg max-w-[85%] whitespace-pre-wrap'><h2>{item.content}</h2></div></div>
          }
        })}
      </div>
      <div className='w-[70vw] h-[15vh] flex items-center'>
        <input onChange={(e) => { setText(e.target.value) }} value={text} type="text" placeholder='Ask here' className='w-[90%] rounded-full h-[10vh] p-4 bg-black outline-white text-white' />
        <div onClick={submitText} className='w-[10%] h-[10vh] rounded-full bg-black flex justify-center items-center text-2xl hover:cursor-pointer hover:scale-110 hover:opacity-90 duration-200'>🔺</div>
      </div>
    </div>
  )
}

export default page
