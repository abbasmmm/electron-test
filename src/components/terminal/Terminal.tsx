import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import CommandRunner from './CommandRunner';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TerminalComponent() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Build Custom Steps" {...a11yProps(0)} />
          <Tab label="Run Tests" {...a11yProps(1)} />
          <Tab label="Install" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CommandRunner button={'Build'} command={'run watch:js'} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CommandRunner button={'Tests'} command={'run e2e:test-and-publish'} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <CommandRunner button={'Install'} command={'install --verbose'} />
      </CustomTabPanel>
    </Box>
  );
}

export default TerminalComponent;