import { Avatar, IconButton, Input, TextField } from "@material-ui/core";
import { Add, Send } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
const styles = {
  root: {
    background: "black",
  },
  input: {
    color: "white",
  },
};

function ServerChat() {
  return (
    <ServerChatContainer>
      <ServerChatNav>
        <h3># General</h3>
      </ServerChatNav>
      <Chat>
        <ChatMessages>
          <ChatMessageContainer>
            <Avatar></Avatar>
            <div>
              <h4>Yash Mehta</h4>
              <h6>date</h6>
              <p>
                Message is how are you Message is how are youMessage is how are
                youMessage is how are youMessage is how are youMessage is how
                are you
              </p>
            </div>
          </ChatMessageContainer>
        </ChatMessages>
        <form>
          <ChatInputContainer>
            <IconButton>
              <Add style={{ color: "white" }}></Add>
            </IconButton>
            <TextField
              style={{ flex: 1, color: "white" }}
              InputProps={{
                disableUnderline: true,
                className: "textField__label",
              }}
              id="standard-multiline-flexible"
              multiline
              rowsMax={10}
            />

            <IconButton>
              <Send style={{ color: "white" }}></Send>
            </IconButton>
          </ChatInputContainer>
        </form>
      </Chat>
    </ServerChatContainer>
  );
}

export default ServerChat;

const ServerChatContainer = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
`;

const ServerChatNav = styled.div`
  height: 59px;
  border-bottom: 1px solid black;
  width: 100%;
  display: flex;
  z-index: 100;
  background-color: #363a3e;
  > h3 {
    padding: 16px;
    color: white;
  }
`;

const Chat = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #363a3e;
`;

const ChatInputContainer = styled.div`
  border-radius: 8px;
  background-color: #40454a;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  min-height: 20px;
`;

const ChatMessages = styled.div`
  flex: 0.9;
  display: flex;
  flex-direction: column-reverse;
  max-height: 100vh;
  overflow: auto;
`;

const ChatMessageContainer = styled.div`
  display: flex;
  margin-bottom : 10px;
  margin-top: 10px;
  padding: 5px;
  border-radius : 5px;
  > div {
    margin-left: 10px;
    color : white;
  }
  :hover{
      background-color : #2e3236;
  }
`;
