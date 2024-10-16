import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import UploadUI from "./components/UploadUI";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header isDarkMode={isDarkMode} onThemeChange={setIsDarkMode} />

      <Box
        sx={{
          paddingTop: { xs: "72px", sm: "64px" },
          padding: 2,
          minHeight: "80vh",
        }}
      >
        <Carousel />
        <UploadUI />
      </Box>

      <Footer />
    </ThemeProvider>
  );
}

export default App;
