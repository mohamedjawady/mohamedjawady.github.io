"use client"
import React, { useState, useEffect } from "react"

const TITLES = [
  "0xHabib",
  "Mohamed Habib Jaouadi"
]

export function AnimatedTypewriter() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Typing speed: 100ms per character
  // Deleting speed: 50ms per character
  // Pause after finishing typing: 3000ms
  // Pause after deleting: 500ms

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const fullText = TITLES[currentTitleIndex]

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false)
        setCurrentTitleIndex((prev) => (prev + 1) % TITLES.length)
        timeout = setTimeout(() => {}, 500)
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1))
        }, 50)
      }
    } else {
      if (currentText === fullText) {
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 3000)
      } else {
        timeout = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1))
        }, 100)
      }
    }

    return () => clearTimeout(timeout)
  }, [currentText, currentTitleIndex, isDeleting])

  return (
    <span className="text-emerald-500 relative inline-block whitespace-nowrap min-w-[300px]">
      {currentText}
      <span className="animate-pulse ml-1 border-r-4 border-emerald-500 h-full"></span>
      <div className="absolute inset-0 bg-emerald-500/20 blur-2xl -z-10 rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '3s' }}></div>
    </span>
  )
}
