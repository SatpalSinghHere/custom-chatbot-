'use client'

import Navbar from '@/components/ui/Navbar'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { PulseLoader } from 'react-spinners'

type MessageType = {
  role: 'user' | 'assistant' | 'system',
  content: string,
  images: string[] | null
}

const spinLoaderCSS: CSSProperties = {
  display: "block",
  margin: " auto",
  borderColor: "red",
};

function Page() {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([
    { role: "assistant", content: "Hello! I'm the customer service chatbot for ABC Lighting Corp, your go-to provider for innovative, energy-efficient solar lighting solutions. We specialize in outdoor lighting for residential and commercial spaces.  \nIs there anything else I can help you with?", images: null }
  ])

  function submitText() {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text, images: null }])

    fetch('http://localhost:3001?prompt=' + encodeURIComponent(text))
      .then(res => res.json())
      .then(data => {
        console.log(data)

        // let images: string[] | null = null
        // let content = data.content
        // let parts = content.split('_ _ _ _ _')

        // if (parts.length > 1) {
        //   images = parts.slice(0, -1) // all parts except last
        //   content = parts[parts.length - 1] // last part is the actual text
        // }

        setMessages(prev => [...prev, data])
      })
      .catch(err => console.error(err))

    setText('')
  }

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <div className='flex flex-col items-center'>
      <Navbar />
      <div className='w-[70vw] h-[75vh] flex flex-col overflow-y-auto duration-500' ref={chatContainerRef}>
        {messages.map((item, index) => {
          console.log('images',item.images)
          return (<div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'} mt-2`}>
            {item.role !== 'user' && <span className='mr-2'>🤖</span>}
            <div className={`p-2 rounded-lg max-w-[85%] whitespace-pre-wrap ${item.role === 'user' ? 'bg-lime-300' : 'bg-lime-950 text-white'}`}>
              {item.images && item.images.map((url, imgIndex) => (
                <img key={imgIndex} src={url} alt="Generated" className='mt-2 rounded-lg' />
              ))}
              <h2>{item.content}</h2>
            </div>
          </div>
          )
        })}
        {messages[messages.length-1].role === 'user' && <div className='p-2 flex'>🤖<PulseLoader color='black' /></div>}
      </div>
      <div className='w-[70vw] h-[15vh] flex items-center'>
        <input
          onKeyDown={(e)=>{if(e.key === 'Enter')submitText()}}
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          placeholder='Ask here'
          className='w-[90%] rounded-full h-[10vh] p-4 bg-black outline-white text-white'
        />
        <div
          onClick={submitText}
          className='w-[10%] h-[10vh] rounded-full bg-black flex justify-center items-center text-2xl hover:cursor-pointer hover:scale-110 hover:opacity-90 duration-200'
        >
          🔺
        </div>
      </div>
    </div>
  )
}

export default Page
