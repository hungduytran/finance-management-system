import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#757575",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0C0C0C",
      paper: "#121212",
    },
    text: {
      primary: "#F2F2F2",
      secondary: "#B0BEC5",
    },
  },
});
