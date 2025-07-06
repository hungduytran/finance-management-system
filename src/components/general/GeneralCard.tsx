import { Card, CardContent, useColorScheme } from "@mui/material";

import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GeneralCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GeneralCard = ({ children, className }: GeneralCardProps) => {
  const { mode } = useColorScheme();
  return (
    <Card
      className={cn(
        "w-full !rounded-xl border-solid transition-all duration-200 hover:cursor-pointer",
        mode === "light"
          ? "border border-gray-300 hover:!shadow-xl"
          : "!shadow-none",
        "scale-100 hover:scale-[1.01]",
      )}
    >
      <CardContent className={className}>{children}</CardContent>
    </Card>
  );
};

export default GeneralCard;
