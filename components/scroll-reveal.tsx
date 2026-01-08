"use client"

import { useEffect } from 'react'

export function ScrollReveal() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        }

        const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible')
                    // observer.unobserve(entry.target) // optional: keep observing if you want reveal on every scroll
                }
            })
        }

        const observer = new IntersectionObserver(handleIntersect, observerOptions)

        // Select common elements to reveal
        const revealElements = document.querySelectorAll(
            '.prose h2, .prose h3, .prose p, .prose pre, .prose blockquote, .prose figure, .prose table, .prose .my-8'
        )

        revealElements.forEach((el) => {
            el.classList.add('reveal-on-scroll')
            observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return null
}
