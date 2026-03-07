import { createContext, useContext, useEffect, useState } from 'react'

interface CursorFollowerContextProp {
  start: boolean
  scaling: boolean
  click: boolean
  circle: { x: number; y: number }
}

const CursorFollowerContext = createContext<CursorFollowerContextProp>({
  start: false,
  scaling: false,
  click: false,
  circle: { x: 0, y: 0 },
})

export const CursorFollowerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [start, setStart] = useState(false)
  const [scaling, setScaling] = useState(false)
  const [click, setClick] = useState(false)
  const [circle, setCircle] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const mousemove = (e: MouseEvent) => {
      setStart(true)
      setCircle({ x: e.clientX, y: e.clientY })
      setScaling(!!(e.target as HTMLElement)?.closest('a') || !!(e.target as HTMLElement)?.closest('button'))
    }

    const onClick = () => {
      if (!click) {
        setClick(true)
        setTimeout(() => {
          setClick(false)
        }, 100)
      }
    }

    window.addEventListener('mousemove', mousemove)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('click', onClick)
    }
  }, [click])

  return (
    <CursorFollowerContext.Provider
      value={{
        start,
        scaling,
        click,
        circle,
      }}
    >
      {children}
    </CursorFollowerContext.Provider>
  )
}

export const useCursorFollower = () => useContext(CursorFollowerContext)
