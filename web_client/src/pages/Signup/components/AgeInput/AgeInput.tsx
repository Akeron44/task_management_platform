import { IdcardOutlined } from "@ant-design/icons";
import { Input, Form } from "antd";
import { Controller } from "react-hook-form";
import styles from "../../../Login/Login.module.css";
import { SignupCredentials } from "../../services/signupService";
import { SignupInputProps } from "../../types/SignupAuthenticator";
import { SIGNUP_FORM_INPUT } from "../../constants/signupFormField";

function AgeInput({ control, errors }: SignupInputProps) {
  return (
    <Controller
      name={SIGNUP_FORM_INPUT.AGE.name}
      control={control}
      render={({ field }) => (
        <Form.Item<SignupCredentials>
          validateStatus={errors.age ? "error" : ""}
          help={errors?.age?.message}
        >
          <Input
            {...field}
            min={1}
            prefix={<IdcardOutlined className={styles.inputIcon} />}
            onChange={(e) => field.onChange(e.target.valueAsNumber)}
            size="large"
            placeholder={SIGNUP_FORM_INPUT.AGE.placeholder}
            status={errors.age ? "error" : ""}
            className={styles.input}
            type={SIGNUP_FORM_INPUT.AGE.type}
          />
        </Form.Item>
      )}
    ></Controller>
  );
}

export default AgeInput;
