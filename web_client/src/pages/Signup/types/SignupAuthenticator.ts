import { Control, FieldErrors } from "react-hook-form";

export interface SignupAuthentication {
  name: string;
  age: number;
  email: string;
  password: string;
}

export interface SignupInputProps {
  control: Control<SignupAuthentication>;
  errors: FieldErrors<SignupAuthentication>;
}
