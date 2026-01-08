"use client"

import React, { useState, useEffect } from 'react'

export function ReadingProgressBar() {
    const [completion, setCompletion] = useState(0)

    useEffect(() => {
        const updateScrollCompletion = () => {
            const currentProgress = window.scrollY
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            if (scrollHeight) {
                setCompletion(
                    Number((currentProgress / scrollHeight).toFixed(2)) * 100
                )
            }
        }

        window.addEventListener('scroll', updateScrollCompletion)
        return () => window.removeEventListener('scroll', updateScrollCompletion)
    }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-150 ease-out"
                style={{ width: `${completion}%` }}
            />
        </div>
    )
}
