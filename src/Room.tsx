import React, { useState, useRef, VFC, createContext } from 'react'
import Peer, { SfuRoom } from 'skyway-js'
import { VideoArea } from './components'

type remoteUser = {
  id: string
  video: MediaStream
}

const skywayKey: string | undefined = process.env.REACT_APP_SKYWAY_KEY
const peer = new Peer({
  key: typeof skywayKey === 'string' ? skywayKey : '',
  debug: 3
})

let localVideo: MediaStream
let room: SfuRoom

export const videoRefArrayContext = createContext<React.MutableRefObject<HTMLVideoElement>[]>([])

const Room: VFC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const [myId, setMyId] = useState('')
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

  const setRoomEvent = () => {
    room.on('open', () => {
      console.log('!!openイベント発火!!')
    })

    room.on('stream', async (stream) => {
      const id = stream.peerId
      const video = stream
      console.log(`!!streamイベント発火-id:${id},video:${video}!!`)
      setRemoteUsersInfo((beforeInfo) => [...beforeInfo, { id: id, video: video }])
      setIsTalking(true)
    })

    room.on('peerJoin', (peerId) => {
      console.log(`!!peerJoinイベント発火-${peerId}が参加!!`)
    })

    room.on('peerLeave', (peerId) => {
      console.log(`!!peerLeaveイベント発火-${peerId}が退出!!`)
      setRemoteUsersInfo((beforeInfo) => beforeInfo.filter((user) => user.id !== peerId))
    })

    room.once('close', () => {
      console.log(`!!closeイベント発火$!!`)
      setRemoteUsersInfo([])
    })
  }

  const handleJoin = () => {
    room = peer.joinRoom(roomId, { mode: 'sfu', stream: localVideo })
    setRoomEvent()
  }

  const handleLeave = () => {
    if (!isTalking) return
    room.close()
  }

  const handleDestroy = () => {
    console.log('破棄')
    peer.destroy()
    setRemoteUsersInfo([])
  }

  const handleShare = async () => {
    console.log('共有')
    const md = navigator.mediaDevices as any //型が正しいのに（：MediaStream）getDisplayMediaを見つけてくれない。現状対処法無い。
    const localSharedScreen = await md.getDisplayMedia({
      video: true,
      audio: false
    })

    let localAudio: MediaStream | undefined
    await navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true
      })
      .then((stream) => {
        localAudio = stream
      })
      .catch((err) => {
        console.error('device error', err)
      })

    const combineMediaStream = localAudio
      ? new MediaStream([...localSharedScreen.getTracks(), ...localAudio.getTracks()])
      : undefined

    localVideo.getTracks().forEach((track) => track.stop())
    if (localVideoRef.current) localVideoRef.current.srcObject = null

    if (localVideoRef.current && combineMediaStream) {
      localVideoRef.current.srcObject = combineMediaStream
      localVideo = combineMediaStream
    }

    room.replaceStream(localVideo)
  }

  const handleShareClose = async () => {
    const video = await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        return stream
      })
      .catch((err) => {
        console.error('device error', err)
      })
    localVideo.getTracks().forEach((track) => track.stop())
    if (localVideoRef.current) localVideoRef.current.srcObject = null

    if (localVideoRef.current && video) {
      localVideoRef.current.srcObject = video
      localVideo = video
    }
    room.replaceStream(localVideo)
  }

  // eslint-disable-next-line no-constant-condition
  if (((1 <= 1 && 1 <= 1) || (1 <= 1 && 1 <= 1)) && ((1 <= 1 && 1 <= 1) || (1 <= 1 && 1 <= 1))) {
    console.log('f')
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
          <button onClick={handleJoin}>発信</button>
          <button onClick={handleLeave}>切断</button>
          <button onClick={handleShare}>画面共有</button>
          <button onClick={handleShareClose}>画面共有終了</button>
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
