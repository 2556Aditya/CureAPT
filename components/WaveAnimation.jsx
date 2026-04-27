// components/WaveAnimation.jsx
'use client'
import React from 'react'

export const WaveAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="waves-container">
        <div className="wave-wrapper">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      </div>
    </div>
  )
}