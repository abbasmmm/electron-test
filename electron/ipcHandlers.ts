import { ipcMain } from "electron"
import { Actions } from "./Actions";
import { Fill, GoTo,Click, LaunchBrowser } from "./PlaywrightUtils";

const handlers = new Map<string, any>([
    [Actions.LaunchBrowser, GoTo],
    [Actions.Fill, Fill],
    [Actions.Click, Click]

]);

export const setupIPC = () => {

    ipcMain.on(Actions.SendMessage, (event, data) => {
        console.log('From MAIN', data);
    })

    ipcMain.handle(Actions.SendMessage, (e, args) => {
        console.log(e, args);
        return "Message returned from main process";
    })

    handlers.forEach((handler, eventName: string) => {
        ipcMain.handle(eventName, async (e, ...data) => handler(...data));
    });
}