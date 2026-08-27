import {
  useCallback,
  useState,
  type ReactNode,
} from "react";

import ToastContainer, {
  type ToastMessage,
} from "./ToastContainer";

import ToastContext from "../context/ToastContext";

interface ToastProviderProps {
  children: ReactNode;
}

function ToastProvider({
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<
    ToastMessage[]
  >([]);

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
      const id = `${Date.now()}-${Math.random()}`;

      const newToast: ToastMessage = {
        id,
        message,
        type,
      };

      setToasts((currentToasts) => [
        ...currentToasts,
        newToast,
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        removeToast,
      }}
    >
      {children}

      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />
    </ToastContext.Provider>
  );
}

export default ToastProvider;