import { createContext } from "react";

export interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext =
  createContext<ToastContextType | undefined>(
    undefined,
  );

export default ToastContext;