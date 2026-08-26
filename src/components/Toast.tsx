import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {CheckmarkCircle01Icon,AlertCircleIcon,InformationCircleIcon,Cancel01Icon,} from "@hugeicons/core-free-icons";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  const getIcon = (): ReactNode => {
    switch (type) {
      case "success":
        return (
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon} size={22}
          />
        );

      case "error":
        return (
          <HugeiconsIcon
            icon={AlertCircleIcon} size={22}
          />
        );

      case "warning":
        return (
          <HugeiconsIcon
            icon={AlertCircleIcon} size={22}
          />
        );

      case "info":
        return (
          <HugeiconsIcon
            icon={InformationCircleIcon} size={22}
          />
        );

      default:
        return (
          <HugeiconsIcon
            icon={InformationCircleIcon} size={22}
          />
        );
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>

      <p className="toast-message">
        {message}
      </p>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <HugeiconsIcon
          icon={Cancel01Icon}
          size={18}
        />
      </button>
    </div>
  );
}

export default Toast;