import React, { useEffect, useState } from "react";
import { merge } from "lodash";
import AgoraRTC from "agora-rtc-sdk";

import "./canvas.css";
import "../../assets/fonts/css/icons.css";
import { useDispatch, useSelector } from "react-redux";
import { enterVoiceChannel, selectedVoiceChannelId, selectServerId } from "../../features/appSlice";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const tile_canvas = {
  1: ["span 12/span 24"],
  2: ["span 12/span 12/13/25", "span 12/span 12/13/13"],
  3: ["span 6/span 12", "span 6/span 12", "span 6/span 12/7/19"],
  4: [
    "span 6/span 12",
    "span 6/span 12",
    "span 6/span 12",
    "span 6/span 12/7/13",
  ],
  5: [
    "span 3/span 4/13/9",
    "span 3/span 4/13/13",
    "span 3/span 4/13/17",
    "span 3/span 4/13/21",
    "span 9/span 16/10/21",
  ],
  6: [
    "span 3/span 4/13/7",
    "span 3/span 4/13/11",
    "span 3/span 4/13/15",
    "span 3/span 4/13/19",
    "span 3/span 4/13/23",
    "span 9/span 16/10/21",
  ],
  7: [
    "span 3/span 4/13/5",
    "span 3/span 4/13/9",
    "span 3/span 4/13/13",
    "span 3/span 4/13/17",
    "span 3/span 4/13/21",
    "span 3/span 4/13/25",
    "span 9/span 16/10/21",
  ],
};
let client = {};
let localStream = {};
let shareClient = {};
let shareStream = {};

