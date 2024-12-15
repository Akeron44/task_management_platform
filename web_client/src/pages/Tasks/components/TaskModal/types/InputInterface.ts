import { Control, FieldErrors } from "react-hook-form";
import { CreateTask } from "../../../types/TaskInterfaces";

export interface InputProps {
  control: Control<CreateTask>;
  errors: FieldErrors<CreateTask>;
}
