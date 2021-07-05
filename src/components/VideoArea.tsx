import React, { VFC } from 'react'
import { UserVideo } from '../components'

type props = {
  users: { id: string; video: MediaStream }[]
}

const VideoArea: VFC<props> = (props) => {
  const users = props.users
  return (
    <div>
      {users.map((user, i) => (
        <UserVideo video={user.video} userId={user.id} id={i} key={i} />
      ))}
    </div>
  )
}

export default VideoArea
