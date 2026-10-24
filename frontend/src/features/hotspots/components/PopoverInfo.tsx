import { useState, useRef, useEffect } from 'react'
import { Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PopoverInfoProps {
  title: string
  content: string
  label?: string
  className?: string
}

export function PopoverInfo({ title, content, label = 'Buka informasi bantuan', className }: PopoverInfoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={cn('relative inline-flex items-center', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={label}
        aria-expanded={isOpen}
        className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full text-neutral-400 hover:text-neutral-700 active:text-neutral-900 inline-flex items-center justify-center focus-ring cursor-pointer transition-colors"
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-72 max-w-[calc(100vw-32px)] bg-white rounded-2xl p-4 shadow-xl border border-neutral-200/90 text-left animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-accent-900 font-bold text-sm">
              <Info className="w-4 h-4 text-accent-800 shrink-0" />
              <span>{title}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup informasi bantuan"
              className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 cursor-pointer focus-ring"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-normal">{content}</p>
        </div>
      )}
    </div>
  )
}
