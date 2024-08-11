'use client'
import clsx from 'clsx'
import React from 'react'

import { Inter } from 'next/font/google'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import TopHeader from '../header/TopHeader'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayout: React.FC<Props> = (props) => {
  // Define the component's logic and rendering here
  return (
    <div className={clsx(inter.className, 'bg-p-bg text-s-text ')}>
      <div className="absolute inset-0">
        <img
          src="/bg-image.jpeg"
          alt="bg-image"
          className="w-screen h-screen object-cover"
        />
      </div>

      <div className="relative z-10  bg-black/80 backdrop-opacity-100 backdrop-blur-3xl ">
        <div className="fixed top-0 left-0 right-0">
          <TopHeader />
        </div>
        <div className="overflow-auto w-screen h-screen no-scrollbar">
          <div className="flex flex-col items-center mt-16 ">
            <div className="w-full sm:w-[800px]">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UILayout
