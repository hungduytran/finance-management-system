import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Box, CssBaseline, ThemeProvider, useColorScheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo, useState } from "react";
import ExpenseDialog from "../components/general/ExpenseDialog";
import IncomeDialog from "../components/general/IncomeDialog";
import TransactionCard from "../components/transactions/TransactionCard";
import { Button } from "../components/ui/button";
import { darkTheme, lightTheme } from "../lib/theme";
import { cn, formatPrice } from "../lib/utils";
import AccountService from "../services/AccountService";
import CategoryService from "../services/CategoryService";
import TransactionService from "../services/TransactionService";
import type { TransactionType } from "../types/transaction";

const getAccount = async () => {
  const res = await AccountService.getAccounts();
  return res.data.data;
};

const getCategories = async () => {
  const res = await CategoryService.getCategories();
  return res.data.data;
};

const getTransactions = async () => {
  const res = await TransactionService.getAllTransactions();
  return res.data.data;
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccount(),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const { data: transactions, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  const dailySummary = useMemo(() => {
    const summary: { [key: string]: { income: number; expense: number } } = {};
    transactions?.forEach((transaction: TransactionType) => {
      const date = format(parseISO(transaction.transactionDate), "yyyy-MM-dd");
      if (!summary[date]) {
        summary[date] = { income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        summary[date].income += transaction.amount;
      } else {
        summary[date].expense += transaction.amount;
      }
    });
    return summary;
  }, [transactions]);

  const header = () => {
    return (
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ArrowBackIosNewOutlinedIcon />
        </Button>
        <span className="text-xl font-semibold">
          {`Tháng ${currentMonth.getMonth() + 1} năm ${currentMonth.getFullYear()}`}
        </span>
        <Button
          variant="ghost"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ArrowForwardIosOutlinedIcon />
        </Button>
      </div>
    );
  };

  const days = () => {
    const dateFormat = "EEEE";
    const days = [];
    const startDate = startOfWeek(currentMonth, { locale: vi });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="col-span-1 py-2 text-center text-sm font-medium"
          key={i}
        >
          {format(addDays(startDate, i), dateFormat, { locale: vi })}
        </div>,
      );
    }
    return (
      <div className="grid grid-cols-7 border-b border-gray-200">{days}</div>
    );
  };

  const cells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: vi });
    const endDate = endOfWeek(monthEnd, { locale: vi });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dateKey = format(cloneDay, "yyyy-MM-dd");
        const summary = dailySummary[dateKey];

        days.push(
          <div
            className={cn(
              "col-span-1 flex h-24 cursor-pointer flex-col border border-gray-200 p-2",
              !isSameMonth(day, currentMonth) ? "text-[#9E9E9E]" : "",
              isSameDay(day, selectedDate) ? "bg-blue-600/80" : "",
            )}
            key={day.toISOString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="text-sm font-semibold">{formattedDate}</span>
            <div className="flex flex-grow flex-col items-end justify-end text-xs">
              {summary && summary.income > 0 && (
                <span className="text-green-600">
                  +{formatPrice(summary.income)}
                </span>
              )}
              {summary && summary.expense > 0 && (
                <span className="text-red-600">
                  -{formatPrice(summary.expense)}
                </span>
              )}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="border border-gray-200">{rows}</div>;
  };

  const selectedDayTransactions = useMemo(() => {
    return transactions?.filter((transaction: TransactionType) =>
      isSameDay(parseISO(transaction.transactionDate), selectedDate),
    );
  }, [transactions, selectedDate]);

  const selectedDayIncome = selectedDayTransactions?.reduce(
    (sum: number, t: TransactionType) =>
      t.type === "INCOME" ? sum + t.amount : sum,
    0,
  );
  const selectedDayExpense = selectedDayTransactions?.reduce(
    (sum: number, t: TransactionType) =>
      t.type === "EXPENSE" ? sum + t.amount : sum,
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
        <div className="space-y-4">
          <div
            className={cn(
              "bg-card rounded-lg p-4 shadow-md",
              mode === "dark" ? "dark" : "",
            )}
          >
            {header()}
            {days()}
            {cells()}
          </div>

          <div
            className={cn(
              "bg-card rounded-lg p-4 shadow-md",
              mode === "dark" ? "dark" : "",
            )}
          >
            <h3 className="mb-2 text-lg font-semibold">
              {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}
            </h3>
            <div className="mb-4 flex justify-between text-sm">
              <span>Thu nhập: {formatPrice(selectedDayIncome)}</span>
              <span>Chi phí: {formatPrice(selectedDayExpense)}</span>
            </div>
            {selectedDayTransactions?.length > 0 ? (
              <div className="space-y-2">
                {selectedDayTransactions?.map(
                  (transaction: TransactionType) => (
                    <TransactionCard
                      accounts={accounts}
                      categories={categories}
                      data={transaction}
                      onSuccess={refetch}
                    />
                  ),
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Không tìm thấy giao dịch
              </p>
            )}
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
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default Calendar;
