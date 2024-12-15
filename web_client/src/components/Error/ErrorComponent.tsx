import { Alert, Button } from "antd";
import styles from "./ErrorComponent.module.css";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../../helpers/localStorageHelper";

interface Props {
  message: string;
}

function ErrorComponent({ message }: Props) {
  const navigate = useNavigate();

  return (
    <section
      onClick={(e) => e.stopPropagation()}
      className={styles["error_section"]}
    >
      <div className={styles["error_container"]}>
        <Alert
          message="Error"
          description={message}
          type="error"
          showIcon
          action={
            message.toLocaleLowerCase().includes("unauthorized") && (
              <Button
                onClick={() => {
                  clearLocalStorage();
                  navigate("/login");
                }}
              >
                Log in
              </Button>
            )
          }
        />
      </div>
    </section>
  );
}

export default ErrorComponent;
