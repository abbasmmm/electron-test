import Sidebar from "./components/layout/Sidebar";
import { Box, createTheme, GlobalStyles, Paper, Stack, ThemeProvider } from "@mui/material";
import Navbar from "./components/layout/Navbar";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RouterBreadcrumbs from "./components/layout/RouterBreadcrumbs";
import { ManageTests } from "./components/ManageTests";
import { Home } from "@mui/icons-material";
import { HomeComponent } from "./components/Home";
import { LocatorRepository } from "./components/LocatorRepository";


function App() {
  const [mode, setMode] = useState("dark");
  const [collapsed, setCollapsed] = useState(false);

  const darkTheme = createTheme(
    {
      palette: {
        mode: mode as any,
        primary: {
          main: '#b31e30',
        },
      },
    }
  );

  const SidebarWidth = collapsed ? "70px" : "240px"
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles
        styles={{
          /* WebKit Browsers */
          "::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            borderRadius: "10px", /* Rounded edges */
          },
          "::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "10px", /* Rounded edges */
          },
          /* Firefox */
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(100, 100, 100, 0.5) rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      <Box bgcolor={"background.paper"} color={"text.primary"} height="100vh" width="100vw" display="flex" flexDirection="column">
        <Router>

          <Navbar />
          <Stack direction="row" spacing={1} flex={1} overflow="hidden">
            <Box sx={{ width: SidebarWidth, transition: "width 0.3s" }}>
              <Sidebar width={SidebarWidth} key={'' + collapsed} setMode={setMode} mode={mode} collapsed={collapsed} setCollapsed={setCollapsed} />
            </Box>
            <Box flex={1} overflow="auto">

              <Box sx={{ height: '100%', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', p: 0, m: 0 }}>
                <Box sx={{ pt: 3, pl: 3 }}>
                  <RouterBreadcrumbs />
                </Box>
                <Box sx={{
                  flex: 1, boxSizing: 'border-box', p: 1,  overflow: 'auto'
                }}>
                  <Routes>
                    <Route path="/" element={<HomeComponent />} />
                    <Route path="/features" element={<div >features</div>} />
                    <Route path="/manage-tests" element={<ManageTests />} />
                    <Route path="/test-results" element={<div >test-results</div>} />
                    <Route path="/locator-repository" element={<LocatorRepository />} />
                  </Routes>
                </Box>
              </Box>

            </Box>
          </Stack>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
