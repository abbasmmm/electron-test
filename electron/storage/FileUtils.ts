import { dialog } from "electron";
import { mainWindow } from "../main";

export const SelectFolder = async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });
    if (result.canceled) {
        return null;
    }
    return result.filePaths[0];
}