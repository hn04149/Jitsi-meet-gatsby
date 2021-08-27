import * as React from "react"
import styled from "styled-components"
import ProgressComponent from "@material-ui/core/CircularProgress"

const Jitsi = ({ roomName, yourName, password }) => {
  const [loading, setLoading] = React.useState(true)
  const jitsiContainerStyle = {
    display: loading ? "none" : "block",
    width: "100%",
    height: "100%",
  }

  async function startConference () {
    try {
      const domain = "meet.jit.si"
      const options = {
        roomName: roomName,
        width: 1400,
        height: 700,
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          filmStripOnly: false,
        },
        parentNode: document.querySelector("#jitsi-iframe"),
        userInfo: {
          displayName: yourName,
        },
      }

      const api = new window.JitsiMeetExternalAPI(domain, options)

      //get available device List
      const availableDeviceList = await api.getAvailableDevices()

      //current URL
      const liveStreamUrl = await api.getLivestreamUrl()

      api.addEventListener("videoConferenceJoined", () => {
        console.log("Local User Joined")
        console.log(availableDeviceList)
        console.log(liveStreamUrl)
        setLoading(false)
      })
    } catch (e) {
      console.error("Failed to load Jitsi API", e)
    }
  }

  React.useEffect(() => {
    if (window.JitsiMeetExternalAPI) startConference()
    else alert("API script not loaded")
  }, [])

  return (
    <div style={{ width: "100%" }}>
      {loading && (
        <div
          style={{
            height: "700px",
            width: "1400px",
            lineHeight: "700px",
            textAlign: "center",
            display: "inline-block",
          }}
        >
          <ProgressComponent />
        </div>
      )}
      <div id="jitsi-iframe" style={jitsiContainerStyle}></div>
    </div>
  )
}

export default Jitsi