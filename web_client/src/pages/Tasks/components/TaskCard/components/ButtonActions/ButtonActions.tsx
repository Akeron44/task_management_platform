import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Spin } from "antd";
import styles from "./ButtonActions.module.css";

interface Props {
  openModal: () => void;
  deleteEvent: () => void;
  isLoading: boolean;
}

function ButtonActions({ openModal, deleteEvent, isLoading }: Props) {
  return (
    <div className={styles.actions}>
      <Button
        type="text"
        icon={<EditOutlined />}
        className={styles.actionButton}
        onClick={openModal}
      />
      <Button
        type="text"
        disabled={isLoading}
        icon={
          !isLoading ? (
            <DeleteOutlined />
          ) : (
            <Spin indicator={<LoadingOutlined />} />
          )
        }
        className={styles.actionButton}
        onClick={deleteEvent}
        danger
      />
    </div>
  );
}

export default ButtonActions;
