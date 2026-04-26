import React from 'react'
import { Outlet } from 'react-router-dom'
function generate() {
  return (
    <div className='flex flex-col'>
      <Outlet/>
    </div>
  )
}

export default generate
