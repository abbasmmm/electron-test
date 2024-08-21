import { ipcMain } from "electron"
import { EsActions, PwActions, StorageActions } from "./Actions";
import { Fill, GoTo, Click, LaunchBrowser, Test } from "./pw/PlaywrightUtils";
import os from 'os'
import { GetUserName } from "./MiscUtils";
import { getConfig, getLocators, setConfig, setLocators } from "./storage/ElectronStorage";
import { SelectFolder } from "./storage/FileUtils";
import { ExecuteMethod, LoadScript } from "./scripts/ScriptLoader";

const handlers = new Map<string, any>([
    [PwActions.LaunchBrowser, GoTo],
    [PwActions.Fill, Fill],
    [PwActions.Click, Click],
    [PwActions.Test, Test],

    [StorageActions.GetUserName, GetUserName],
    [StorageActions.GetLocators, getLocators],
    [StorageActions.SetLocators, setLocators],
    [StorageActions.GetConfig, getConfig],
    [StorageActions.SetConfig, setConfig],
    [StorageActions.SelectFolder, SelectFolder],

    [EsActions.LoadScript, LoadScript],
    [EsActions.ExecuteMethod, ExecuteMethod]
]);

export const setupIPC = () => {
    handlers.forEach((handler, eventName: string) => {
        ipcMain.handle(eventName, async (e, ...data) => handler(...data));
    });
}