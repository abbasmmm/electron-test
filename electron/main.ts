import { app, BrowserWindow, ipcRenderer } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import fs from 'fs';

import { ConfigKeys, PwActions } from './shared/Actions'
import { getConfig, loadCustomStorage } from './storage/ElectronStorage'
import { setupIPC } from './ipcHandlers'
import { setupExpress } from './ExpressSetup'
import { setupGherkinUtils } from './GherkinUtils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

export let mainWindow: BrowserWindow | null

function createWindow() {
  setupIPC()
  setupExpress();
  setupGherkinUtils();
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
