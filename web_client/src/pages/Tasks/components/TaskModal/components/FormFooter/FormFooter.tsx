import { Button, Form } from "antd";
import styles from "./FormFooter.module.css";

interface Props {
  taskId?: string;
  closeModal: () => void;
}

function FormFooter({ taskId, closeModal }: Props) {
  return (
    <Form.Item label={null} className={styles.buttonGroup}>
      <Button
        typeof="click"
        type="primary"
        danger
        onClick={closeModal}
        className={`${styles.button} ${styles.cancelButton}`}
      >
        Cancel
      </Button>
      <Button
        type="primary"
        htmlType="submit"
        className={`${styles.button} ${styles.submitButton}`}
      >
        {!taskId ? "Create Task" : "Save Changes"}
      </Button>
    </Form.Item>
  );
}

export default FormFooter;
