import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Sidebar from './Layout/Sidebar/Sidebar.jsx'
import Fenster from './Layout/Fenster/Fenster.jsx'

function App() {

  return (
    <div className="app-container">
      <Sidebar />
      <div className="widget-grid">

      </div>
    </div>
  );
}

export default App;
