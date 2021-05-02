import {
  Avatar,
  Backdrop,
  Button,
  Fade,
  FormControlLabel,
  IconButton,
  makeStyles,
  Modal,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import {
  Add,
  ArrowDropDown,
  ArrowDropDownOutlined,
  Close,
  Headset,
  Mic,
  MicOff,
  VolumeOff,
  VolumeUp,
} from "@material-ui/icons";
import React, { useState } from "react";
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
    backgroundColor: "black",
    color: "white",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 420,
    margin: "auto",
  },
  modalPaper: {
    padding: "10px",
    backgroundColor: "#363a3e",
    outline: "none",
    borderRadius: "10px",
    height: "500px",
    width: "500px",
    textAlign: "center",
    boxShadow: theme.shadows[5],
    "& p": {
      padding: "5px",
      color: "gray",
    },
    "& h3": {
      color: "white",
    },
  },
  closeButton: {
    display: "flex",
    justifyContent: "flex-end",
  },
  addNewServerBtn: {
    borderRadius: "6px",
    border: "1px solid gray",
    marginLeft: "5px",
    marginRight: "5px",
    marginTop: "50px",
    display: "flex",
    padding: "8px",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    "&:hover": {
      background: "#ebebec",
    },
  },
  haveAnInvite: {
    backgroundColor: "transparent",
    padding: "10px",
    marginTop: "50px",
    "& h3": {
      fontWeight: "600",
      userSelect: "none",
    },
    "& button": {
      marginTop: "10px",
      backgroundColor: "#74808d",
      color: "white",
      "&:hover": {
        backgroundColor: "#74808d",
        color: "white",
      },
    },
    "& input": {
      marginTop: "15px",
      width: "98%",
      outline: "none",
      padding: "5px",
      backgroundColor: "#303438",
      color: "white",
      border: "none",
      height: "30px",
      fontSize: "16px",
    },
  },

  serverType: {
    width: "95%",
    display: "flex",
    padding: "10px",
    color: "white",
    marginTop: "30px",
    backgroundColor: "#1f2325",
    borderRadius: "10px",

    "&:hover": {
      backgroundColor: "#2e3236",
    },
  },

  uploadImageContainer: {
    width: "100%",
    display: "grid",
    placeItems: "center",
    marginTop: "20px",
  },
  uploadImage: {
    height: "70px",
    widht: "70px",
    borderRadius: "70px",
    border: "5px dotted gray",
    display: "grid",
    placeItems: "center",
    padding: "10px",
  },
}));

