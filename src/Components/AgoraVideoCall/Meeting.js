import React from "react";
import * as Cookies from "js-cookie";

import "./meeting.css";
import AgoraVideoCall from "../../components/AgoraVideoCall";
import { AGORA_APP_ID } from "../../agora.config";
import AgoraCanvas from "../../components/AgoraVideoCall/AgoraCanvas";

function Meeting() {
  const videoProfile = Cookies.get("videoProfile").split(",")[0] || "480p_4";
  const channel = Cookies.get("channel") || "test";
  const transcode = Cookies.get("transcode") || "interop";
  const attendeeMode = Cookies.get("attendeeMode") || "video";
  const baseMode = Cookies.get("baseMode") || "avc";
  const appId = AGORA_APP_ID;

  if (!appId) {
    return alert("Get App ID first!");
  }
  const uid = undefined;

  return (
    <div className="wrapper meeting">
      <div className="ag-header">
        <div className="ag-header-lead">
          <img
            className="header-logo"
            src={require("../../assets/images/ag-logo.png")}
            alt=""
          />
          <span>AgoraWeb v2.1</span>
        </div>
        <div className="ag-header-msg">
          Room:&nbsp;<span id="room-name">{channel}</span>
        </div>
      </div>
      <div className="ag-main">
        <div className="ag-container">
          <AgoraCanvas
            videoProfile={videoProfile}
            channel={channel}
            transcode={transcode}
            attendeeMode={attendeeMode}
            baseMode={baseMode}
            appId={appId}
            uid={uid}
          />
        </div>
      </div>
      <div className="ag-footer">
        <a className="ag-href" href="https://www.agora.io">
          <span>Powered By Agora</span>
        </a>
        <span>Talk to Support: 400 632 6626</span>
      </div>
    </div>
  );
}

export default Meeting;
