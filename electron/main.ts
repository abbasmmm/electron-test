import { app, BrowserWindow, ipcRenderer } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express from 'express'
import cors from 'cors'

import { setupIPC } from './ipcHandlers'
import { PwActions } from './Actions'
import { loadCustomStorage } from './storage/ElectronStorage'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

export let mainWindow: BrowserWindow | null

// Create an Express server
const appExpress = express()
appExpress.use(cors())
appExpress.use(express.json());

const port = 12215;

// Define a route for the root URL
appExpress.get('/', (req, res) => {
  res.send('Hello from Express!')
})

appExpress.post('/element-clicked', (req, res) => {
  const { selector } = req.body;
  mainWindow.webContents.send(PwActions.LocatorSelected, selector);

  console.log('Element selected:', selector)
  res.status(200).send('Selection received')
})


// Start the Express server
appExpress.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})

function createWindow() {
  setupIPC()
  loadCustomStorage(app.getAppPath())
  // Open a DevTools session for the main process
  // electronDebug({ showDevTools: true })
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'test-pilot.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },

  })

  mainWindow.maximize();

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // win.webContents.openDevTools()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
