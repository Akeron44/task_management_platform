import { Button, Form, Spin } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Signup.module.css";
import { LoadingOutlined } from "@ant-design/icons";
import { schema } from "./helpers/validateForm";
import useSignup from "./hooks/useSignup";
import { SignupCredentials } from "./services/signupService";
import EmailInput from "./components/EmailInput/EmailInput";
import PasswordInput from "./components/PasswordInput/PasswordInput";
import AgeInput from "./components/AgeInput/AgeInput";
import NameInput from "./components/NameInput/NameInput";

function Signup() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignupCredentials>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useSignup();

  const onSubmit = (form: SignupCredentials) => {
    mutate({
      name: form.name,
      email: form.email,
      password: form.password,
      age: form.age,
    });
  };

  return (
    <div className={styles.loginContainer}>
      {isPending && <Spin indicator={<LoadingOutlined />} />}
      <h1 className={styles.title}>Welcome</h1>
      <p className={styles.subtitle}>Create your account</p>

      <form
        name="basic"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <NameInput control={control} errors={errors} />
        <AgeInput control={control} errors={errors} />
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
            Create account
          </Button>
        </Form.Item>
      </form>
    </div>
  );
}

export default Signup;
