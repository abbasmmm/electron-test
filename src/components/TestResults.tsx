import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography, Box, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ConfigKeys, StorageActions, TestResultActions } from "../../electron/shared/Actions";
import { Fullscreen, FullscreenExit, Maximize, Minimize } from "@mui/icons-material";

export const TestResults = () => {
    const [repoPath, setRepoPath] = useState<string | undefined>(undefined);
    const [folders, setFolders] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [selectedReport, setSelectedReport] = useState({ cucumberReport: '', report: '' });
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

    useEffect(() => {
        (async () => {
            setRepoPath(await window.ipcRenderer.invoke(StorageActions.GetConfig, ConfigKeys.repoPath));
            const results = await window.ipcRenderer.invoke(TestResultActions.GetResultsList);
            setFolders(results);
        })();
    }, []);

    const handleChange = (panel: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        if (isExpanded) {
            setSelectedReport(await window.ipcRenderer.invoke(TestResultActions.GetReports, panel))
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {folders.map((folder) => (
                <Accordion
                    key={folder}
                    expanded={expanded === folder}
                    onChange={handleChange(folder)}
                    sx={{ mb: 1 }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`${folder}-content`}
                        id={`${folder}-header`}
                    >
                        <Typography>{folder}</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            height: isFullscreen ? '100vh' : '50vh', // Adjust height based on fullscreen state
                            width: isFullscreen ? '100vw' : 'auto', // Adjust width for fullscreen
                            position: isFullscreen ? 'fixed' : 'relative', // Position fixed for fullscreen
                            top: isFullscreen ? 0 : 'auto',
                            left: isFullscreen ? 0 : 'auto',
                            zIndex: isFullscreen ? 9999 : 'auto', // Bring fullscreen element to the front
                            overflow: 'hidden', // Prevent overflow issues
                            p: isFullscreen? 0: 'auto'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end', // Align to the end horizontally
                                padding: '10px', // Optional padding
                                backgroundColor: '#1e1e1e', // Optional background color
                                borderTop: '1px solid #444', // Optional border
                            }}
                        >
                            <Button style={{ cursor: 'pointer' }} onClick={toggleFullscreen}>
                                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                            </Button>
                        </Box>
                        <iframe
                            src={`http://localhost:12215/reports/${expanded}/report`}
                            style={{
                                width: '100%',
                                height: 'calc(100% - 80px)',
                                border: 'none'
                            }}
                        ></iframe>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};
