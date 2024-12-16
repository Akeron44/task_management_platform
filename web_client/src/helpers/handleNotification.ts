import { notification } from "antd";

interface NotificationProps {
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
}

export const openNotification = ({
  type,
  title,
  message,
}: NotificationProps): void => {
  notification[type]({
    message: title,
    description: message,
  });
};
