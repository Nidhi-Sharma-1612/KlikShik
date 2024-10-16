import React from "react";
import { Box, Typography, Link, useMediaQuery } from "@mui/material";
import { useTheme, styled } from "@mui/system";

const FooterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "16px",
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#1976d2",
  color: "#fff",
  marginTop: "32px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    textAlign: "center",
    gap: "8px",
  },
}));

const Footer = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FooterContainer>
      <Typography
        variant={isSmallScreen ? "body2" : "body1"}
        component="p"
        sx={{ flexGrow: 1 }}
      >
        © {new Date().getFullYear()} KlikShik. All rights reserved.
      </Typography>

      <Box display="flex" gap={2}>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "#fff", fontSize: isSmallScreen ? "0.875rem" : "1rem" }}
        >
          Terms of Service
        </Link>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "#fff", fontSize: isSmallScreen ? "0.875rem" : "1rem" }}
        >
          Privacy Policy
        </Link>
      </Box>
    </FooterContainer>
  );
};

export default Footer;
