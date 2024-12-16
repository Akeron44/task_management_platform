import { LockOutlined } from "@ant-design/icons";
import { Input, Form } from "antd";
import { Controller } from "react-hook-form";
import styles from "../../../Login/Login.module.css";
import { SignupCredentials } from "../../services/signupService";
import { SignupInputProps } from "../../types/SignupAuthenticator";
import { SIGNUP_FORM_INPUT } from "../../constants/signupFormField";

function PasswordInput({ control, errors }: SignupInputProps) {
  return (
    <Controller
      name={SIGNUP_FORM_INPUT.PASSWORD.name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Form.Item<SignupCredentials>
          validateStatus={errors.password ? "error" : ""}
          help={errors?.password?.message}
        >
          <Input.Password
            {...field}
            prefix={<LockOutlined className={styles.inputIcon} />}
            size="large"
            status={errors.password ? "error" : ""}
            placeholder={SIGNUP_FORM_INPUT.PASSWORD.placeholder}
            className={styles.input}
          />
        </Form.Item>
      )}
    ></Controller>
  );
}

export default PasswordInput;
