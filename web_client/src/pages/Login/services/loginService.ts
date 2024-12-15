import endpoints from "../../../constants/endpoints";
import { LoginCredentials } from "../types/LoginCredentials";
import APIClient from "./authApiClient";

export default new APIClient<LoginCredentials>(endpoints.LOGIN);
