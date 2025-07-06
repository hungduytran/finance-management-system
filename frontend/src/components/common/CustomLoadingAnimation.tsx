import { CircularProgress } from "@mui/material";
import { cn } from "../../lib/utils";

interface CustomLoadingAnimationProps {
  isLoading: boolean;
  className?: string;
}

const CustomLoadingAnimation = ({
  isLoading,
  className,
}: CustomLoadingAnimationProps) => {
  return (
    <div
      tabIndex={-1}
      className={cn(
        "fixed top-0 left-0 z-[1000] h-screen w-screen justify-center bg-white/40 pt-[40vh]",
        isLoading ? "flex" : "hidden",
        className,
      )}
    >
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3F85E9" />
            <stop offset="100%" stopColor="#2569DE" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </div>
  );
};

export default CustomLoadingAnimation;
