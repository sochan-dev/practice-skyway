import React, { VFC, useState, useRef } from 'react'
import { UserVideo } from '../components'

type props = {
  users: { id: string; video: MediaStream }[]
}

const VideoArea: VFC<props> = (props) => {
  const users = props.users
  console.log('users!!!', users)
  users.map((user, i) => {
    console.log(`接続ユーザー${i}人目`, user.id)
  })
  return (
    <div>
      {users.map((user, i) => (
        <UserVideo video={user.video} userId={user.id} id={i} key={i} />
      ))}
    </div>
  )
}

export default VideoArea
