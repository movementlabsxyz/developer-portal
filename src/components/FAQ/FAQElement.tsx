'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FAQElementProps {
    title: string
    children: React.ReactNode
}

export function FAQElement({ title, children }: FAQElementProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={cn('list__item', isOpen && 'active')}>
            <div className="list__title" onClick={() => setIsOpen(!isOpen)}>
                {title}
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="25" cy="25" r="24" stroke="currentColor" strokeWidth="2" />
                    <line x1="25" y1="15" x2="25" y2="35" stroke="currentColor" strokeWidth="2" />
                    <line x1="15" y1="25" x2="35" y2="25" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
            <div className="list__cont">
                {children}
            </div>
        </div>
    )
} 