'use client'
import { Input } from 'postcss'
import React, { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ChatInput({ chatPartner, chatId }) {

    const textareaRef = useRef<HTMLTextAreaElement | null >(null)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')

    const sendMessage = async ()=> {
        if(!input) return
        setIsLoading(true)

        try {
            await axios.post('/api/message/send', { text: input, chatId })
            setInput('')
            textareaRef.current?.focus()
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')            
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize ref={textareaRef} onKeyDown={(e)=> {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
            }
        }}
        rows={1}
        value={input}
        onChange={(e)=> setInput(e.target.value)}
        placeholder={`Message ${chatPartner.name}`}
        className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />

        <div onClick={() => textareaRef.current?.focus()} className="py-2" aria-hidden='true'>
            <div className="py-px">
                <div className="h-9"/>
            </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-shrink-0">
                <Button isLoading={isLoading} onClick={sendMessage} type='submit'>
                {
                !isLoading ? (
                <svg className='w-5 text-white' viewBox='0 0 2000 2000'>
                <path
                    fill='currentColor'
                    d='m1976.678 964.142-1921.534-852.468c-14.802-6.571-32.107-3.37-43.577 8.046-11.477 11.413-14.763 28.703-8.28 43.532l365.839 836.751-365.839 836.749c-6.483 14.831-3.197 32.119 8.28 43.532 7.508 7.467 17.511 11.417 27.677 11.417 5.37 0 10.785-1.103 15.9-3.371l1921.533-852.466c14.18-6.292 23.322-20.349 23.322-35.861.001-15.514-9.141-29.571-23.321-35.861zm-1861.042-739.791 1664.615 738.489h-1341.737zm321.069 816.954h1334.219l-1655.287 734.35z'
                    />
                </svg>): null
                }
                </Button>
            </div>
        </div>
        </div>
    </div>
  )
}
