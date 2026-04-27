// components/ScrollRevealText.jsx
'use client';
import React, { useCallback } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export const ScrollRevealText = ({ children, className }) => {
  const setRef = useScrollReveal();
  
  const textRef = useCallback(node => {
    if (node !== null) {
      setRef(node);
    }
  }, [setRef]);

  return (
    <div 
      ref={textRef}
      className={`will-change-transform opacity-100 ${className}`}
    >
      {children}
    </div>
  );
};