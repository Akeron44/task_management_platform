import { Input, Form } from "antd";
import styles from "../../TaskModal.module.css";
import { Controller } from "react-hook-form";
import { InputProps } from "../../types/InputInterface";
import { FORMINPUT } from "../../../../constants/formFieldConfig";

function DescriptionInput({ control, errors }: InputProps) {
  return (
    <div className={styles.formItemsContainer}>
      <Controller
        name={FORMINPUT.DESCRIPTION.name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={FORMINPUT.DESCRIPTION.label}
            validateStatus={errors.description ? "error" : ""}
            help={errors?.description?.message}
          >
            <Input
              {...field}
              status={errors.description ? "error" : ""}
              value={field.value ? String(field.value) : ""}
              type={"text"}
            />
          </Form.Item>
        )}
      ></Controller>
    </div>
  );
}

export default DescriptionInput;
