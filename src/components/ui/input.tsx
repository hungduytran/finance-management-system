"use client";

import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { cn } from "../../lib/utils";
import visibilityIcon from "/src/assets/visibility-icon.svg";
import visibilityOffIcon from "/src/assets/visibility-off-icon.svg";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
      <div className="relative">
        <input
          type={type === "password" ? (isVisible ? "text" : "password") : type}
          className={cn(
            "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <div className="absolute right-0 bottom-0 z-[1] flex size-[2.625rem] cursor-pointer items-center justify-center">
            <img
              onClick={() => setIsVisible(!isVisible)}
              src={isVisible ? visibilityIcon : visibilityOffIcon}
              alt=""
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
