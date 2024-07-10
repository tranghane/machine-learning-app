import React from 'react'

export default function FileDisplay(props) {
    const {handleAudioReset, file, audioStream} = props;
  return (
    //similar to HomePage.jsx but with a file display
    <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 md:gap-5
         justify-center text-center pb-20'>
            <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
            {/* <span>Sugoi</span><span className='text-blue-400'>Speech</span><span className='text-purple-500'>Scribe</span> */}
                                  <span className='text-blue-400'>Your</span><span className='text-purple-500'>File</span>
            </h1>
    </main>

  )
}
