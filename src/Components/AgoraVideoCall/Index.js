import React, { useEffect, useState } from "react";
import * as Cookies from "js-cookie";

import "../../assets/fonts/css/icons.css";
import Validator from "../AgoraVideoCall/utils/Validator";
import { RESOLUTION_ARR } from "../AgoraVideoCall/utils/Settings";
import "./index.css";
import { useSelector } from "react-redux";
import { selectedVoiceChannelId } from "../../features/appSlice";

function Index() {
  const [joinBtn, setJoinBtn] = useState(false);
  const channel = useSelector(selectedVoiceChannelId);
  const [baseMode, setBaseMode] = useState("avc");
  const [transcode, setTransCode] = useState("interop");
  const [attendeeMode, setAttendeeMode] = useState("video");
  const [videoProfile, setVideoProfile] = useState("480p_4");

  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      e.keyCode === 13 && handleJoin();
    });
  }, []);

  /**
   *
   * @param {String} val 0-9 a-z A-Z _ only
   * @param {Boolean} state
   */

  const handleChannel = (val, state) => {
    setJoinBtn(state);
  };

  const handleJoin = () => {
    if (!joinBtn) {
      return;
    }
    Cookies.set("channel", channel);
    Cookies.set("baseMode", baseMode);
    Cookies.set("transcode", transcode);
    Cookies.set("attendeeMode", attendeeMode);
    Cookies.set("videoProfile", videoProfile);
    window.location.hash = "meeting";
  };

  return (
    <div className="wrapper index">
      <div className="ag-header"></div>
      <div className="ag-main">
        <section className="login-wrapper">
          <div className="login-header">
            <img src={require("../../assets/images/ag-logo.png")} alt="" />
            <p className="login-title">AgoraWeb v2.1</p>
            <p className="login-subtitle">Powering Real-Time Communications</p>
          </div>
          <div className="login-body">
            <div className="columns">
              <div className="column is-12">
                <InputChannel
                  value={channel}
                  placeholder="Input a room name here"
                ></InputChannel>
              </div>
            </div>
            <div className="columns">
              <div className="column is-7">
                <BaseOptions onChange={(val) => setBaseMode(val)}></BaseOptions>
              </div>
              <div className="column is-5">
                <AdvancedOptions
                  onRadioChange={(val) => setTransCode(val)}
                  onSelectChange={(val) => setVideoProfile(val)}
                ></AdvancedOptions>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div id="attendeeMode" className="control">
                  <label className="radio">
                    <input
                      onChange={(e) => setAttendeeMode(e.target.value)}
                      value="video"
                      type="radio"
                      name="attendee"
                      defaultChecked
                    />
                    <span className="radio-btn"></span>
                    <span className="radio-img video"></span>
                    <span className="radio-msg">
                      Video Call : join with video call
                    </span>
                  </label>
                  <br />
                  <label className="radio">
                    <input
                      onChange={(e) => setAttendeeMode(e.target.value)}
                      value="audio-only"
                      type="radio"
                      name="attendee"
                    />
                    <span className="radio-btn"></span>
                    <span className="radio-img audio"></span>
                    <span className="radio-msg">
                      Audio-only : join with audio call
                    </span>
                  </label>
                  <br />
                  <label className="radio">
                    <input
                      onChange={(e) => setAttendeeMode(e.target.value)}
                      value="audience"
                      type="radio"
                      name="attendee"
                    />
                    <span className="radio-btn"></span>
                    <span className="radio-img audience"></span>
                    <span className="radio-msg">
                      Audience : join as an audience
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="login-footer">
            <a
              id="joinBtn"
              onClick={handleJoin}
              disabled={!joinBtn}
              className="ag-rounded button is-info"
            >
              Join
            </a>
          </div>
        </section>
      </div>
      <div className="ag-footer">
        <a className="ag-href" href="https://www.agora.io">
          <span>Powered By Agora</span>
        </a>
        <div>
          <span>Interested in Agora video call SDK? Contact </span>
          <span className="ag-contact">sales@agora.io</span>
        </div>
      </div>
    </div>
  );
}

