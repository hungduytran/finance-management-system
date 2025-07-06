import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(price)
    .replace(/\s/g, "");
};

export const formatLargeNumber = (value: number): string => {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  } else {
    return value.toString();
  }
};

export const isISODateString = (str: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(str);
};

export const formatISODate = (str: string): string => {
  const date = new Date(str);
  if (isNaN(date.getTime())) return str;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const isTokenValid = (token: string) => {
  if (token) {
    const decodedToken = jwtDecode(token);
    if (!decodedToken) {
      return false;
    }
    const now = new Date();
    if (typeof decodedToken.exp !== "number") {
      return false;
    }
    if (now > new Date(decodedToken.exp * 1000)) {
      return false;
    }
    return true;
  }
  return false;
};

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};
