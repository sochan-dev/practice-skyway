import React, { useState, useEffect, useRef, VFC, ChangeEvent, createContext, HtmlHTMLAttributes } from 'react'
import Peer, { MediaConnection, SfuRoom } from 'skyway-js'
import { VideoArea } from './components'

type remoteUser = {
  id: string
  video: MediaStream
}

const skywayKey: string | undefined = process.env.REACT_APP_SKYWAY_KEY
const peer = new Peer({
  key: typeof skywayKey === 'string' ? skywayKey : '',
  debug: 0
})

let localVideo: MediaStream
let remoteVideo: MediaStream

//let remoteUsers: remoteUser[]

let mediaConnection: MediaConnection
let room: SfuRoom

export const videoRefArrayContext = createContext<React.RefObject<HTMLVideoElement>[]>([])
const videoRefs: React.RefObject<HTMLVideoElement>[] = []

const Room: VFC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [myId, setMyId] = useState('')
  const [theirId, setTheirId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [remoteUsersInfo, setRemoteUsersInfo] = useState<remoteUser[]>([])
  const [isTalking, setIsTalking] = useState(false)

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

  const handleCall = () => {
    room = peer.joinRoom(roomId, { mode: 'sfu', stream: localVideo })
    setRoomEvent()
  }

  const setRoomEvent = () => {
    room.on('open', () => {
      console.log('open')
    })

    room.on('stream', async (stream) => {
      const id = stream.peerId
      const video = stream
      console.log(`${id}さんのデーター取得`, video)
      setRemoteUsersInfo((beforeInfo) => [...beforeInfo, { id: id, video: video }])
      console.log('setした', remoteUsersInfo)
      setIsTalking(true)
    })

    room.on('peerJoin', (peerId) => {
      console.log('peerJoin', peerId + 'さん')
    })

    room.once('close', () => {
      console.log('close')
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
          <input value={roomId} onChange={(e) => setRoomId(e.target.value)}></input>
          <button onClick={handleCall}>発信</button>
          <button onClick={handleClose}>切断</button>
          <button onClick={handleDestroy}>⚠破棄⚠</button>
        </div>
        <div>
          <VideoArea users={remoteUsersInfo} />
        </div>
      </div>
    </>
  )
}

export default Room
