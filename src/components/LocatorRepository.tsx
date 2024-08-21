import { ComponentLocators } from "./ComponentLocators";
import { StorageActions } from "../../electron/Actions";
import { useEffect, useState, useRef } from "react";
import { Box, Button, Fab, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { LocatorRepositoryModal } from "../../electron/storage/Contract";
import { LaunchBrowser } from "./LaunchBrowser";

export const LocatorRepository = () => {
    const [locators, setLocators] = useState<LocatorRepositoryModal | undefined>(undefined);
    const locatorsRef = useRef<LocatorRepositoryModal | undefined>(undefined);

    useEffect(() => {
        // Fetch initial locators and set up interval
        (async () => {
            const initialLocators = await window.ipcRenderer.invoke(StorageActions.GetLocators);
            setLocators(initialLocators);
            locatorsRef.current = initialLocators;

            const intervalId = setInterval(async () => {
                //console.log(locatorsRef.current);
                await window.ipcRenderer.invoke(StorageActions.SetLocators, locatorsRef.current);
            }, 500);

            // Clean up the interval on component unmount
            return () => clearInterval(intervalId);
        })();
    }, []);

    // Update locatorsRef whenever locators change
    useEffect(() => {
        locatorsRef.current = locators;
    }, [locators]);

    return (
        <>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                pb={1}
                m={0}
                gap={2}
            >
                <LaunchBrowser/>
                <Button
                    color="primary"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        if (locators) {
                            const updatedLocators = {
                                ...locators,
                                ComponentLocators: [
                                    ...locators.ComponentLocators,
                                    { ComponentName: 'Provide a name to the page/component', Locators: [] }
                                ]
                            };
                            setLocators(updatedLocators);
                        }
                    }}
                >
                    Add new page/component
                </Button>

            </Box>

            {locators?.ComponentLocators.map((componentLocators, index) => (
                <ComponentLocators key={componentLocators.ComponentName} componentLocators={componentLocators} />
            ))}
        </>
    );
};
