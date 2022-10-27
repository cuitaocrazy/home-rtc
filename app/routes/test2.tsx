import type { FC } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { useState } from 'react'

// https://github.com/onesine/react-tailwindcss-select/blob/master/src/components/Select.tsx
interface Option {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  isDisabled?: boolean
  options?: Option[]
  value?: Option
  onChange: (value: Option | null) => void
}

const Select: FC<SelectProps> = ({
  isDisabled = false,
  options = [],
  value = null,
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const list = options.filter((option) =>
    'disabled' in option ? !option.disabled : true,
  )

  const toggle = useCallback(() => {
    if (!isDisabled) {
      setOpen((prev) => !prev)
    }
  }, [isDisabled])

  const closeDropDown = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeDropDown()
      }
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [closeDropDown])

  const onPressEnterOrSpace = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    },
    [toggle],
  )

  const handleValueChange = useCallback(
    (selected: Option) => {
      onChange(selected)
      closeDropDown()
    },
    [closeDropDown],
  )

  const clearValue = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange(null)
    },
    [onChange],
  )

  return (
    <div className="relative w-full">
      <div aria-expanded="true" aria-controls="ttt">
        <div>cuitao</div>
      </div>
      <div id="ttt">
        <div>ctk</div>
      </div>
    </div>
  )
}

export default function Test2() {
  return <Select onChange={() => {}} />
}
