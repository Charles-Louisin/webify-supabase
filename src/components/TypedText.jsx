'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function TypedText({ text, className, speed = 0.05, delay = 0, onComplete }) {
  const elementRef = useRef(null);
  const textRef = useRef(text);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const chars = textRef.current.split('');
    element.textContent = '';
    
    // Timeline pour l'animation
    const tl = gsap.timeline({ 
      delay,
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
    
    // Animation pour chaque caractère
    chars.forEach((char, index) => {
      tl.add(() => {
        element.textContent += char;
      }, index * speed);
    });
    
    return () => {
      tl.kill();
    };
  }, [text, speed, delay, onComplete]);
  
  return <span ref={elementRef} className={className}></span>;
} 