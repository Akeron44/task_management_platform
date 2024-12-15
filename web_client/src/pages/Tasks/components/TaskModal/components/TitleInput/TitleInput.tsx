import { Input, Form } from "antd";
import styles from "../../TaskModal.module.css";
import { Controller } from "react-hook-form";
import { InputProps } from "../../types/InputInterface";
import { FORMINPUT } from "../../../../constants/formFieldConfig";

function TitleInput({ control, errors }: InputProps) {
  return (
    <div className={styles.formItemsContainer}>
      <Controller
        name={FORMINPUT.TITLE.name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={FORMINPUT.TITLE.label}
            validateStatus={errors.title ? "error" : ""}
            help={errors?.title?.message}
          >
            <Input
              {...field}
              status={errors.title ? "error" : ""}
              value={field.value ? String(field.value) : ""}
              type={FORMINPUT.TITLE.type}
            />
          </Form.Item>
        )}
      ></Controller>
    </div>
  );
}

export default TitleInput;
