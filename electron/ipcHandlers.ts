import { ipcMain } from "electron"
import { Actions } from "./Actions";
// import { LaunchBrowser } from "./PlaywrightUtils";

// const handlers = new Map<string,any> ();
// handlers.set(Actions.LaunchBrowser, LaunchBrowser);

export const setupIPC= ()=>{
    
    ipcMain.on(Actions.SendMessage, (event, data) => {
        console.log('From MAIN', data);
    })

    ipcMain.handle(Actions.SendMessage, (e, args)=>{
        console.log(e, args);
        return "Message returned from main process";
    })    

    ipcMain.handle(Actions.LaunchBrowser, async (event, args) => {
        const { LaunchBrowser } = await import('./PlaywrightUtils.js');
        return await LaunchBrowser();
    });
}