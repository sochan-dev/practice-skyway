import React, { useState, useRef, VFC } from 'react'
import Peer, { MediaConnection } from 'skyway-js'

const skywayKey: string | undefined = process.env.REACT_APP_SKYWAY_KEY
const peer = new Peer({
  key: typeof skywayKey === 'string' ? skywayKey : '',
  debug: 3
})

let localVideo: MediaStream
let mediaConnection: MediaConnection

const PtoP: VFC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [myId, setMyId] = useState('')
  const [theirId, setTheirId] = useState('')
  const [isTalking, setIsTalking] = useState(false)
  const [testCount, setTestCount] = useState(0)

  peer.on('open', () => {
    console.log('skywayとの同期開始')
    setMyId(peer.id)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream
          localVideo = localStream
        }
      })
      .catch((err) => {
        console.error('device error', err)
      })
  })

  peer.on('call', (mc: MediaConnection) => {
    mediaConnection = mc
    mediaConnection.answer(localVideo)

    mediaConnection.on('stream', async (stream) => {
      console.log('相手映像受け取りました', stream)
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream
      setIsTalking(true)
      setMediaCloseEvent()
    })
  })

  console.log('非再描写再読み込み')
  const setMediaCloseEvent = () => {
    mediaConnection.on('close', () => {
      console.log('切断を検知！！！')
    })
  }

  const handleCall = () => {
    mediaConnection = peer.call(theirId, localVideo)
    mediaConnection.on('stream', async (stream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream
      setIsTalking(true)
      setMediaCloseEvent()
    })
  }

  const handleClose = () => {
    if (!isTalking) return
    mediaConnection.close()
  }

  const handleDestroy = () => {
    console.log('破棄')
    peer.destroy()
  }

  return (
    <>
      <div>
        <div>skyway test</div>
        <div>
          <video width="400px" autoPlay muted playsInline ref={localVideoRef}></video>
        </div>
        <div>{myId}</div>
        <div>
          <input value={theirId} onChange={(e) => setTheirId(e.target.value)}></input>
          <button onClick={handleCall}>発信</button>
          <button onClick={handleClose}>切断</button>
          <button onClick={handleDestroy}>⚠破棄⚠</button>
          <button onClick={() => setTestCount((t) => t + 1)}>{`---${testCount}---`}</button>
        </div>
        <div>
          <video width="400px" autoPlay muted playsInline ref={remoteVideoRef}></video>
        </div>
      </div>
    </>
  )
}

export default PtoP
