import { formatPrice } from "../../lib/utils";
import GeneralCard from "./GeneralCard";

const CreditCard = () => {
  return (
    <GeneralCard>
      <h3 className="mb-4 text-[0.875rem] font-bold">Thẻ tín dụng</h3>
      <div className="flex flex-row items-center justify-between">
        <span className="text-[1.25rem]">Thẻ tín dụng</span>
        <span className="text-[0.875rem] text-[#F44336]">
          {formatPrice(-1680000)}
        </span>
      </div>
      <div className="mt-1 flex flex-row items-center justify-between">
        <div className="h-[9px] w-[90%] rounded-[4px] bg-[#E9ECEF]">
          <div className="h-full w-[14%] rounded-[4px] bg-[#4CAF50]" />
        </div>
        <span>14%</span>
      </div>
    </GeneralCard>
  );
};

export default CreditCard;
