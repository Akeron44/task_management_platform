import { DatePicker, Form } from "antd";
import styles from "../../TaskModal.module.css";
import { Control, Controller, FieldErrors } from "react-hook-form";
import dayjs from "dayjs";
import { CreateTask } from "../../../../types/TaskInterfaces";
import { FORMINPUT } from "../../../../constants/formFieldConfig";

interface Props {
  control: Control<CreateTask>;
  errors: FieldErrors<CreateTask>;
}

function DateInput({ control, errors }: Props) {
  return (
    <div className={styles.formItemsContainer}>
      <Controller
        name={FORMINPUT.DUEDATE.name}
        control={control}
        render={({ field }) => (
          <Form.Item
            label={FORMINPUT.DUEDATE.label}
            validateStatus={errors.dueDate ? "error" : ""}
            help={errors?.dueDate?.message}
          >
            <DatePicker
              {...field}
              value={field.value ? dayjs(field.value) : null}
              disabledDate={(date) =>
                dayjs(date).isBefore(dayjs().startOf("day"))
              }
              onChange={(date) =>
                field.onChange(date ? date.toISOString() : "")
              }
            />
          </Form.Item>
        )}
      ></Controller>
    </div>
  );
}

export default DateInput;
