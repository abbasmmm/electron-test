import { Box, Button, Divider, IconButton, InputAdornment, InputBase, OutlinedInput, Paper, TextField } from "@mui/material"
import { ConfigKeys, EsActions, PwActions, StorageActions } from "../../electron/shared/Actions"
import { GridSearchIcon } from "@mui/x-data-grid"
import { BrowseGallery, Directions, Folder, Search } from "@mui/icons-material"
import { useEffect, useState } from "react"

export const HomeComponent = () => {
    const [repoPath, setRepoPath] = useState('');

    useEffect(() => {
        (async () => {
            setRepoPath(await window.ipcRenderer.invoke(StorageActions.GetConfig, ConfigKeys.repoPath))
        })()
    }, []);

    return <Box sx={{ p: 2 }}>
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            <TextField sx={{ ml: 1, flex: 1 }}
                label="Select the test repository path" variant="standard" value={repoPath} onChange={(e) => setRepoPath(e.target.value)} // Update state on change
            />

            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={async () => {
                const p = await window.ipcRenderer.invoke(StorageActions.SelectFolder) || repoPath;
                setRepoPath(p);
                await window.ipcRenderer.invoke(StorageActions.SetConfig, ConfigKeys.repoPath, p);
            }}>
                <Folder />
            </IconButton>
        </Paper>

        <Button onClick={async () => {
            await window.ipcRenderer.invoke(PwActions.Test)
        }}>Execute Script</Button>
    </Box>
}