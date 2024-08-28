import { ipcMain } from "electron";
import { ConfigKeys, TestResultActions } from "./shared/Actions";
import fs from 'fs';
import { getConfig } from "./storage/ElectronStorage";
import path from "path";

export const setupTestResultUtils = () => {
    ipcMain.handle(TestResultActions.GetResultsList, async () => getResultsList());
    ipcMain.handle(TestResultActions.GetReports, async (event, folder) => {
        const dir = await getConfig(ConfigKeys.repoPath);
        const report = path.join(dir as any, 'results', folder, 'report.html');
        const cucumberReport = path.join(dir as any, 'results', folder, 'cucumber-report.html');

        return { report: fs.readFileSync(report).toString(), cucumberReport: fs.readFileSync(cucumberReport).toString() }
    })
}

export const getResultsList = async () => {
    const dir = await getConfig(ConfigKeys.repoPath);
    const folderPath = path.join(dir as any, 'results');

    const folders = fs.readdirSync(folderPath);

    // Sort folders by descending datetime
    const sortedFolders = folders.sort((a, b) => {
        return b.localeCompare(a); // Descending order
    });

    return sortedFolders;
};