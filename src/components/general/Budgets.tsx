import { useQuery } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import BudgetService from "../../services/BudgetService";
import type { BudgetType } from "../../types/budget";
import BudgetCard from "./BudgetCard";
import GeneralCard from "./GeneralCard";

const getBudgets = async () => {
  const res = await BudgetService.getBudgets();
  return res.data.data;
};

const Budgets = () => {
  const { data: budgets } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
  });
  return (
    <GeneralCard>
      <h3 className="mb-4 text-[0.875rem] font-bold">Ngân sách</h3>
      <div className="space-y-4">
        {budgets &&
          budgets
            ?.slice(0, 3)
            .map((budget: BudgetType) => (
              <BudgetCard key={budget.id} data={budget} />
            ))}
        <p
          className={cn(
            "flex justify-center",
            budgets?.length > 0 ? "hidden" : "flex",
          )}
        >
          Không tìm thấy ngân sách
        </p>
      </div>
    </GeneralCard>
  );
};

export default Budgets;
