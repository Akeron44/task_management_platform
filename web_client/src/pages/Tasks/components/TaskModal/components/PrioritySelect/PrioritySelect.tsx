import { Form, Select } from "antd";
import styles from "../../TaskModal.module.css";
import { Controller } from "react-hook-form";
import { InputProps } from "../../types/InputInterface";
import { FORMINPUT } from "../../../../constants/formFieldConfig";

const priorities = ["Low", "Medium", "High"];

function PrioritySelect({ control, errors }: InputProps) {
  return (
    <div className={styles.formItemsContainer}>
      <Controller
        name={FORMINPUT.PRIORITY.name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={FORMINPUT.PRIORITY.label}
            validateStatus={errors.priority ? "error" : ""}
            help={errors?.priority?.message}
          >
            <Select {...field} value={field.value ? String(field.value) : ""}>
              {priorities.map((option: string) => (
                <Select.Option key={option} value={option.toLocaleUpperCase()}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      ></Controller>
    </div>
  );
}

export default PrioritySelect;
