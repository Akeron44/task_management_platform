import { Input, Form } from "antd";
import styles from "../../../Login/Login.module.css";
import { Controller } from "react-hook-form";
import { SignupInputProps } from "../../types/SignupAuthenticator";
import { SIGNUP_FORM_INPUT } from "../../constants/signupFormField";
import { SignupCredentials } from "../../services/signupService";
import { UserOutlined } from "@ant-design/icons";

function NameInput({ control, errors }: SignupInputProps) {
  return (
    <Controller
      name={SIGNUP_FORM_INPUT.NAME.name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Form.Item<SignupCredentials>
          validateStatus={errors.name ? "error" : ""}
          help={errors?.name?.message}
        >
          <Input
            {...field}
            prefix={<UserOutlined className={styles.inputIcon} />}
            size="large"
            placeholder={SIGNUP_FORM_INPUT.NAME.placeholder}
            status={errors.name ? "error" : ""}
            className={styles.input}
          />
        </Form.Item>
      )}
    ></Controller>
  );
}

export default NameInput;
