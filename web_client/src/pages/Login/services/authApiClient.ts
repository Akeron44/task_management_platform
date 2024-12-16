import axios from "axios";
import { processAxiosError } from "../../../helpers/apiErrorHelper";
import { UserResponse } from "../types/LoginCredentials";
import endpoints from "../../../constants/endpoints";

const axiosInstance = axios.create({
  baseURL: endpoints.BASE_URL,
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  authenticate = async (user: T) => {
    try {
      const response = await axiosInstance.post<UserResponse>(
        this.endpoint,
        user
      );
      return response.data;
    } catch (error) {
      processAxiosError(error);
    }
  };
}

export default APIClient;