function InputChannel({ onChange, placeholder }) {
  const [errorMsg, setErroMsg] = useState("");
  const [state, setState] = useState("");
  const validate = (val) => {
    setState("");
    setErroMsg("");
    if (Validator.isNonEmpty(val.trim())) {
      setErroMsg("Cannot be empty!");
      setState("is-danger");
      return false;
    } else if (Validator.minLength(val.trim(), 1)) {
      setErroMsg("No Shorter than 1!");
      setState("is-danger");

      return false;
    } else if (Validator.maxLength(val.trim(), 16)) {
      setErroMsg("No longer than 16!");
      setState("is-danger");
      return false;
    } else if (Validator.validChar(val.trim())) {
      setErroMsg(
        'Only capital or lower-case letter, number and "_" are permitted!'
      );
      setState("is-danger");
      return false;
    } else {
      setState("is-success");
      return true;
    }
  };

  const handleChange = (e) => {
    let st = validate(e.target.value);
    onChange(e.target.value, st);
  };

  const [validateIcon, setValidateIcon] = useState("");
  const validateIconFun = () => {
    switch (state) {
      default:
      case "":
        setValidateIcon("");
        break;
      case "is-success":
        setValidateIcon(<i className="ag-icon ag-icon-valid"></i>);
        break;
      case "is-danger":
        setValidateIcon(<i className="ag-icon ag-icon-invalid"></i>);
        break;
    }
  };
  useEffect(() => {
    validateIconFun();
  }, [state]);

  return (
    <div className="channel-wrapper control has-icons-left">
      <input
        onInput={handleChange}
        id="channel"
        className={"ag-rounded input " + state}
        type="text"
        placeholder={placeholder}
      />
      <span className="icon is-small is-left">
        <img src={require("../../assets/images/ag-login.png")} alt="" />
      </span>
      <span className="validate-icon">{validateIcon}</span>
      <div className="validate-msg">{errorMsg}</div>
    </div>
  );
}
let _options = [
  {
    label: "Agora Video Call",
    value: "avc",
    content: "One to one and group calls",
  },
  {
    label: "Agora Live",
    value: "al",
    content:
      "Enabling real-time interactions between the host and the audience",
  },
];
function BaseOptions({ onChange }) {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("Agora Video Call");

  const handleSelect = (item) => {
    let msg = item.label;
    let val = item.value;
    setMessage(msg);
    setActive(false);
    onChange(val);
  };

  const options = _options.map((item, index) => {
    return (
      <div
        className="dropdown-item"
        key={index}
        onClick={(e) => handleSelect(item, e)}
      >
        <p>{item.label}</p>
        <hr />
        <p>{item.content}</p>
      </div>
    );
  });

  return (
    <div className={active ? "dropdown is-active" : "dropdown"}>
      <div className="dropdown-trigger" onClick={() => setActive(!active)}>
        <a
          id="baseMode"
          className="ag-rounded button"
          aria-haspopup="true"
          aria-controls="baseModeOptions"
        >
          <span id="baseOptionLabel">{message}</span>
          <span className="icon is-small">
            <i className="ag-icon ag-icon-arrow-down" aria-hidden="true"></i>
          </span>
        </a>
      </div>
      <div className="dropdown-menu" id="baseModeOptions" role="menu">
        <div className="dropdown-content">{options}</div>
      </div>
    </div>
  );
}

function AdvancedOptions({ onRadioChange, onSelectChange }) {
  const [active, setActive] = useState(false);
  const handleRadio = (e) => {
    onRadioChange(e.target.value);
  };

  const handleSelect = (e) => {
    onSelectChange(e.target.value);
  };

  const options = Object.entries(RESOLUTION_ARR).map((item, index) => {
    return (
      <option key={index} value={item[0].split(",")[0]}>
        {item[1][0]}x {item[1][1]}, {item[1][2]}fps, {item[1][3]}kbps
      </option>
    );
  });

  return (
    <div className={active ? "dropdown is-active" : "dropdown"}>
      <div className="dropdown-trigger" onClick={() => setActive(!active)}>
        <a
          id="advancedProfile"
          className="ag-rounded button"
          aria-haspopup="true"
          aria-controls="advancedOptions"
        >
          <span>Advanced</span>
        </a>
      </div>
      <div className="dropdown-menu" id="advancedOptions" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <div className="control">
              <label className="radio">
                <input
                  value=""
                  type="radio"
                  name="transcode"
                  onChange={handleRadio}
                />
                <span>VP8-only</span>
              </label>
              <label className="radio">
                <input
                  value="interop"
                  type="radio"
                  defaultChecked
                  onChange={handleRadio}
                  name="transcode"
                />
                <span>VP8 &amp; H264</span>
              </label>
              <label className="radio">
                <input
                  value="h264_interop"
                  type="radio"
                  onChange={handleRadio}
                  name="transcode"
                />
                <span>H264-only</span>
              </label>
            </div>
          </div>
          <div className="dropdown-item">
            <div className="select is-rounded">
              <select
                onChange={handleSelect}
                defaultValue="480p_4"
                id="videoProfile"
                className="ag-rounded is-clipped"
              >
                {options}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
