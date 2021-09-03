import * as React from "react"
import styled from "styled-components"
import Jitsi from "./jitsi-gatsby"

const IndexPage = () => {
  React.useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://meet.jit.si/external_api.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const [roomName, setRoomName] = React.useState("Jitsi Room")
  const [yourName, setYourName] = React.useState("Sangjin")
  const [password, setPassword] = React.useState("")
  const [popup, setPopup] = React.useState(false)

  return (
    <div style={{ padding: "50px", position: "relative" }}>
      {popup && <Popup onClose={() => setPopup(false)} roomName={roomName} yourName={yourName} password={password} />}
      <InputBox
        placeholder="Room Name"
        value={roomName}
        onChange={e => setRoomName(e.target.value)}
      />
      <InputBox
        placeholder="Your Name"
        value={yourName}
        onChange={e => setYourName(e.target.value)}
      />
      <InputBox
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={() => setPopup(true)}>start</button>
    </div>
  )
}

export default IndexPage

const Popup = ({ onClose, roomName, yourName, password }) => {
  return (
    <div>
      <Main>
        <CloseBtn onClick={onClose}>Close</CloseBtn>
        <div style={{ position: "absolute", top: "100px" }}>
          <Jitsi roomName={roomName} yourName={yourName} password={password} />
        </div>
      </Main>
    </div>
  )
}

const InputBox = styled.input`
  margin-right: 10px;
`
const Main = styled.div`
  background: pink;
  position: relative;
`
const CloseBtn = styled.button`
  position: absolute;
  padding: 0;
  margin: 0;
  right: 0;
  top: 0;
`