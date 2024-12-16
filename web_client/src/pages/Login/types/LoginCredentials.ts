import { Control, FieldErrors } from "react-hook-form";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserResponse {
  age: number;
  email: string;
  id: number;
  name: string;
  token: string;
}

export interface LoginInputProps {
  control: Control<LoginCredentials>;
  errors: FieldErrors<LoginCredentials>;
}
