import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'
import { Button } from '@mui/material'
import { Actions } from '../electron/Actions'
import Dashboard from './dashboard/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://electron-vite.github.io" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <Button variant="contained" onClick={async () => {
        window.ipcRenderer.send(Actions.SendMessage, "this is a message");
        let val = await window.ipcRenderer.invoke(Actions.SendMessage, "this is a message");
        console.log(val);
      }}>Hello world</Button>

      <Button onClick={()=>{
        window.ipcRenderer.invoke(Actions.LaunchBrowser, 'http://google.com')
      }}>Launch Browser</Button>
      <Button onClick={()=>{
        window.ipcRenderer.invoke(Actions.LaunchBrowser, 'http://instagram.com')
      }}>Insta Browser</Button>

<Button onClick={ async ()=>{
        await window.ipcRenderer.invoke(Actions.LaunchBrowser, 'https://www.saucedemo.com/')
        await window.ipcRenderer.invoke(Actions.Fill, '[data-test="username"]', 'standard_user')
        await window.ipcRenderer.invoke(Actions.Fill, '[data-test="password"]', 'secret_sauce')
        // await window.ipcRenderer.invoke(Actions.Click, '[data-test="login-button"]')


      }}>Sause Demo</Button>

      {/* <Dashboard/> */}
    </>
  )
}

export default App
