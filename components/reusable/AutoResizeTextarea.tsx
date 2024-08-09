import { useEffect, useRef, useState } from 'react'

export default function AutoResizeTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string
  }
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [height, setHeight] = useState('auto')

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const element = event.currentTarget
    setHeight(`${element.scrollHeight}px`)
    if (props.onChange) {
      props.onChange(event)
    }
  }

  useEffect(() => {
    const element = textareaRef.current
    if (element) {
      element.style.height = 'auto'
      element.style.height = `${element.scrollHeight}px`
    }
  }, [props.value])

  function handleBlur() {
    const element = textareaRef.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }
  useEffect(() => {
    const element = textareaRef.current
    if (element) {
      element.addEventListener('blur', handleBlur)
      return () => {
        element.removeEventListener('blur', handleBlur)
      }
    }
  }, [])

  return (
    <textarea
      {...props}
      ref={textareaRef}
      style={{ height }}
      onChange={handleChange}
      className={props.className}
    />
  )
}
