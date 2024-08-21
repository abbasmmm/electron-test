import { IconButton, InputBase, Paper } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { ConfigKeys, PwActions, StorageActions } from "../../electron/Actions";
import { useEffect, useState } from "react";


export const LaunchBrowser = () => {
    const [url, setUrl] = useState('')

    useEffect(() => {
        (async () => {
            setUrl(await window.ipcRenderer.invoke(StorageActions.GetConfig, ConfigKeys.url))
        })()
    }, [])

    return <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >

        <InputBase
            sx={{ ml: 1, flex: 1 }}
            
            placeholder="URL"
            inputProps={{ 'aria-label': 'search google maps' }}
            value={url}
            onChange={(e) => {
                setUrl(e.target.value)
                window.ipcRenderer.invoke(StorageActions.SetConfig, ConfigKeys.url, e.target.value);
            }}
        />
        <IconButton type="button" sx={{ p: '5px' }} aria-label="search" onClick={async () => {
            const ensureProtocol = (url) => {
                // Check if the URL starts with a protocol
                if (!/^(https?:\/\/)/i.test(url)) {
                    // Prepend 'http://' if no protocol is found
                    return `http://${url}`;
                }
                return url;
            };

            const urlupdated = ensureProtocol(url); // Replace 'yourUrl' with the actual URL variable

            await window.ipcRenderer.invoke(PwActions.LaunchBrowser, urlupdated);
            await window.ipcRenderer.invoke(PwActions.Fill, '[data-test="username"]', 'standard_user')
            await window.ipcRenderer.invoke(PwActions.Fill, '[data-test="password"]', 'secret_sauce')
        }}>
            <GridSearchIcon />
        </IconButton>
    </Paper>
}