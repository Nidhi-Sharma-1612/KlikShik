import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Switch,
  Box,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";

const Logo = styled("img")(({ theme }) => ({
  height: "40px",
  marginRight: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    marginRight: theme.spacing(1),
  },
}));

const Header = ({ onThemeChange, isDarkMode }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleThemeChange = () => {
    onThemeChange(!isDarkMode);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        height: "72px",
        backgroundColor: isDarkMode ? "#333" : "#1976d2",
        zIndex: theme.zIndex.drawer + 1,
        padding: isSmallScreen ? "8px 12px" : "8px 24px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "row" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box display="flex" alignItems="center">
          {/* Logo and Title */}
          <Logo src="/images/klikshik-logo.svg" alt="KlikShik Logo" />
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            sx={{
              color: "#fff",
              fontSize: isSmallScreen ? "1rem" : "1.25rem",
            }}
          >
            KlikShik
          </Typography>
        </Box>

        {/* Dark Mode Toggle */}
        <Box display="flex" alignItems="center">
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              marginRight: isSmallScreen ? 0.5 : 1,
            }}
          >
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </Typography>
          <Switch
            checked={isDarkMode}
            onChange={handleThemeChange}
            size={isSmallScreen ? "small" : "medium"}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
