import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, makeStyles, TextField } from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { ComponentLocatorsModel } from "../../../electron/storage/Contract";
import { LocatorsGrid } from './LocatorsGrid';
interface ComponentLocatorsProps {
    componentLocators: ComponentLocatorsModel;
    expand: boolean,
    onExpanded: any
}


export const ComponentLocators: React.FC<ComponentLocatorsProps> = ({ componentLocators, expand, onExpanded }) => {
    // const [, setComponentLocators] = React.useState(componentLocators);

    const [url, setUrl] = useState(componentLocators.Url);
    const [pageName, setPageName] = useState(componentLocators.ComponentName);
    const [pageLocator, setPageLocator] = useState(componentLocators.ComponentLocator);
    return (
        <Accordion expanded={expand} onChange={() => onExpanded(!expand)}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />} >
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
                            label="Url" variant="standard"
                            value={url}
                            onChange={e => {
                                componentLocators.Url = e.target.value
                                setUrl(e.target.value)
                            }}
                            sx={{ width: 400 }} />

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
                    <LocatorsGrid expanded={expand} componentLocators={componentLocators} />
                </div>
            </AccordionDetails>
        </Accordion>
    );
};
