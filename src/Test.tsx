import React, { VFC, useState, useRef } from 'react'

let globalVal: HTMLInputElement
console.log('global実行')
const Test: VFC = () => {
  const ref = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const [inputRef, setInputRef] = useState('')

  let localVal: string

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('hello', ref.current?.value)
    setInputRef(e.target.value)
    const v = ref.current
    if (v && ref.current) {
      v.value = '1234567890'
      console.log('refを代入したvを変更→v:', v?.value, 'ref:', ref.current.value, 'state:', inputRef)
    }

    if (ref.current) globalVal = ref.current
  }

  return (
    <>
      <p>{ref && <>ref:{ref.current?.value}</>}</p>
      <input type="text" ref={ref} onChange={(e) => handleOnChange(e)} />
      ref2
      <input type="text" ref={ref2} />
      <p>{globalVal && <>global:{globalVal.value}</>}</p>
    </>
  )
}
export default Test
