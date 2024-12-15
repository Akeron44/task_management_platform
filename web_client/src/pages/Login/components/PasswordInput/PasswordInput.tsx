import { LockOutlined } from "@ant-design/icons";
import { Input, Form } from "antd";
import { Controller } from "react-hook-form";
import styles from "../../../Login/Login.module.css";
import { LOGIN_FORM_INPUT } from "../../constants/loginFormField";
import {
  LoginCredentials,
  LoginInputProps,
} from "../../types/LoginCredentials";

function PasswordInput({ control, errors }: LoginInputProps) {
  return (
    <Controller
      name={LOGIN_FORM_INPUT.PASSWORD.name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Form.Item<LoginCredentials>
          validateStatus={errors.password ? "error" : ""}
          help={errors?.password?.message}
        >
          <Input.Password
            {...field}
            prefix={<LockOutlined className={styles.inputIcon} />}
            size="large"
            status={errors.password ? "error" : ""}
            placeholder={LOGIN_FORM_INPUT.PASSWORD.placeholder}
            className={styles.input}
          />
        </Form.Item>
      )}
    ></Controller>
  );
}

export default PasswordInput;