function Server() {
  const classes = useStyles();
  const [openModal, setOpenModal] = React.useState(false);
  const [channeltype, setChannelType] = useState("Text Channel");
  const [mic, setMic] = useState(true);
  const [sound,setSound] = useState(true);
  const [channelName, setChannelName] = useState('');
  let unmute = new Audio("/unmute.mp3");
  let deafen = new Audio('/deafen.mp3')

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleChannelChange = (event) => {
    setChannelType(event.target.value);
  };

  const handleMic = () => {
    unmute.play();
    setMic(!mic)
  }

  const handleSound = () => {
      deafen.play();
      setMic(false);
      setSound(!sound);
  }

  //create channel in a particular server;
  const createChannel = () => {

  }



  return (
    <ServerContainer>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.modalPaper}>
            <>
              <div className={classes.closeButton}>
                <IconButton onClick={handleModalClose}>
                  <Close style={{ color: "white" }}></Close>
                </IconButton>
              </div>

              <h3>Create a Channel</h3>

              <div>
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={channeltype}
                  onChange={handleChannelChange}
                >
                  <div className={classes.serverType}>
                    <FormControlLabel
                      value="Text Channel"
                      control={<Radio style={{ color: "#8fa1e1" }} />}
                      label="# Text Channel"
                    />
                  </div>
                  <div className={classes.serverType}>
                    <FormControlLabel
                      value="Voice Channel"
                      control={<Radio style={{ color: "#8fa1e1" }} />}
                      label="# Voice Channel"
                    />
                  </div>
                </RadioGroup>
              </div>
              <div className={classes.haveAnInvite}>
                <h3>Channel Name</h3>
                <input
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="# Channel Name"
                ></input>
                <Button
                  disabled={!channelName}
                  onClick={createChannel}
                  fullWidth
                >
                  Create Channel
                </Button>
              </div>
            </>
          </div>
        </Fade>
      </Modal>

      <ServerHead>
        <h4>Yash Mehta Server</h4>
      </ServerHead>
      <ServerBody>
        <TextChannels>
          <ChannelHead>
            <div>
              <ArrowDropDownOutlined fontSize="small" />
              <p>TEXT CHANNELS</p>
            </div>
            <IconButton onClick={handleModalOpen}>
              <Add style={{ color: "white" }} fontSize="small" />
            </IconButton>
          </ChannelHead>

          <TextChannel># general</TextChannel>
        </TextChannels>
        <VoiceChannels>
          <ChannelHead>
            <div>
              <ArrowDropDownOutlined fontSize="small" />
              <p>VOICE CHANNELS</p>
            </div>
            <IconButton onClick={handleModalOpen}>
              <Add style={{ color: "white" }} fontSize="small" />
            </IconButton>
          </ChannelHead>
          <VoiceChannel>
            <VolumeUp fontSize="small" /> General
          </VoiceChannel>
        </VoiceChannels>
      </ServerBody>
      <ServerFooter>
        <div>
          <Avatar src="https://icon-library.com/images/yellow-discord-icon/yellow-discord-icon-24.jpg"></Avatar>
          <h4>Name</h4>
        </div>
        <div>
          <IconButton>
            {mic ? (
              <Mic
                onClick={handleMic}
                style={{ color: "#b8bbbe" }}
                fontSize="small"
              />
            ) : (
              <MicOff
                onClick={handleMic}
                style={{ color: "#b8bbbe" }}
                fontSize="small"
              />
            )}
          </IconButton>
          <IconButton>
            {sound ? (
              <VolumeUp
                onClick={handleSound}
                style={{ color: "#b8bbbe" }}
                fontSize="small"
              />
            ) : (
              <VolumeOff
                onClick={handleSound}
                style={{ color: "#b8bbbe" }}
                fontSize="small"
              />
            )}
          </IconButton>
        </div>
      </ServerFooter>
    </ServerContainer>
  );
}

export default Server;

const ServerContainer = styled.div`
  width: 240px;
  background-color: #2e3236;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ServerHead = styled.div`
  color: white;
  height: 59px;
  border-bottom: 1px solid black;
  > h4 {
    padding: 14px;
  }
`;

const ServerBody = styled.div`
  flex: 1;
  overflow: scroll;
`;

const TextChannels = styled.div`
  color: white;
  font-weight: 600;
  > p {
    font-size: 12px;
  }
`;

const VoiceChannels = styled.div``;

const ChannelHead = styled.div`
  color: gray;
  display: flex;
  align-items: center;
  padding-right: 10px;
  margin-left: 5px;
  justify-content: space-between;
  width: 95%;
  margin-top: 10px;
  cursor: pointer;
  > div {
    :hover {
      color: white;
    }
    display: flex;
    font-weight: 600;
    align-items: center;
    > p {
      font-size: 11px;
      user-select: none;
    }
  }
`;

const TextChannel = styled.div`
  margin: 10px;
  border-radius: 8px;
  padding: 10px;
  user-select: none;
  color: gray;
  cursor: pointer;

  :hover {
    background-color: #393d42;
    color: white;
  }
`;

const VoiceChannel = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin: 10px;
  color: gray;
  padding: 10px;
  cursor: pointer;

  :hover {
    background-color: #393d42;
    color: white;
  }
  :focus {
  }
`;

const ServerFooter = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #282c2f;
  justify-content: space-around;
  > div {
    display: flex;
    align-items: center;
    > h4 {
      margin-left: 6px;
      color: white;
    }
  }
`;
