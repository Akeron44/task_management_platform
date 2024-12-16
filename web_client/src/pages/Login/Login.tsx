import { Button, Form, Spin } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Login.module.css";
import { LoadingOutlined } from "@ant-design/icons";
import { LoginCredentials } from "./types/LoginCredentials";
import { schema } from "./helpers/validateForm";
import useLogin from "./hooks/useLogin";
import EmailInput from "./components/EmailInput/EmailInput";
import PasswordInput from "./components/PasswordInput/PasswordInput";

function Login() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginCredentials>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useLogin();

  const onSubmit = (form: LoginCredentials) => {
    mutate({ email: form.email, password: form.password });
  };

  return (
    <div className={styles.loginContainer}>
      {isPending && <Spin indicator={<LoadingOutlined />} />}
      <h1 className={styles.title}>Welcome Back</h1>
      <p className={styles.subtitle}>Sign in to your account</p>

      <form
        name="basic"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <EmailInput control={control} errors={errors} />
        <PasswordInput control={control} errors={errors} />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            size="large"
            block
          >
            Sign In
          </Button>
        </Form.Item>
      </form>
    </div>
  );
}

export default Login;
