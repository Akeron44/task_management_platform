import { MailOutlined } from "@ant-design/icons";
import { Input, Form } from "antd";
import { Controller } from "react-hook-form";
import {
  LoginCredentials,
  LoginInputProps,
} from "../../types/LoginCredentials";
import styles from "../../Login.module.css";
import { LOGIN_FORM_INPUT } from "../../constants/loginFormField";

function EmailInput({ control, errors }: LoginInputProps) {
  return (
    <Controller
      name={LOGIN_FORM_INPUT.EMAIL.name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Form.Item<LoginCredentials>
          validateStatus={errors.email ? "error" : ""}
          help={errors?.email?.message}
        >
          <Input
            prefix={<MailOutlined className={styles.inputIcon} />}
            size="large"
            placeholder={LOGIN_FORM_INPUT.EMAIL.placeholder}
            status={errors.email ? "error" : ""}
            className={styles.input}
            {...field}
          />
        </Form.Item>
      )}
    ></Controller>
  );
}

export default EmailInput;
