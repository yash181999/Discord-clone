import React from 'react';
import { Counter } from './features/counter/Counter';
import './App.css';
import Sidebar from './Components/Sidebar';
import Server from './Components/Server';
import ServerChat from './Components/ServerChat';
import MemberList from './Components/MemberList';


function App() {
  return (
    <div className="app">
      <Sidebar/>
      <Server/>
      <ServerChat/>
      <MemberList/>
    </div>
  );
}

export default App;
