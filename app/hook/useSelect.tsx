import { useCallback, useEffect, useRef, useState } from 'react'

import useOnClickOutside from '~/hook/useOnClickOutside'
import { useMyLayoutEffect } from '~/routes/test2'

export function useSelect<T>(
  onChange: (value: T) => void = () => {},
  defaultValue: T | null = null,
) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<T | null>(defaultValue)
  const [scrollTop, setScrollTop] = useState(0)
  const rootRef = useRef<HTMLElement | null>(null)
  const inputRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map())
  const itemIndexMapRef = useRef<Map<T, number>>(new Map())
  const indexItemMapRef = useRef<Map<number, T>>(new Map())
  const menuRef = useRef<HTMLElement | null>(null)

  const toggle = useCallback(() => {
    if (menuRef.current) {
      setScrollTop(menuRef.current.scrollTop)
    }
    setIsOpen((prev) => !prev)
  }, [])

  useMyLayoutEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.scrollTop = scrollTop
    }
  }, [isOpen])

  const itemRefHandler = useCallback(
    (idx: number, item: T) => (ref: HTMLElement | null) => {
      if (ref) {
        itemRefs.current.set(idx, ref)
        itemIndexMapRef.current.set(item, idx)
        indexItemMapRef.current.set(idx, item)

        const clickHandler = () => {
          onChange(item)
          setSelected(item)
          toggle()
        }

        ref.addEventListener('click', clickHandler)

        return () => {
          ref.removeEventListener('click', clickHandler)
        }
      } else {
        itemRefs.current.delete(idx)
        itemIndexMapRef.current.delete(item)
        indexItemMapRef.current.delete(idx)
      }
    },
    [onChange, toggle],
  )

  const menuRefHandler = useCallback((ref: HTMLElement | null) => {
    menuRef.current = ref

    if (ref) {
      ref.addEventListener('mousedown', (e) => e.preventDefault())
    }
  }, [])

  const rootRefHandler = useCallback((ref: HTMLElement | null) => {
    rootRef.current = ref
  }, [])

  const inputRefHandler = useCallback((ref: HTMLElement | null) => {
    inputRef.current = ref
  }, [])

  const outsideClickHandler = useCallback(
    (_: MouseEvent | TouchEvent) => {
      if (isOpen) {
        toggle()
      }
    },
    [isOpen, toggle],
  )

  useOnClickOutside(rootRef, outsideClickHandler)

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const input = inputRef.current

    const clickHandler = (e: MouseEvent) => {
      toggle()
    }

    input.addEventListener('click', clickHandler)

    return () => {
      input.removeEventListener('click', clickHandler)
    }
  }, [toggle])

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const input = inputRef.current

    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggle()
      }

      if (e.key === 'Escape' && isOpen) {
        toggle()
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (selected) {
          const idx = itemIndexMapRef.current.get(selected)!
          const next = indexItemMapRef.current.get(idx + 1)

          if (next) {
            onChange(next)
            setSelected(next)
          } else {
            onChange(indexItemMapRef.current.get(0)!)
            setSelected(indexItemMapRef.current.get(0)!)
          }
        } else {
          onChange(indexItemMapRef.current.get(0)!)
          setSelected(indexItemMapRef.current.get(0)!)
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()

        if (selected) {
          const idx = itemIndexMapRef.current.get(selected)!
          const next = indexItemMapRef.current.get(idx - 1)

          if (next) {
            onChange(next)
            setSelected(next)
          } else {
            onChange(
              indexItemMapRef.current.get(indexItemMapRef.current.size - 1)!,
            )
            setSelected(
              indexItemMapRef.current.get(indexItemMapRef.current.size - 1)!,
            )
          }
        } else {
          onChange(
            indexItemMapRef.current.get(indexItemMapRef.current.size - 1)!,
          )
          setSelected(
            indexItemMapRef.current.get(indexItemMapRef.current.size - 1)!,
          )
        }
      }
    }

    input.addEventListener('keydown', keydownHandler)

    return () => {
      input.removeEventListener('keydown', keydownHandler)
    }
  }, [isOpen, onChange, selected, toggle])

  useMyLayoutEffect(() => {
    if (!selected || !menuRef.current) return

    const menuEl = menuRef.current
    const targetEl = itemRefs.current.get(
      itemIndexMapRef.current.get(selected)!,
    )!

    const { top: boundingTop, bottom: boundingBottom } =
      menuEl.getBoundingClientRect()
    const { top: targetTop, bottom: targetBottom } =
      targetEl.getBoundingClientRect()
    const styles = window.getComputedStyle(menuEl)
    const borderTop = parseInt(styles.borderTopWidth, 10)
    const borderBottom = parseInt(styles.borderBottomWidth, 10)

    if (targetTop < boundingTop + borderTop) {
      menuEl.scrollTop -= boundingTop - targetTop + borderTop
    } else if (targetBottom > boundingBottom - borderBottom) {
      menuEl.scrollTop += targetBottom - boundingBottom + borderBottom
    }
  }, [selected])

  return {
    isOpen,
    selected,
    setSelected,
    rootRefHandler,
    itemRefHandler,
    menuRefHandler,
    inputRefHandler,
  }
}
