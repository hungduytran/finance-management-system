import { cn } from "../../lib/utils";
import type { TransactionType } from "../../types/transaction";
import GeneralCard from "./GeneralCard";
import TransactionCard from "./TransactionCard";

interface TransactionsProps {
  transactions: TransactionType[];
}

const Transactions = ({ transactions }: TransactionsProps) => {
  return (
    <GeneralCard>
      <h3 className="mb-4 text-[0.875rem] font-bold">Các giao dịch</h3>
      <div className="space-y-3">
        {transactions &&
          transactions
            ?.slice(0, 5)
            .map((transaction) => (
              <TransactionCard key={transaction.id} data={transaction} />
            ))}
        <p
          className={cn(
            "flex justify-center",
            transactions?.length > 0 ? "hidden" : "flex",
          )}
        >
          Không tìm thấy giao dịch
        </p>
      </div>
    </GeneralCard>
  );
};

export default Transactions;
