import React from 'react'
import loadingIcon from '@/assets/images/loading.svg'

const Loading = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0z-50 flex justify-center items-center">
      <img src={loadingIcon} alt="Loading" width={100}/>
    </div>
  )
}

export default Loading;