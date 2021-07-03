import React, { VFC } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import FaceToFace from './FaceToFace'
import Room from './Room'
import PtoP from './PtoP'
import Test from './Test'
const App: VFC = () => {
  return (
    <>
      <Router>
        <Route exact path="/room" component={Room} />
        <Route path="/faceToFace" component={FaceToFace} />
        <Route path="/ptop" component={PtoP} />
        <Route path="/test" component={Test} />
      </Router>
    </>
  )
}

export default App
