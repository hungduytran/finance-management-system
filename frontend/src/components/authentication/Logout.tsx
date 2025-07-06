import { Box, CssBaseline, ThemeProvider, useColorScheme } from "@mui/material";
import { darkTheme, lightTheme } from "../../lib/theme";
import { cn } from "../../lib/utils";
import CustomLoadingAnimation from "../common/CustomLoadingAnimation";

const Logout = () => {
  const { mode } = useColorScheme();

  if (!mode) {
    return null;
  }
  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          margin: "auto",
          minHeight: "100vh",
          maxWidth: "80rem",
          padding: 4,
          position: "relative",
          width: "100%",
        }}
      >
        <CustomLoadingAnimation
          isLoading
          className={cn(
            "!relative",
            mode === "dark" ? "bg-[#0C0C0C]" : "bg-secondary",
          )}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Logout;
