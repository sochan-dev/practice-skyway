import React, { VFC, useState, useRef, useEffect } from 'react'

let globalVal: HTMLInputElement
console.log('global実行')
const Test: VFC = () => {
  const ref = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const [inputRef, setInputRef] = useState('')

  const [array, setArray] = useState([
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' }
  ])

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

  console.log('state', array)

  useEffect(() => {
    setArray((beforeArray) => beforeArray.filter((a) => a.id !== 2))
  }, [])

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
