import * as React from "react"
import ProgressComponent from "@material-ui/core/CircularProgress"
import { MdVideocamOff, MdVideocam, MdDashboard, MdScreenShare } from "react-icons/md"
import { BiRectangle } from "react-icons/bi"
import { FaMicrophone, FaMicrophoneSlash, FaRegHandPaper } from "react-icons/fa"
import { RiChat4Fill, RiChatOffFill } from "react-icons/ri"

const JitsiScreen = ({ roomName, yourName, onClose }) => {
  const [api, setApi] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [mouseOn, setMouseOn] = React.useState("undefined")
  const [setting, setSetting] = React.useState({
    videomuted: false,
    audiomuted: false,
    chat: false,
    isTileView: false,
    raisehand: false,
  })
  const [privateChatId, setPrivateChatId] = React.useState("")

  const jitsiContainerStyle = {
    display: loading ? "none" : "block",
    width: "1000px",
    height: "700px",
    paddingTop: "50px",
  }

  async function startConference() {
    try {
      const domain = "meet.jit.si"
      const options = {
        roomName: roomName,
        width: "100%",
        height: "100%",
        configOverwrite: {
          doNotStoreRoom: true,
          startVideoMuted: 0,
          startWithVideoMuted: true,
          startWithAudioMuted: true,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableRemoteMute: true,
          remoteVideoMenu: {
            disableKick: true,
          },
        },
        interfaceConfigOverwrite: {
          filmStripOnly: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          HIDE_DEEP_LINKING_LOGO: true,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          DEFAULT_BACKGROUND: "black",
          INITIAL_TOOLBAR_TIMEOUT: 2000,
          TOOLBAR_TIMEOUT: 2000,
          TOOLBAR_ALWAYS_VISIBLE: false,
          //TOOLBAR_BUTTONS: ["fullscreen", "settings"],
        },
        parentNode: document.querySelector("#jitsi-iframe"),
        userInfo: {
          displayName: yourName,
        },
      }

      const _api = new window.JitsiMeetExternalAPI(domain, options)
      setApi(_api)

      _api.addEventListener("videoConferenceJoined", async ({ roonName, id, displayName, avatarURL }) => {
        console.log("Local User Joined", roomName, id, displayName, avatarURL)
        setLoading(false)

        const audio = await _api.isAudioMuted()
        const video = await _api.isVideoMuted()
        setSetting({
          ...setting,
          videomuted: video,
          audiomuted: audio,
        })
      })

      _api.addEventListener("mouseEnter", async event => {
        console.log(event)
      })
    } catch (e) {
      console.error("Failed to load Jitsi API", e)
    }
  }

  

  async function Execute(command, options) {
    if (command === "toggleAudio") {
      await api.executeCommand("toggleAudio")
      const result = await api.isAudioMuted()
      if (result !== setting.audiomuted) {
        setSetting({
          ...setting,
          audiomuted: result,
        })
      }
    } else if (command === "toggleVideo") {
      await api.executeCommand("toggleVideo")
      const result = await api.isVideoMuted()
      if (result !== setting.videomuted) {
        setSetting({
          ...setting,
          videomuted: result,
        })
      }
    } else if (command === "toggleTileView") {
      await api.executeCommand("toggleTileView")
      setSetting({
        ...setting,
        isTileView: !setting.isTileView,
      })
    } else if (command === "toggleChat") {
      await api.executeCommand("toggleChat")
      setSetting({
        ...setting,
        chat: !setting.chat,
      })
    } else if (command === "toggleShareScreen") {
      await api.executeCommand("toggleShareScreen")
    } else if (command === "toggleRaiseHand") {
      await api.executeCommand("toggleRaiseHand")
      setSetting({
        ...setting,
        raisehand: !setting.raisehand,
      })
    } else if (command === "initiatePrivateChat") {
      api.executeCommand("initiatePrivateChat", options.participantID)
    }
  }

  React.useEffect(() => {
    if (window.JitsiMeetExternalAPI) startConference()
    else alert("API script not loaded")
  }, [])

  async function getParticipantsInfo() {
    const result = await api.getParticipantsInfo()
    console.log(result)
  }

  return (
    <>
      <div style={{ width: "100%" }}>
        {loading && (
          <div
            style={{
              height: "100%",
              width: "100%",
              lineHeight: "700px",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            <ProgressComponent />
          </div>
        )}
        <div id="jitsi-iframe" style={jitsiContainerStyle}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {!loading && (
            <div style={{ position: "relative", marginTop: "20px" }}>
              {setting.audiomuted ? (
                <FaMicrophoneSlash
                  className="icons"
                  onClick={() => Execute("toggleAudio")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Microphone" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Microphone")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              ) : (
                <FaMicrophone
                  className="icons"
                  onClick={() => Execute("toggleAudio")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Microphone" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Microphone")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              )}
              {setting.videomuted ? (
                <MdVideocamOff
                  className="icons"
                  onClick={() => Execute("toggleVideo")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Video" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Video")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              ) : (
                <MdVideocam
                  className="icons"
                  onClick={() => Execute("toggleVideo")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Video" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Video")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              )}
              {setting.chat ? (
                <RiChat4Fill
                  className="icons"
                  onClick={() => Execute("toggleChat")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Chat" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Chat")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              ) : (
                <RiChatOffFill
                  className="icons"
                  onClick={() => Execute("toggleChat")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Chat" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Chat")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              )}
              {setting.isTileView ? (
                <MdDashboard
                  className="icons"
                  onClick={() => Execute("toggleTileView")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Dashboard" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Dashboard")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              ) : (
                <BiRectangle
                  className="icons"
                  onClick={() => Execute("toggleTileView")}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "30px",
                    cursor: "pointer",
                    background: mouseOn === "Dashboard" ? "#adadad" : null,
                    borderRadius: "5px",
                  }}
                  onMouseEnter={() => setMouseOn("Dashboard")}
                  onMouseLeave={() => setMouseOn("undefined")}
                />
              )}
              <MdScreenShare
                className="icons"
                onClick={() => Execute("toggleShareScreen")}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "30px",
                  cursor: "pointer",
                  background: mouseOn === "ScreenShare" ? "#adadad" : null,
                  borderRadius: "5px",
                }}
                onMouseEnter={() => setMouseOn("ScreenShare")}
                onMouseLeave={() => setMouseOn("undefined")}
              />
              <FaRegHandPaper
                className="icons"
                onClick={() => Execute("toggleRaiseHand")}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "30px",
                  padding: "2px",
                  background:
                    mouseOn === "RaiseHand"
                      ? "#adadad"
                      : setting.raisehand
                      ? "#c9c9c9"
                      : "#ebebeb",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setMouseOn("RaiseHand")}
                onMouseLeave={() => setMouseOn("undefined")}
              />
            </div>
          )}

          <div>
            <button onClick={getParticipantsInfo}>Get Participants Info</button>
            <input value={privateChatId} onChange={(e) => setPrivateChatId(e.target.value)} />
            <button onClick={() => Execute("initiatePrivateChat", {participantID: privateChatId})}>Initiate Private Chat</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default JitsiScreen