import React, { useState, useEffect, useRef, VFC, ChangeEvent } from 'react'
import Peer, { MediaConnection } from 'skyway-js'

const skywayKey: string | undefined = process.env.REACT_APP_SKYWAY_KEY

const peer = new Peer({
  key: typeof skywayKey === 'string' ? skywayKey : '',
  debug: 3
})

let localStream: MediaStream
let theirStream: MediaStream
let mediaConnection: MediaConnection
const FaceToFace: VFC = () => {
  const ref = useRef<HTMLVideoElement>(null)
  const theirRef = useRef<HTMLVideoElement>(null)
  const [peerId, setPeerId] = useState('')
  const [theirId, setTheirId] = useState('')
  const [isTalking, setIsTalking] = useState(false)

  const getMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoElm = ref.current
        if (videoElm) {
          videoElm.srcObject = stream
          videoElm.play()
        }

        localStream = stream
      })
      .catch((error) => {
        console.error('mediaDevice.getUserMedia() error:', error)
        return
      })
  }

  const setEventListener = (mc: MediaConnection) => {
    mediaConnection = mc
    mediaConnection.on('stream', (stream: MediaStream) => {
      console.log('通過！！！！！！！！！！！！！！！！！！！！')
      const videoElm = theirRef.current
      if (videoElm) {
        console.log('通過！！！！！！！！！！！！！！！！！！！！２')
        videoElm.srcObject = stream
        videoElm.play()
      }
      theirStream = stream
      setIsTalking(true)
    })
    mediaConnection.on('close', () => {
      console.log(peerId, 'のユーザーはcloseを感知')
      const videoElm = theirRef.current
      theirStream.getTracks().forEach((track) => track.stop())
      if (videoElm) {
        console.log(peerId, 'のユーザーはvideoElmを初期化')
        videoElm.srcObject = null
        setTheirId('')
        setIsTalking(false)
      }
    })
  }

  const handleCall = () => {
    const mc = peer.call(theirId, localStream)
    console.log('mc->', mc)
    setEventListener(mc)
  }

  const handleClose = () => {
    mediaConnection.close()
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTheirId(e.target.value)
  }

  useEffect(() => {
    getMedia()
  }, [])

  peer.on('open', () => {
    setPeerId(peer.id)
  })

  peer.on('call', (mediaConnection) => {
    mediaConnection.answer(localStream)
    setEventListener(mediaConnection)
  })

  peer.on('error', (errMsg) => {
    alert(errMsg)
  })

  return (
    <div>
      <div>React TypeScript SkyWay</div>
      <video ref={ref} width="400px" autoPlay muted playsInline></video>
      <p>{peerId}</p>
      <textarea value={theirId} onChange={handleChange}></textarea>
      {!isTalking ? (
        <button onClick={handleCall}>発信!</button>
      ) : (
        <>
          <button onClick={handleClose}>切断!</button>
          <video ref={theirRef} width="400px" autoPlay muted playsInline></video>
        </>
      )}
    </div>
  )
}

export default FaceToFace
