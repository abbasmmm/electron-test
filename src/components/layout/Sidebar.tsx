import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Article,
  Home,
  ModeNight,
  LightMode,
  Menu,
  ChevronLeft,
  History,
  PrecisionManufacturing,
  LocationSearching,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme
} from "@mui/material";

const Sidebar = ({ mode, setMode, collapsed, setCollapsed, width }) => {
  const location = useLocation(); // Get the current route
  const theme = useTheme(); // Use theme for dynamic styling

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box flex={1} >
      <Box position="fixed" sx={{ width: width, elevation: 10,
                  boxShadow: 10, height: '100vh' }}>
        <List className="list-class">
          {[
            { text: '', icon: collapsed ? <Menu /> : <ChevronLeft />, onclick: toggleCollapse },
            { text: "Home", icon: <Home />, path: "/" },
            { text: "Features", icon: <Article />, path: "/features" },
            { text: "Manage Tests", icon: <PrecisionManufacturing />, path: "/manage-tests" },
            { text: "Locator Repository", icon: <LocationSearching />, path: "/locator-repository" },
            { text: "Test Results", icon: <History />, path: "/test-results" },
            {
              text: mode === "light" ? 'Dark Mode' : 'Light Mode',
              icon: mode === "light" ? <ModeNight /> : <LightMode />,
              onclick: () => setMode(mode === "light" ? "dark" : "light")
            }
          ].map((item, index) => (
            <ListItem disablePadding key={collapsed + index}>
              <ListItemButton
                sx={{
                  px: 3,
                  py: 2,
                  backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'transparent', // Highlight active item
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover // Highlight on hover
                  }
                }}
                component={item.path ? Link : 'a'}
                to={item.path}
                onClick={item.onclick}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  {collapsed ? (
                    <Tooltip title={item.text} placement="right">
                      {item.icon}
                    </Tooltip>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {!collapsed && <ListItemText sx={{ pl: 3 }} primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
