'use client'

import { cn } from '@/lib/utils'
import React, { createContext, useContext, useRef, useState } from 'react'

type CardContextType = {
  cardRef: React.RefObject<HTMLDivElement>
}

const CardContext = createContext<CardContextType | null>(null)

export const CardContainer = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <CardContext.Provider value={{ cardRef }}>
      <div
        ref={cardRef}
        className={cn('group/card', className)}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </CardContext.Provider>
  )
}

export const CardBody = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const context = useContext(CardContext)
  if (!context) throw new Error('CardBody must be used within CardContainer')

  const { cardRef } = context
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`
    )
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)')
  }

  return (
    <div
      className={cn('transition-transform duration-200 ease-out', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
      }}
    >
      {children}
    </div>
  )
}

export const CardItem = ({
  as: Component = 'div',
  translateZ = 0,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
  className,
  children,
  ...props
}: {
  as?: React.ElementType
  translateZ?: number | string
  translateX?: number | string
  translateY?: number | string
  rotateX?: number | string
  rotateY?: number | string
  className?: string
  children: React.ReactNode
  [key: string]: any
}) => {
  const formatValue = (val: number | string, unit: string) => {
    if (typeof val === 'string') {
      // If it's already a string with units, use it as-is
      return val
    }
    return `${val}${unit}`
  }

  return (
    <Component
      className={className}
      style={{
        transform: `translateZ(${formatValue(translateZ, 'px')}) translateX(${formatValue(translateX, 'px')}) translateY(${formatValue(translateY, 'px')}) rotateX(${formatValue(rotateX, 'deg')}) rotateY(${formatValue(rotateY, 'deg')})`,
      }}
      {...props}
    >
      {children}
    </Component>
  )
}

