import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowId,
    GridRowModel,
    GridSlots,
} from '@mui/x-data-grid';
import {
    randomId,
} from '@mui/x-data-grid-generator';
import { ComponentLocatorsModel } from '../../electron/storage/Contract';
import { FormControlLabel, Switch } from '@mui/material';
import { PwActions } from '../../electron/Actions';
import { DebuggerComponent } from './Debugger';


function EditToolbar(props: any) {
    const [checked, setChecked] = React.useState(false);
    return (
        <GridToolbarContainer>

            <Button color="primary" startIcon={<AddIcon />} onClick={props.handleAddClick}>
                Add New Locator
            </Button>
            <FormControlLabel
                control={<Switch checked={checked} color="primary" onChange={e => {
                    setChecked(e.target.checked);
                    props.capture(e.target.checked);
                }} />}
                label="Start Capturing The Locators From Page"
                labelPlacement="start"
            />
        </GridToolbarContainer>
    );
}

interface ComponentLocatorsProps {
    componentLocators: ComponentLocatorsModel;
}
export const LocatorsGrid: React.FC<ComponentLocatorsProps> = ({ componentLocators }) => {
    const [, setComponentLocators] = React.useState(componentLocators);

    const handleDeleteClick = (id: GridRowId) => () => {
        componentLocators.Locators = componentLocators.Locators.filter(locator => locator.id !== id);
        setComponentLocators({ ...componentLocators });
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        try {
            componentLocators.Locators = componentLocators.Locators.map(locator =>
                locator.id === newRow.id ? { ...locator, ...newRow } : locator
            );
        } catch (e) { console.log(e) }

        console.log(componentLocators.Locators);
        setComponentLocators({ ...componentLocators });
        return newRow;
    };

    const handleAddRow = (locator ='') => {
        componentLocators.Locators.push({
            id: randomId(),
            name: '',
            locator: locator
        });
        setComponentLocators({ ...componentLocators });
    };


    const columns: GridColDef[] = [
        // { field: 'id', headerName: 'id', flex: 1 },

        { field: 'name', headerName: 'Name', editable: true, flex: 2 },
        {
            field: 'locator',
            headerName: 'Locator',
            editable: true,
            flex: 2
        },
        {
            field: 'locatorType',
            headerName: 'Locator Type',
            flex: 1
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    const captureSelectors = React.useCallback((event, selector) => {
        handleAddRow(selector)
    }, []); 

    const receiveSelectors = React.useCallback((shouldCapture) => {
        if (shouldCapture) {
            window.ipcRenderer.removeAllListeners(PwActions.LocatorSelected);
            window.ipcRenderer.on(PwActions.LocatorSelected, captureSelectors);  // Add new listener
        } else {
            window.ipcRenderer.removeAllListeners(PwActions.LocatorSelected);
        }
    }, [captureSelectors]);

    return (
        <Box
            sx={{
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={componentLocators.Locators.map((locator) => ({
                    ...locator,
                }))}
                columns={columns}
                editMode="row"
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: { handleAddClick: handleAddRow, capture: receiveSelectors },
                }}

                hideFooter={true}
            />
        </Box>
    );
}
