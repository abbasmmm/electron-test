import React, { useCallback } from 'react';
import { PwActions } from '../../electron/shared/Actions';

export const DebuggerComponent = () => {
    const captureSelectors = useCallback((event, selector) => {
        console.log('captureSelectors function called with selector:', selector);
        alert(selector);
    }, []);

    const receiveSelectors = useCallback((shouldCapture) => {
        if (shouldCapture) {
            console.log('Turning on');
            console.log('captureSelectors reference:', captureSelectors);
            
            window.ipcRenderer.off(PwActions.LocatorSelected, captureSelectors);
            window.ipcRenderer.on(PwActions.LocatorSelected, captureSelectors);
        } else {
            console.log('Turning off');
            console.log('captureSelectors reference:', captureSelectors);
            window.ipcRenderer.removeAllListeners(PwActions.LocatorSelected);

            // window.ipcRenderer.off(PwActions.LocatorSelected, captureSelectors);
        }
    }, [captureSelectors]);

    return (
        <div>
            <button onClick={() => receiveSelectors(true)}>Start Capture</button>
            <button onClick={() => receiveSelectors(false)}>Stop Capture</button>
        </div>
    );
};

