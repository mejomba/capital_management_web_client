import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import { CurrencySwitch } from "./CurrencySwitch";
import { NAV_ITEMS } from "./navItems";

const DRAWER_WIDTH = 240;

export function AppLayout() {
  const { logout } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // On desktop the drawer is persistent and pushes content; on mobile it is a
  // temporary overlay. Both are toggled by the same hamburger button.
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = () => (isDesktop ? setDesktopOpen((v) => !v) : setMobileOpen((v) => !v));

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === "/"}
              onClick={() => !isDesktop && setMobileOpen(false)}
              sx={{ "&.active": { bgcolor: "action.selected", fontWeight: 700 } }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: "background.paper" }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={toggle} aria-label="باز و بسته کردن منو">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            مدیریت سرمایه
          </Typography>
          <CurrencySwitch />
          <Tooltip title="خروج">
            <IconButton onClick={logout} aria-label="خروج">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Mobile: temporary overlay drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop: persistent drawer that pushes content. The root always
          reserves DRAWER_WIDTH; when closed the paper slides out and the main's
          negative margin reclaims the space (canonical MUI persistent pattern). */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={desktopOpen}
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minWidth: 0,
          transition: theme.transitions.create("margin"),
          // RTL: the persistent drawer sits on the right; reclaim its reserved
          // space when it is closed.
          mr: { md: desktopOpen ? 0 : `-${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
