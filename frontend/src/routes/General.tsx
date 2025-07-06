import { Box, CssBaseline, ThemeProvider, useColorScheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Accounts from "../components/general/Accounts";
import Balance from "../components/general/Balance";
import Budgets from "../components/general/Budgets";
import DebtsAndCredits from "../components/general/DebtsAndCredits";
import ExpenseDialog from "../components/general/ExpenseDialog";
import IncomeDialog from "../components/general/IncomeDialog";
import OverView from "../components/general/OverView";
import PreviousMonth from "../components/general/PreviousMonth";
import ThisMonth from "../components/general/ThisMonth";
import Transactions from "../components/general/Transactions";
import WeeklySummary from "../components/general/WeeklySummary";
import { darkTheme, lightTheme } from "../lib/theme";
import AccountService from "../services/AccountService";
import CategoryService from "../services/CategoryService";
import TransactionService from "../services/TransactionService";

const getAccount = async () => {
  const res = await AccountService.getAccounts();
  return res.data.data;
};

const getTransactions = async () => {
  const res = await TransactionService.getTransactions(
    new Date().getMonth() + 1,
    new Date().getFullYear(),
  );
  return res.data.data;
};

const getPreviousMonthTransactions = async () => {
  const res = await TransactionService.getTransactions(
    new Date().getMonth(),
    new Date().getFullYear(),
  );
  return res.data.data;
};

const getCategories = async () => {
  const res = await CategoryService.getCategories();
  return res.data.data;
};

const getBalance = async () => {
  const res = await AccountService.getChart();
  return res.data.data;
};

const getWeeklySummaryData = async () => {
  const res = await TransactionService.getWeeklySummary();
  return res.data.data;
};

const General = () => {
  const { mode } = useColorScheme();
  const { data: accounts, refetch: refetchAccount } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccount(),
  });
  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });
  const {
    data: previousMonthTransactions,
    refetch: refetchPreviousMonthTransactions,
  } = useQuery({
    queryKey: ["previous_month_transactions"],
    queryFn: () => getPreviousMonthTransactions(),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const { data: balance, refetch: refetchBalance } = useQuery({
    queryKey: ["balance"],
    queryFn: () => getBalance(),
  });
  const { data: weeklySummaryData, refetch: refetchWeeklySummaryData } =
    useQuery({
      queryKey: ["weeklySummary"],
      queryFn: () => getWeeklySummaryData(),
    });

  if (!mode) {
    return null;
  }

  const refetch = () => {
    refetchAccount();
    refetchTransactions();
    refetchPreviousMonthTransactions();
    refetchBalance();
    refetchWeeklySummaryData();
  };

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          padding: 4,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          className={clsx(
            "grid w-full max-w-[80rem] grid-cols-1 gap-4",
            "xl:grid-cols-3 xl:gap-8",
          )}
        >
          <OverView accounts={accounts} />
          <ThisMonth data={transactions} />
          <PreviousMonth transactions={previousMonthTransactions} />
        </div>

        <div
          className={clsx(
            "mt-4 grid w-full max-w-[80rem] grid-cols-1 gap-4",
            "xl:mt-8 xl:gap-8 2xl:grid-cols-2",
          )}
        >
          <div className="w-full space-y-6">
            <Accounts accounts={accounts} />
            <WeeklySummary weeklySummaryData={weeklySummaryData} />
            <Transactions transactions={transactions} />
          </div>
          <div className="w-full space-y-6">
            <Balance data={balance} />
            <Budgets />
            <DebtsAndCredits />
          </div>
        </div>
        <div className="fixed right-12 bottom-4 z-50 space-y-3">
          <IncomeDialog
            accounts={accounts}
            categories={categories}
            onSuccess={refetch}
          />
          <ExpenseDialog
            accounts={accounts}
            categories={categories}
            onSuccess={refetch}
          />
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default General;

export const UpArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="#4CAF50"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 15.75 7.5-7.5 7.5 7.5"
      />
    </svg>
  );
};

export const DownArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="#F44336"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
};
