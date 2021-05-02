import { Avatar } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";

function MemberList() {
  return (
    <MemeberListContainer>
      <Header>
        <div>
          <input placeholder="search" />
          <Search fontSize="small"></Search>
        </div>
      </Header>
      <Members>
        <Member>
          <Avatar src="https://icon-library.com/images/yellow-discord-icon/yellow-discord-icon-24.jpg" />
          <h4>Yash Mehta</h4>
        </Member>
      </Members>
    </MemeberListContainer>
  );
}

export default MemberList;

const MemeberListContainer = styled.div`
  background-color: #2e3236;
  width: 230px;

  height: 100vh;
`;

const Header = styled.div`
  height: 59px;
  display: flex;
  align-items: center;
  background-color: #363a3e;

  > div {
    margin-left: 20px;
    background-color: #1f2325;
    align-items: center;
    display: flex;
    padding: 5px;
    height: 14px;
    border-radius: 5px;
    > input {
      background-color: transparent;
      color: white;
      border: none;
      outline: none;
    }
    > .MuiSvgIcon-root {
      color: gray;
    }
  }
`;

const Members = styled.div`
  padding-left: 20px;
  overflow: auto;
  height: 100vh;
`;

const Member = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 10px;
  align-items: center;
  > h4 {
    margin-left: 12px;
    color: white;
  }
`;
