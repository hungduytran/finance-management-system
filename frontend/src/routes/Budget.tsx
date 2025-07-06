import {
  Box,
  Card,
  CssBaseline,
  ThemeProvider,
  useColorScheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import BudgetAddDialog from "../components/budget/BudgetAddDialog";
import BudgetCard from "../components/budget/BudgetCard";
import { darkTheme, lightTheme } from "../lib/theme";
import { cn } from "../lib/utils";
import BudgetService from "../services/BudgetService";
import CategoryService from "../services/CategoryService";
import type { BudgetType } from "../types/budget";

const getBudgets = async () => {
  const res = await BudgetService.getBudgets();
  return res.data.data;
};

const getCategories = async () => {
  const res = await CategoryService.getCategories();
  return res.data.data;
};

const Budget = () => {
  const { mode } = useColorScheme();

  const { data: budgets, refetch } = useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

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
        <h2 className="text-2xl font-bold">Ngân sách</h2>
        <Card className="!rounded-md px-8 py-6">
          {budgets?.map((budget: BudgetType) => (
            <BudgetCard
              key={budget.id}
              data={budget}
              categories={categories}
              onSuccess={refetch}
            />
          ))}
          <p
            className={cn(
              "flex justify-center",
              budgets?.length > 0 ? "hidden" : "flex",
            )}
          >
            Chưa có ngân sách được tạo
          </p>
        </Card>
        <div className="fixed right-12 bottom-4 z-50 space-y-3">
          <BudgetAddDialog categories={categories} onSuccess={refetch} />
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default Budget;
