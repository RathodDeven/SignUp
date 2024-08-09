import { Dispatch, SetStateAction } from 'react'

interface ToggleButtonProps {
  isOn: boolean
  setIsOn: Dispatch<SetStateAction<boolean>>
  sizeInPixels?: number
  disabled?: boolean
}

export default function ToggleButton({
  isOn,
  setIsOn,
  sizeInPixels = 10,
  disabled = false
}: ToggleButtonProps) {
  function handleClick() {
    if (disabled) return
    setIsOn(!isOn)
  }
  return (
    <div
      className={`relative cursor-pointer inline-block rounded-full transition-colors duration-300 ${
        isOn ? 'bg-blue-500' : 'bg-s-bg'
      }`}
      style={{
        boxShadow: isOn
          ? '0px 0px 10px rgba(0, 0, 255, 0.5)'
          : '0px 0px 10px rgba(0, 0, 0, 0.5)',
        width: `${sizeInPixels}px`,
        height: `${sizeInPixels / 2}px`
      }}
      onClick={handleClick}
    >
      <div
        className={`absolute left-0 top-0 rounded-full  shadow-md transition-transform duration-300 ${
          isOn ? 'transform translate-x-full bg-p-text' : 'bg-s-text'
        }`}
        style={{
          width: `${sizeInPixels / 2}px`,
          height: `${sizeInPixels / 2}px`
        }}
      ></div>
    </div>
  )
}
