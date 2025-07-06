import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventSharpIcon from "@mui/icons-material/EventSharp";
import ListIcon from "@mui/icons-material/List";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
} from "@mui/material";
import { createTheme, useColorScheme } from "@mui/material/styles";
import { Account } from "@toolpad/core/Account";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import logo from "../assets/logo.png";
import Logout from "../components/authentication/Logout";
import Footer from "../components/Footer";
import CookieService from "../services/CookieService";
import UserService from "../services/UserService";
import Accounts from "./Accounts";
import Budget from "./Budget";
import Calendar from "./Calendar";
import General from "./General";
import Loans from "./Loans";
import Profile from "./Profile";
import Transactions from "./Transactions";

const getUserName = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.name || "Người dùng";
    } catch (error) {
      console.error("Error parsing user data:", error);
      return "Người dùng";
    }
  }
  return "Người dùng";
};

const NAVIGATION: Navigation = [
  {
    segment: "general",
    title: "Tổng quan",
    icon: <DashboardIcon />,
  },
  {
    segment: "transactions",
    title: "Các giao dịch",
    icon: <ListIcon />,
  },
  {
    segment: "accounts",
    title: "Các tài khoản",
    icon: <AccountBalanceIcon />,
  },
  {
    segment: "budget",
    title: "Ngân sách",
    icon: <TimelapseIcon />,
  },
  {
    segment: "loans",
    title: "Các khoản vay",
    icon: <TimerSharpIcon />,
  },
  {
    segment: "calendar",
    title: "Lịch",
    icon: <EventSharpIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "user",
    title: `Xin chào, ${getUserName()}`,
    icon: <PermIdentityOutlinedIcon />,
    children: [
      {
        segment: "profile",
        title: "Thông tin cá nhân",
        icon: <BadgeOutlinedIcon />,
      },
      {
        segment: "change-password",
        title: "Đổi mật khẩu",
        icon: <LockResetOutlinedIcon />,
      },
      {
        segment: "logout",
        title: "Đăng xuất",
        icon: <LogoutOutlinedIcon />,
      },
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 768,
      lg: 1200,
      xl: 1536,
    },
  },
});

function CustomThemeSwitcher() {
  const { setMode } = useColorScheme();

  const handleThemeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setMode(event.target.value as "light" | "dark" | "system");
    },
    [setMode],
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const toggleMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
      setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
    },
    [isMenuOpen],
  );

  return (
    <Fragment>
      <Tooltip title="Settings" enterDelay={1000}>
        <div>
          <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
            <SettingsOutlinedIcon />
          </IconButton>
        </div>
      </Tooltip>
      <Popover
        open={isMenuOpen}
        anchorEl={menuAnchorEl}
        onClose={toggleMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableAutoFocus
      >
        <Box sx={{ p: 2 }}>
          <FormControl>
            <FormLabel id="custom-theme-switcher-label">Theme</FormLabel>
            <RadioGroup
              aria-labelledby="custom-theme-switcher-label"
              defaultValue="system"
              name="custom-theme-switcher"
              onChange={handleThemeChange}
            >
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
              />
              <FormControlLabel
                value="system"
                control={<Radio />}
                label="System"
              />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Popover>
    </Fragment>
  );
}

function CustomToolbarActions() {
  return (
    <Stack direction="row" alignItems="center">
      <CustomThemeSwitcher />
      <Account />
    </Stack>
  );
}

export default function Root() {
  const router = useDemoRouter("/general");

  const renderPageContent = useCallback((pathname: string) => {
    switch (pathname) {
      case "/general":
        return <General />;
      case "/transactions":
        return <Transactions />;
      case "/accounts":
        return <Accounts />;
      case "/budget":
        return <Budget />;
      case "/loans":
        return <Loans />;
      case "/calendar":
        return <Calendar />;
      case "/user/profile":
        return <Profile />;
      case "/user/logout":
        UserService.logout()
          .then(() => {
            window.location.href = "/login";
            localStorage.removeItem("user");
            CookieService.removeCookie("token");
          })
          .catch((error) => {
            console.error("Logout failed:", error);
          });
        return <Logout />;
      default:
        return <General />;
    }
  }, []);

  useEffect(() => {
    const shouldReload = sessionStorage.getItem("reload_once");

    if (shouldReload) {
      sessionStorage.removeItem("reload_once");
      window.location.reload();
    }
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src={logo} alt="Money Lover" />,
        title: "Quản lý tài chính",
      }}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout
        slots={{
          toolbarActions: CustomToolbarActions,
        }}
      >
        <Box>{renderPageContent(router.pathname)}</Box>
        <Footer />
      </DashboardLayout>
    </AppProvider>
  );
}
