import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Sidebar />
      <h1>I love beer</h1>
      <img src={beer} width={1000} alt="Beer" />
    </>
  );
}

export default App;
