import React, { useRef, useEffect, VFC } from 'react'

type props = {
  video: MediaStream
  userId: string
  id: number
}

const UserVideo: VFC<props> = (props) => {
  const { video, userId } = props
  const remoteRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (remoteRef.current) remoteRef.current.srcObject = video

    return () => {
      console.log(`${userId}のUserVideoコンポーネントがアンマウント`)
      video.getTracks().forEach((track) => track.stop())
      if (remoteRef.current) {
        remoteRef.current.srcObject = null
        //remoteRef.current.remove()アンマウントしたのちアンマウントしたことになってる？
      }
    }
  }, [video, userId])

  return (
    <>
      <p>I am:{userId}</p>
      <video width="320px" ref={remoteRef} autoPlay playsInline></video>
    </>
  )
}

export default UserVideo
