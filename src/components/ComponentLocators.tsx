import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, makeStyles, TextField } from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { ComponentLocatorsModel } from "../../electron/storage/Contract";
import { LocatorsGrid } from './LocatorsGrid';
interface ComponentLocatorsProps {
    componentLocators: ComponentLocatorsModel;
}


export const ComponentLocators: React.FC<ComponentLocatorsProps> = ({ componentLocators }) => {
    // const [, setComponentLocators] = React.useState(componentLocators);

    const [pageName, setPageName] = useState(componentLocators.ComponentName);
    const [pageLocator, setPageLocator] = useState(componentLocators.ComponentLocator);
    return (
        <Accordion>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                {pageName}
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ width: '100%' }}>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        pb={2}
                        gap={3}
                    >
                        <TextField
                            label="Component/Page Name" variant="standard"
                            value={pageName}
                            onChange={e => {
                                componentLocators.ComponentName = e.target.value
                                setPageName(e.target.value)
                            }}
                            sx={{ width: 400 }} />

                        <TextField
                            label="Component/Page Locator" variant="standard"
                            value={pageLocator}
                            onChange={e => {
                                componentLocators.ComponentLocator = e.target.value
                                setPageLocator(e.target.value)
                            }}
                            sx={{ width: 350 }} />
                    </Box>
                    <LocatorsGrid componentLocators={componentLocators} />
                </div>
            </AccordionDetails>
        </Accordion>
    );
};
