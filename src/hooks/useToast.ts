import { useCallback, useState } from "react";
import type { ToastMessage } from "../components/ToastContainer";

function useToast() {
  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  const removeToast = useCallback(
    (id: string) => {
      setToasts((currentToasts) =>
        currentToasts.filter(
          (toast) => toast.id !== id,
        ),
      );
    },
    [],
  );

  const showToast = useCallback(
    (
      message: string,
      type:
        | "success"
        | "error"
        | "info"
        | "warning" = "success",
    ) => {
      const id =
        `${Date.now()}-${Math.random()}`;

      const newToast: ToastMessage = {
        id,
        message,
        type,
      };

      setToasts((currentToasts) => [
        ...currentToasts,
        newToast,
      ]);

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast],
  );

  return {
    toasts,
    showToast,
    removeToast,
  };
}

export default useToast;