function AgoraCanvas({
  appId,
  uid,
  transcode,
  attendeeMode,
  videoProfile,
  channel,
  baseMode,
}) {
  const [displayMode, setDisplayMode] = useState("pip");
  const [streamList, setStreamList] = useState([]);
  const [readyState, setReadyState] = useState();
  const [stateSharing, setStateSharing] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const voiceChannelId = useSelector(selectedVoiceChannelId);
  const [user] = useAuthState(auth);
  const serverId = useSelector(selectServerId);

  useEffect(() => {
    client = AgoraRTC.createClient({ mode: transcode });
    client.init(appId, () => {
      console.log("AgoraRTC client initialized");
      subscribeStreamEvents();
      client.join(appId, channel, uid, (id) => {
        setId(id);
        console.log("User " + id + " join channel successfully");
        console.log("At " + new Date().toLocaleTimeString());
        // create local stream
        // It is not recommended to setState in function addStream
        localStream = streamInit(id, attendeeMode, videoProfile);

        localStream.init(
          () => {
            if (attendeeMode !== "audience") {
              addStream(localStream, true);
              client.publish(localStream, (err) => {
                console.log("Publish local stream error: " + err);
              });
            }
            setReadyState(true);
          },
          (err) => {
            console.log("getUserMedia failed", err);
            setReadyState(true);
          }
        );
      });
    });
  }, []);

  useEffect(() => {
    let canvas = document.querySelector("#ag-canvas");
    let btnGroup = document.querySelector(".ag-btn-group");
    canvas.addEventListener("mousemove", () => {
      if (global._toolbarToggle) {
        clearTimeout(global._toolbarToggle);
      }
      btnGroup.classList.add("active");
      global._toolbarToggle = setTimeout(function () {
        btnGroup.classList.remove("active");
      }, 2000);
    });
  }, []);

  useEffect(() => {
    if (voiceChannelId === null) {
      client && client.unpublish(localStream);
      localStream && localStream.close();
      if (stateSharing) {
        shareClient && shareClient.unpublish(shareStream);
        shareStream && shareStream.close();
      }
      client &&
        client.leave(
          () => {
            console.log("Client succeed to leave.");
          },
          () => {
            console.log("Client failed to leave.");
          }
        );
    }
  }, [voiceChannelId]);

  useEffect(() => {
    let canvas = document.querySelector("#ag-canvas");
    // pip mode (can only use when less than 4 people in channel)
    if (displayMode === "pip") {
      let no = streamList.length;
      if (no > 4) {
        setDisplayMode("tile");
        return;
      }
      streamList.map((item, index) => {
        let id = item.getId();
        let dom = document.querySelector("#ag-item-" + id);
        if (!dom) {
          dom = document.createElement("section");
          dom.setAttribute("id", "ag-item-" + id);
          dom.setAttribute("class", "ag-item");
          canvas.appendChild(dom);
          item.play("ag-item-" + id);
        }
        if (index === no - 1) {
          dom.setAttribute("style", `grid-area: span 12/span 24/13/25`);
        } else {
          dom.setAttribute(
            "style",
            `grid-area: span 3/span 4/${4 + 3 * index}/25;
                    z-index:1;width:calc(100% - 20px);height:calc(100% - 20px)`
          );
        }

        item.player.resize && item.player.resize();
      });
    } // tile mode
    else if (displayMode === "tile") {
      let no = streamList.length;
      streamList.map((item, index) => {
        let id = item.getId();
        let dom = document.querySelector("#ag-item-" + id);
        if (!dom) {
          dom = document.createElement("section");
          dom.setAttribute("id", "ag-item-" + id);
          dom.setAttribute("class", "ag-item");
          canvas.appendChild(dom);
          item.play("ag-item-" + id);
        }
        dom.setAttribute("style", `grid-area: ${tile_canvas[no][index]}`);
        item.player.resize && item.player.resize();
      });
    } // screen share mode (tbd)
    else if (displayMode === "share") {
    }
  }, [streamList]);

  useEffect(() => {
    const unMount = () => {
      client && client.unpublish(localStream);
      // localStream && localStream.close();
      if (stateSharing) {
        shareClient && shareClient.unpublish(shareStream);
        shareStream && shareStream.close();
      }
      client &&
        client.leave(
          () => {
            console.log("Client succeed to leave.");
          },
          () => {
            console.log("Client failed to leave.");
          }
        );
    };
    return unMount();
  }, []);

  const streamInit = (uid, attendeeMode, videoProfile, config) => {
    let defaultConfig = {
      streamID: uid,
      audio: true,
      video: true,
      screen: false,
    };

    switch (attendeeMode) {
      case "audio-only":
        defaultConfig.video = false;
        break;
      case "audience":
        defaultConfig.video = false;
        defaultConfig.audio = false;
        break;
      default:
      case "video":
        break;
    }

    let stream = AgoraRTC.createStream(merge(defaultConfig, config));
    stream.setVideoProfile(videoProfile);
    return stream;
  };

  const subscribeStreamEvents = () => {
    client.on("stream-added", function (evt) {
      let stream = evt.stream;
      console.log("New stream added: " + stream.getId());
      console.log("At " + new Date().toLocaleTimeString());
      console.log("Subscribe ", stream);
      client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
    });

    client.on("peer-leave", function (evt) {
      console.log("Peer has left: " + evt.uid);
      console.log(new Date().toLocaleTimeString());
      console.log(evt);
      removeStream(evt.uid);
    });

    client.on("stream-subscribed", function (evt) {
      let stream = evt.stream;
      console.log("Got stream-subscribed event");
      console.log(new Date().toLocaleTimeString());
      console.log("Subscribe remote stream successfully: " + stream.getId());
      console.log(evt);
      addStream(stream);
    });

    client.on("stream-removed", function (evt) {
      let stream = evt.stream;
      console.log("Stream removed: " + stream.getId());
      console.log(new Date().toLocaleTimeString());
      console.log(evt);
      removeStream(stream.getId());
    });
  };

  const removeStream = (uid) => {
    streamList.map((item, index) => {
      if (item.getId() === uid) {
        item.close();
        let element = document.querySelector("#ag-item-" + uid);
        if (element) {
          element.parentNode.removeChild(element);
        }
        let tempList = [...streamList];
        tempList.splice(index, 1);
        setStreamList(tempList);
      }
    });
  };

  const addStream = (stream, push = false) => {
    let repeatition = streamList.some((item) => {
      return item.getId() === stream.getId();
    });
    if (repeatition) {
      return;
    }
    if (push) {
      setStreamList(streamList.concat([stream]));
    } else {
      setStreamList([stream].concat(streamList));
    }
  };

  const handleCamera = (e) => {
    e.currentTarget.classList.toggle("off");
    localStream.isVideoOn()
      ? localStream.disableVideo()
      : localStream.enableVideo();
  };

  const handleMic = (e) => {
    e.currentTarget.classList.toggle("off");
    localStream.isAudioOn()
      ? localStream.disableAudio()
      : localStream.enableAudio();
  };

  const switchDisplay = (e) => {
    if (
      e.currentTarget.classList.contains("disabled") ||
      streamList.length <= 1
    ) {
      return;
    }
    if (displayMode === "pip") {
      setDisplayMode("tile");
    } else if (displayMode === "tile") {
      setDisplayMode("pip");
    } else if (displayMode === "share") {
      // do nothing or alert, tbd
    } else {
      console.error("Display Mode can only be tile/pip/share");
    }
  };

  const hideRemote = (e) => {
    if (
      e.currentTarget.classList.contains("disabled") ||
      streamList.length <= 1
    ) {
      return;
    }
    let list;
    let id = streamList[streamList.length - 1].getId();
    list = Array.from(
      document.querySelectorAll(`.ag-item:not(#ag-item-${id})`)
    );
    list.map((item) => {
      if (item.style.display !== "none") {
        item.style.display = "none";
      } else {
        item.style.display = "block";
      }
    });
  };

  const handleExit = (e) => {
    if (e && e.currentTarget.classList.contains("disabled")) {
      return;
    }
    try {
      client && client.unpublish(localStream);
      localStream && localStream.close();
      if (stateSharing) {
        shareClient && shareClient.unpublish(shareStream);
        shareStream && shareStream.close();
      }
      client &&
        client.leave(
          () => {
            console.log("Client succeed to leave.");
          },
          () => {
            console.log("Client failed to leave.");
          }
        );
    } finally {
      setReadyState(false);
      client = null;
      localStream = null;
      // redirect to index
      
    }
    dispatch(
      enterVoiceChannel({
        voiceChannelId: null,
      })
    );
    removeFromVoice();
  };
const removeFromVoice = () => {
  if (serverId && user && voiceChannelId) {
    db.collection("Servers")
      .doc(serverId)
      .collection("VoiceChannel")
      .doc(voiceChannelId)
      .collection("Members")
      .doc(user.uid)
      .delete()
      .then(() => {
        dispatch(
          enterVoiceChannel({
            voiceChannelId: null,
          })
        );
      });
  }
};

  const sharingScreen = (e) => {
    if (stateSharing) {
      shareClient && shareClient.unpublish(shareStream);
      shareStream && shareStream.close();
      setStateSharing(false);
    } else {
      setStateSharing(true);

      // init AgoraRTC local client
      shareClient = AgoraRTC.createClient({ mode: transcode });
      shareClient.init(appId, () => {
        console.log("AgoraRTC client initialized");
        subscribeStreamEvents();
        shareClient.join(appId, channel, uid, (id) => {
          setId(id);
          console.log("User " + id + " join channel successfully");
          console.log("At " + new Date().toLocaleTimeString());
          // create local stream
          // It is not recommended to setState in function addStream
          shareStream = streamInitSharing(id, attendeeMode, videoProfile);
          shareStream.init(
            () => {
              if (attendeeMode !== "audience") {
                addStream(shareStream, true);
                shareClient.publish(shareStream, (err) => {
                  console.log("Publish local stream error: " + err);
                });
              }
              setReadyState(true);
            },
            (err) => {
              console.log("getUserMedia failed", err);
              setReadyState(true);
            }
          );
        });
      });
    }
  };

  const streamInitSharing = (uid, attendeeMode, videoProfile, config) => {
    let defaultConfig = {
      streamID: uid,
      audio: true,
      video: false,
      screen: true,
    };

    switch (attendeeMode) {
      case "audio-only":
        defaultConfig.video = false;
        break;
      case "audience":
        defaultConfig.video = false;
        defaultConfig.audio = false;
        break;
      default:
      case "video":
        break;
    }

    let stream = AgoraRTC.createStream(merge(defaultConfig, config));
    stream.setVideoProfile(videoProfile);
    return stream;
  };

  const style = {
    display: "grid",
    gridGap: "10px",
    alignItems: "center",
    justifyItems: "center",
    gridTemplateRows: "repeat(12, auto)",
    gridTemplateColumns: "repeat(24, auto)",
  };
  const videoControlBtn =
    attendeeMode === "video" ? (
      <span
        onClick={handleCamera}
        className="ag-btn videoControlBtn"
        title="Enable/Disable Video"
      >
        <i className="ag-icon ag-icon-camera"></i>
        <i className="ag-icon ag-icon-camera-off"></i>
      </span>
    ) : (
      ""
    );

  const audioControlBtn =
    attendeeMode !== "audience" ? (
      <span
        onClick={handleMic}
        className="ag-btn audioControlBtn"
        title="Enable/Disable Audio"
      >
        <i className="ag-icon ag-icon-mic"></i>
        <i className="ag-icon ag-icon-mic-off"></i>
      </span>
    ) : (
      ""
    );

  const switchDisplayBtn = (
    <span
      onClick={switchDisplay}
      className={
        streamList.length > 4
          ? "ag-btn displayModeBtn disabled"
          : "ag-btn displayModeBtn"
      }
      title="Switch Display Mode"
    >
      <i className="ag-icon ag-icon-switch-display"></i>
    </span>
  );
  const hideRemoteBtn = (
    <span
      className={
        streamList.length > 4 || displayMode !== "pip"
          ? "ag-btn disableRemoteBtn disabled"
          : "ag-btn disableRemoteBtn"
      }
      onClick={hideRemote}
      title="Hide Remote Stream"
    >
      <i className="ag-icon ag-icon-remove-pip"></i>
    </span>
  );
  const exitBtn = (
    <span
      onClick={handleExit}
      className={readyState ? "ag-btn exitBtn" : "ag-btn exitBtn disabled"}
      title="Exit"
    >
      <i className="ag-icon ag-icon-leave"></i>
    </span>
  );

  return (
    <div id="ag-canvas" style={style}>
      <div className="ag-btn-group">
        {exitBtn}
        {videoControlBtn}
        {audioControlBtn}
        {
          <span
            onClick={sharingScreen}
            className="ag-btn shareScreenBtn"
            title="Share/unShare Screen"
          >
            <i className="ag-icon ag-icon-screen-share"></i>
          </span>
        }
        {switchDisplayBtn}
        {hideRemoteBtn}
      </div>
    </div>
  );
}

export default AgoraCanvas;
