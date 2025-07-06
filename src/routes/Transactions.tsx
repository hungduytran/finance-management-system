import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import {
  Box,
  Card,
  Checkbox,
  CssBaseline,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  useColorScheme,
  type SelectChangeEvent,
  type Theme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import ExpenseDialog from "../components/general/ExpenseDialog";
import IncomeDialog from "../components/general/IncomeDialog";
import TransactionCard from "../components/transactions/TransactionCard";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { icons } from "../data/icons";
import { darkTheme, lightTheme } from "../lib/theme";
import { cn, formatPrice } from "../lib/utils";
import AccountService from "../services/AccountService";
import CategoryService from "../services/CategoryService";
import TransactionService from "../services/TransactionService";
import type { CategoryType } from "../types/category";
import type { TransactionType } from "../types/transaction";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (
  name: string,
  categoryId: string[],
  theme: Theme,
  categories: CategoryType[],
) => {
  return {
    fontWeight: categoryId.includes(
      categories.find((c: CategoryType) => c.name === name)?.id?.toString() ||
        "",
    )
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

const getAccount = async () => {
  const res = await AccountService.getAccounts();
  return res.data.data;
};

const getCategories = async () => {
  const res = await CategoryService.getCategories();
  return res.data.data;
};

const getTransactions = async (month: number, year: number) => {
  const res = await TransactionService.getTransactions(month, year);
  return res.data.data;
};

const Transactions = () => {
  const { mode } = useColorScheme();
  const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
  const [note, setNote] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    [],
  );
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccount(),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const { data: transactions, refetch } = useQuery({
    queryKey: ["transactions", month, year],
    queryFn: () => getTransactions(month, year),
  });

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions
      .filter((t: TransactionType) => {
        if (categoryFilter.length === 0) return true;
        return categoryFilter.includes(t.category.id);
      })
      .filter((t: TransactionType) => {
        if (note === "") return true;
        return t.description?.toLowerCase().includes(note.toLowerCase());
      })
      .filter((t: TransactionType) => {
        if (typeFilter.length === 0) return true;
        return typeFilter.includes(t.type);
      });
  }, [transactions, categoryFilter, note, typeFilter]);

  const totalAmount = useMemo(() => {
    if (!filteredTransactions) return 0;
    const targetTransactions =
      selectedTransactions.length > 0
        ? filteredTransactions.filter((t: TransactionType) =>
            selectedTransactions.includes(t.id),
          )
        : filteredTransactions;
    return targetTransactions.reduce((acc: number, curr: TransactionType) => {
      if (curr.type === "EXPENSE") {
        return acc - curr.amount;
      }
      return acc + curr.amount;
    }, 0);
  }, [selectedTransactions, filteredTransactions]);

  if (!mode) {
    return null;
  }

  const handleCategoryFilterChange = (
    event: SelectChangeEvent<typeof categoryFilter>,
  ) => {
    const {
      target: { value },
    } = event;
    setCategoryFilter(
      typeof value === "string"
        ? value.split(",").map(Number)
        : (value as number[]),
    );
  };

  const handleTypeFilterChange = (type: "EXPENSE" | "INCOME") => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTransactions(
        filteredTransactions?.map((t: TransactionType) => t.id) || [],
      );
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (id: number) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "row",
          gap: 4,
          margin: "0 auto",
          maxWidth: "80rem",
          minHeight: "100vh",
          padding: 4,
          position: "relative",
          width: "100%",
        }}
      >
        <div className="w-[15rem]">
          <Card className="!rounded-lg px-4 pt-3 pb-6">
            <h2 className="text-center text-[1.4rem] font-semibold">BỘ LỌC</h2>
            <div className="flex flex-col">
              <label htmlFor="input_category" className="text-[0.875rem]">
                Hạng mục
              </label>
              <Select
                id="input_category"
                displayEmpty
                multiple
                MenuProps={MenuProps}
                onChange={handleCategoryFilterChange}
                value={categoryFilter}
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Tất cả"
                    : selected
                        .map((value) => {
                          const category = categories?.find(
                            (cat: CategoryType) => cat.id === value,
                          );
                          return category ? category.name : "";
                        })
                        .join(", ")
                }
                sx={{
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px",
                  },
                }}
              >
                {categories?.map((category: CategoryType) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                    sx={{
                      padding: "8px 16px",
                      display: "flex",
                      gap: "16px",
                      flexGrow: 1,
                    }}
                    style={getStyles(
                      category.name,
                      categoryFilter.map(String),
                      mode === "light" ? lightTheme : darkTheme,
                      categories || [],
                    )}
                  >
                    <img
                      src={icons[category.image]}
                      alt="blank icon"
                      className="size-[40px] rounded-full select-none"
                    />
                    <span>{category.name}</span>
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="mt-4 flex flex-col">
              <label htmlFor="input_note" className="text-[0.875rem]">
                Ghi chú
              </label>
              <TextField
                id="input_note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px",
                  },
                }}
              />
            </div>
            <div className="mt-2">
              <span className="text-[0.875rem]">Loại</span>
              <div className="ml-1 flex flex-row items-center gap-2">
                <Input
                  type="checkbox"
                  name="expense"
                  id="expense"
                  className="size-[1.125rem] hover:cursor-pointer"
                  onChange={() => handleTypeFilterChange("EXPENSE")}
                  checked={typeFilter.includes("EXPENSE")}
                />
                <Label htmlFor="expense" className="text-[0.875rem]">
                  Các chi phí
                </Label>
              </div>
              <div className="mt-2 ml-1 flex flex-row items-center gap-2">
                <Input
                  type="checkbox"
                  name="income"
                  id="income"
                  className="size-[1.125rem] hover:cursor-pointer"
                  onChange={() => handleTypeFilterChange("INCOME")}
                  checked={typeFilter.includes("INCOME")}
                />
                <Label htmlFor="income" className="text-[0.875rem]">
                  Thu nhập
                </Label>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex grow flex-col gap-8">
          <Card className="flex flex-row justify-between !rounded-lg px-6 py-3">
            <button
              className={cn("", "hover:cursor-pointer")}
              onClick={() => {
                if (month === 1) {
                  setMonth(12);
                  setYear(year - 1);
                } else {
                  setMonth(month - 1);
                }
              }}
            >
              <ArrowBackIosNewOutlinedIcon />
            </button>
            <span className="text-2xl font-medium">{`Tháng ${month} năm ${year}`}</span>
            <button
              className={cn("", "hover:cursor-pointer")}
              onClick={() => {
                if (month === 12) {
                  setMonth(1);
                  setYear(year + 1);
                } else {
                  setMonth(month + 1);
                }
              }}
            >
              <ArrowForwardIosOutlinedIcon />
            </button>
          </Card>
          <Card className="flex flex-col !rounded-lg">
            <div className="flex flex-row justify-between border-b border-solid px-6 py-3">
              <div className="flex flex-row items-center gap-4">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={
                    !!(
                      filteredTransactions &&
                      filteredTransactions.length > 0 &&
                      selectedTransactions.length ===
                        filteredTransactions.length
                    )
                  }
                />
                <span className="text-[1.25rem] text-[#6c757d]">
                  Các giao dịch:{" "}
                  {selectedTransactions.length > 0
                    ? selectedTransactions.length
                    : filteredTransactions?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[1.25rem]">
                <span>Tổng cộng: </span>
                <span
                  className={cn(
                    "font-medium",
                    totalAmount >= 0 ? "text-[#4CAF50]" : "text-[#F44336]",
                  )}
                >
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
            <div className="px-6 py-3">
              <div className="space-y-3">
                {filteredTransactions?.map((transaction: TransactionType) => (
                  <TransactionCard
                    key={transaction.id}
                    data={transaction}
                    accounts={accounts}
                    categories={categories}
                    onSelect={() => handleSelectTransaction(transaction.id)}
                    isSelected={selectedTransactions.includes(transaction.id)}
                    onSuccess={refetch}
                  />
                ))}
                <p
                  className={cn(
                    "flex justify-center text-base",
                    filteredTransactions?.length > 0 ? "hidden" : "flex",
                  )}
                >
                  Không tìm thấy giao dịch
                </p>
              </div>
            </div>
          </Card>
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

export default Transactions;
