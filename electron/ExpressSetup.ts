import path from 'node:path'
import express from 'express'
import cors from 'cors'
import fs from 'fs';

import { ConfigKeys, PwActions } from './shared/Actions'
import { getConfig } from './storage/ElectronStorage'
import { mainWindow } from './main'

export const setupExpress = () => {
    // Create an Express server
    const appExpress = express()
    appExpress.use(cors())
    appExpress.use(express.json());

    const port = 12215;

    appExpress.use(express.static(path.join(__dirname, 'path/to/your/folder')));

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

    appExpress.get('/reports/:folder/:reportType', async (req, res) => {
        const { folder, reportType } = req.params;
        const dir = await getConfig(ConfigKeys.repoPath) as any;
        const filePath = path.join(dir, 'results', folder, `${reportType}.html`);

        console.log(filePath);
        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File does not exist
                res.status(404).send('Report not found');
            } else {
                // Read and send the file content
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        // Error reading the file
                        res.status(500).send('Error reading report');
                    } else {
                        // Send the file content as response
                        res.send(data);
                    }
                });
            }
        });
    });

    // Start the Express server
    appExpress.listen(port, () => {
        console.log(`Express server is running on http://localhost:${port}`)
    })

}