import { Form, Select } from "antd";
import styles from "../../TaskModal.module.css";
import { Controller } from "react-hook-form";
import { InputProps } from "../../types/InputInterface";
import { FORMINPUT } from "../../../../constants/formFieldConfig";

interface StatusObject {
  name: string;
  value: string;
}

const statuses = [
  {
    name: "Pending",
    value: "PENDING",
  },
  {
    name: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    name: "Completed",
    value: "COMPLETED",
  },
  {
    name: "Cancelled",
    value: "CANCELLED",
  },
];

function StatusSelect({ control, errors }: InputProps) {
  return (
    <div className={styles.formItemsContainer}>
      <Controller
        name={FORMINPUT.STATUS.name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={FORMINPUT.STATUS.label}
            validateStatus={errors.status ? "error" : ""}
            help={errors?.status?.message}
          >
            <Select {...field} value={field.value ? String(field.value) : ""}>
              {statuses.map((option: StatusObject) => (
                <Select.Option key={option.name} value={option.value}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      ></Controller>
    </div>
  );
}

export default StatusSelect;
