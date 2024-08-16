import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express from 'express'
import cors from 'cors'

import { setupIPC } from './ipcHandlers'
import electronDebug from 'electron-debug'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// Create an Express server
const appExpress = express()
appExpress.use(cors())
appExpress.use(express.json());

const port = 12215

// Define a route for the root URL
appExpress.get('/', (req, res) => {
  res.send('Hello from Express!')
})

appExpress.post('/element-clicked', (req, res) => {
  console.log('post method called', req.body);
  const { elementId } = req.body
  console.log('Element clicked:', elementId)
  res.status(200).send('Element click received')
})

// Start the Express server
appExpress.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})

function createWindow() {
  setupIPC()

  // Open a DevTools session for the main process
  electronDebug({ showDevTools: true })

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.webContents.openDevTools()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
