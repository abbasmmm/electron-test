import { Mail, Notifications, Pets } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PwActions, StorageActions } from "../../../electron/Actions";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    (async () => {
      setUser(await window.ipcRenderer.invoke(StorageActions.GetUserName))
    })()
  }, [])

  function stringAvatar(name: string) {
    return {
      children: `${name.split(' ')[0][0]}`,
    };
  }

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          TEST PILOT
        </Typography>
        <Pets sx={{ display: { xs: "block", sm: "none" } }} />

        <Icons>
          {/* <Badge badgeContent={4} color="primary">
            <Mail />
          </Badge>
          <Badge badgeContent={2} color="secondary">
            <Notifications />
          </Badge> */}
          {/* <Avatar
            sx={{ width: 30, height: 30 }}
            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            onClick={(e) => setOpen(true)}
          /> */}
          <Tooltip title={user}>
            <Avatar {...stringAvatar(user)} />
          </Tooltip>
        </Icons>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={(e) => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
