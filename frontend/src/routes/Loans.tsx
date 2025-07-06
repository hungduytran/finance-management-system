import {
  Box,
  Card,
  CssBaseline,
  TextField,
  ThemeProvider,
  useColorScheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import CreditAddDialog from "../components/loans/CreditAddDialog";
import DebtAddDialog from "../components/loans/DebtAddDialog";
import LoanCard from "../components/loans/LoanCard";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { darkTheme, lightTheme } from "../lib/theme";
import { cn } from "../lib/utils";
import LoanService from "../services/LoanService";
import type { LoanType } from "../types/loans";

const getLoans = async () => {
  const res = await LoanService.getLoans();
  return res.data.data;
};

const Loans = () => {
  const { mode } = useColorScheme();
  const [filter, setFilter] = useState<{
    fromTo: string;
    type: string[];
  }>({
    fromTo: "",
    type: [],
  });

  const { data: loans, refetch } = useQuery({
    queryKey: ["loans"],
    queryFn: getLoans,
  });

  const filteredLoans = useMemo(() => {
    if (!loans) return [];
    return loans.filter((loan: LoanType) => {
      const fromToMatch =
        !filter.fromTo ||
        loan.lenderName?.toLowerCase().includes(filter.fromTo.toLowerCase());
      const typeMatch =
        filter.type.length === 0 || filter.type.includes(loan.type.toLowerCase());
      return fromToMatch && typeMatch;
    });
  }, [loans, filter]);

  if (!mode) {
    return null;
  }

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
            <div className="mt-4 flex flex-col">
              <label htmlFor="input_note" className="text-[0.875rem]">
                Từ / Đến
              </label>
              <TextField
                id="input_note"
                type="text"
                value={filter.fromTo}
                onChange={(e) =>
                  setFilter({ ...filter, fromTo: e.target.value })
                }
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
                  name="debt"
                  id="debt"
                  className="size-[1.125rem] hover:cursor-pointer"
                  checked={filter.type.includes("debt")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilter({
                        ...filter,
                        type: [...filter.type, "debt"],
                      });
                    } else {
                      setFilter({
                        ...filter,
                        type: filter.type.filter((t) => t !== "debt"),
                      });
                    }
                  }}
                />
                <Label className="text-[0.875rem]">Các chi phí</Label>
              </div>
              <div className="mt-2 ml-1 flex flex-row items-center gap-2">
                <Input
                  type="checkbox"
                  name="credit"
                  id="credit"
                  className="size-[1.125rem] hover:cursor-pointer"
                  checked={filter.type.includes("credit")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilter({
                        ...filter,
                        type: [...filter.type, "credit"],
                      });
                    } else {
                      setFilter({
                        ...filter,
                        type: filter.type.filter((t) => t !== "credit"),
                      });
                    }
                  }}
                />
                <Label className="text-[0.875rem]">Thu nhập</Label>
              </div>
            </div>
          </Card>
        </div>
        <div className="grow">
          <Card className="flex flex-col !rounded-lg">
            <div className="space-y-3 px-6 py-3">
              {filteredLoans?.map((loan: LoanType) => (
                <LoanCard key={loan.id} loan={loan} onSuccess={refetch} />
              ))}
              <p
                className={cn(
                  "flex justify-center",
                  filteredLoans?.length > 0 ? "hidden" : "flex",
                )}
              >
                Chưa có khoản vay nào được tạo
              </p>
            </div>
          </Card>
        </div>
        <div className="fixed right-12 bottom-4 z-50 space-y-3">
          <CreditAddDialog onSuccess={refetch} />
          <DebtAddDialog onSuccess={refetch} />
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default Loans;
