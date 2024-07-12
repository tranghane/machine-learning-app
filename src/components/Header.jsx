import React from 'react'

export default function Header() {
  return (
    <header className='flex items-center p-4 justify-between gap-4'>
    <h1 className='font-medium'><span>Sugoi</span><span className='text-blue-400'>Speech</span><span className='text-purple-500'>Scribe</span></h1>
    <button className='flex items-center gap-2 specialBtn text-sm
                        px-3 py-2 rounded-lg text-blue-400'>
      <p>New</p>
      <i className="fa-solid fa-plus"></i>
    </button>

  </header>
  )
}
