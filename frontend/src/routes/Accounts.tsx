import {
  Box,
  Card,
  CssBaseline,
  ThemeProvider,
  useColorScheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import AccountAddDialog from "../components/accounts/AccountAddDialog";
import AccountCard from "../components/accounts/AccountCard";
import { darkTheme, lightTheme } from "../lib/theme";
import { cn, formatPrice } from "../lib/utils";
import AccountService from "../services/AccountService";
import type { AccountType } from "../types/accounts";

const getAccounts = async () => {
  const res = await AccountService.getAccounts();
  return res.data.data;
};

const Accounts = () => {
  const { data: accounts, refetch } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: 10000,
  });

  const totalBalance = accounts?.reduce(
    (sum: number, account: AccountType) => sum + account.balance,
    0,
  );
  const { mode } = useColorScheme();
  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          margin: "0 auto",
          maxWidth: "60rem",
          minHeight: "100vh",
          padding: 4,
          position: "relative",
          width: "100%",
        }}
      >
        <h2 className="text-2xl font-bold">Danh sách tài khoản</h2>
        <p className="text-[1.25rem]">
          Tổng cộng:{" "}
          <span
            className={cn(
              "font-semibold",
              totalBalance >= 0 ? "text-[#4CAF50]" : "text-[#F44336]",
            )}
          >
            {formatPrice(totalBalance)}
          </span>
        </p>
        <div className="space-y-4">
          {accounts?.map((account: AccountType) => (
            <AccountCard
              key={account.id}
              account={account}
              onSuccess={refetch}
            />
          ))}
          <Card
            className={cn(
              "flex justify-center !rounded-md py-6",
              accounts?.length > 0 ? "hidden" : "flex",
            )}
          >
            Chưa có tài khoản nào được tạo
          </Card>
        </div>
        <div className="fixed right-12 bottom-4 z-50 space-y-3">
          <AccountAddDialog onSuccess={refetch} />
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default Accounts;
