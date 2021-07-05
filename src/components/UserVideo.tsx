import React, { useRef, useEffect, VFC, createRef } from 'react'
import { videoRefArrayContext } from '../Room'

type props = {
  video: MediaStream
  userId: string
  id: number
}

const UserVideo: VFC<props> = (props) => {
  const { video, userId, id } = props
  //const remoteRefs = useContext(videoRefArrayContext)
  const remoteRef = useRef<HTMLVideoElement>(null)

  console.log(`${userId}さんのuserVideoコンポーネントマウント`)
  useEffect(() => {
    if (remoteRef.current) remoteRef.current.srcObject = video
    console.log(`${userId}さん`, remoteRef.current?.srcObject)
  }, [])
  return (
    <>
      <p>I am:{props.userId}</p>
      <video width="320px" ref={remoteRef} autoPlay muted playsInline></video>
    </>
  )
}

export default UserVideo
