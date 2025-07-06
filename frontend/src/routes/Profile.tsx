import {
  Box,
  Card,
  CssBaseline,
  ThemeProvider,
  useColorScheme,
} from "@mui/material";
import { darkTheme, lightTheme } from "../lib/theme";

const Profile = () => {
  const { mode } = useColorScheme();
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "background.default",
          margin: "auto",
          minHeight: "100vh",
          maxWidth: "30rem",
          padding: 4,
          paddingTop: 6,
          position: "relative",
          width: "100%",
        }}
      >
        <Card className="bg-card text-card-foreground flex w-full flex-col gap-4 rounded-2xl border p-6 shadow-md">
          <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">
              Tên người dùng
            </span>
            <span className="text-base font-medium">
              {parsedUser ? parsedUser.name : "Người dùng"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Email</span>
            <span className="text-base font-medium">
              {parsedUser ? parsedUser.email : "useremail"}
            </span>
          </div>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
