import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ConfigKeys, StorageActions } from '../../../electron/shared/Actions';
import AnsiToHtml from 'ansi-to-html';
import Typography from '@mui/material/Typography';

const ansiConvert = new AnsiToHtml();


const CommandRunner = ({ command, button }) => {
    const [repoPath, setRepoPath] = useState();
    const [output, setOutput] = useState('');
    const [outputEventName, setOutputEventName] = useState('npm-output-' + button);
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        (async () => {
            setRepoPath(await window.ipcRenderer.invoke(StorageActions.GetConfig, ConfigKeys.repoPath))
        })()
    }, []);

    useEffect(() => {
        const handleOutput = (event, output, isProcessStopped) => {
            setOutput((prev) => prev + ansiConvert.toHtml(output));
            setIsStarted(!isProcessStopped);
        };

        window.ipcRenderer.send('npm-command-logs', outputEventName);
        window.ipcRenderer.on(outputEventName, handleOutput);

        // Cleanup on component unmount
        return () => {
            window.ipcRenderer.off(outputEventName, handleOutput);
        };
    }, []);

    const handleRunCommand = () => {
        if (!isStarted) {
            setIsStarted(true);
            setOutput('');
            window.ipcRenderer.send('run-npm-command', outputEventName, command.trim(), repoPath);
        }
        else {
            setIsStarted(false);
            window.ipcRenderer.send('stop-npm-command', outputEventName, command.trim(), repoPath);
        }
    };

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);
    const outputRef = useRef(null);


    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <Button sx={{width: 150}} variant="contained" onClick={handleRunCommand}>
                    {isStarted ? 'STOP' : 'RUN'} {button}
                </Button>
                <Box
                    sx={{
                        backgroundColor: '#1e1e1e',
                        color: '#f0f0f0',
                        padding: '10px',
                        height: '400px',
                        fontFamily: 'Courier New, monospace',
                        borderRadius: '4px',
                        border: '1px solid #444',
                    }}
                >
                    <Typography
                        component="pre"
                        dangerouslySetInnerHTML={{ __html: output }}
                        ref={outputRef} // Attach the ref to the Typography component
                        style={{ maxHeight: '400px', overflowY: 'auto' }} // Ensure it's scrollable
                    />
                </Box>
            </Box>
        </>
    );
};

export default CommandRunner;
