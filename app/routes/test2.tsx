import type { FC } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { useState } from 'react'

import useSelectEvent from '~/hook/useSelectEvent'

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
  const rootRef = useRef<HTMLDivElement>(null)
  const forceRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const isOpen = useSelectEvent(rootRef, forceRef, optionsRef)
  const list = options.filter((option) =>
    'disabled' in option ? !option.disabled : true,
  )

  return (
    <>
      <div className="relative w-full" ref={rootRef}>
        <div
          id="ct"
          tabIndex={0}
          ref={forceRef}
          className={`flex text-sm text-gray-500 border border-gray-300 rounded shadow-sm transition duration-300 focus:outline-none ${
            isDisabled
              ? ' bg-gray-200'
              : ' bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500'
          }`}
        >
          <div className="grow pl-2.5 py-2 pr-2 flex flex-wrap gap-1">
            <p className="truncate">{value?.label}</p>
          </div>
        </div>
        {isOpen && (
          <div
            ref={optionsRef}
            tabIndex={-1}
            className="absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700"
          >
            <div className="max-h-72 overflow-y-auto">
              <div className="px-2.5">
                {list.map((option) => (
                  <div
                    onClick={() => console.log(option)}
                    key={option.value}
                    className={`block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                      value?.value === option.value
                        ? 'text-white bg-blue-500'
                        : 'text-gray-500 hover:bg-blue-100 hover:text-blue-500'
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function Test2() {
  return (
    <div className="w-32">
      <Select
        value={{ label: 'cuitao', value: 'ct' }}
        onChange={() => {}}
        options={[
          { label: 'cuitao', value: 'ct' },
          { label: 'liufanghua', value: 'lfh' },
          { label: 'ct1', value: 'ct1' },
          { label: 'ct2', value: 'ct2' },
          { label: 'ct3', value: 'ct3' },
          { label: 'ct4', value: 'ct4' },
          { label: 'ct5', value: 'ct5' },
          { label: 'ct6', value: 'ct6' },
          { label: 'ct7', value: 'ct7' },
          { label: 'ct8', value: 'ct8' },
          { label: 'ct9', value: 'ct9' },
          { label: 'ct10', value: 'ct10' },
          { label: 'ct11', value: 'ct11' },
          { label: 'ct12', value: 'ct12' },
          { label: 'ct13', value: 'ct13' },
          { label: 'ct14', value: 'ct14' },
          { label: 'ct15', value: 'ct15' },
          { label: 'ct16', value: 'ct16' },
          { label: 'ct17', value: 'ct17' },
          { label: 'ct18', value: 'ct18' },
          { label: 'ct19', value: 'ct19' },
          { label: 'ct20', value: 'ct20' },
          { label: 'ct21', value: 'ct21' },
          { label: 'ct22', value: 'ct22' },
          { label: 'ct23', value: 'ct23' },
          { label: 'ct24', value: 'ct24' },
          { label: 'ct25', value: 'ct25' },
          { label: 'ct26', value: 'ct26' },
        ]}
      />
    </div>
  )
}
