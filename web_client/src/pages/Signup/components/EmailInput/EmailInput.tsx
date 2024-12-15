import { MailOutlined } from "@ant-design/icons";
import { Input, Form } from "antd";
import { Controller } from "react-hook-form";
import styles from "../../../Login/Login.module.css";
import { SignupCredentials } from "../../services/signupService";
import { SignupInputProps } from "../../types/SignupAuthenticator";
import { SIGNUP_FORM_INPUT } from "../../constants/signupFormField";

function EmailInput({ control, errors }: SignupInputProps) {
  return (
    <Controller
      name={SIGNUP_FORM_INPUT.EMAIL.name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Form.Item<SignupCredentials>
          validateStatus={errors.email ? "error" : ""}
          help={errors?.email?.message}
        >
          <Input
            {...field}
            prefix={<MailOutlined className={styles.inputIcon} />}
            size="large"
            placeholder={SIGNUP_FORM_INPUT.EMAIL.placeholder}
            status={errors.email ? "error" : ""}
            className={styles.input}
          />
        </Form.Item>
      )}
    ></Controller>
  );
}

export default EmailInput;
