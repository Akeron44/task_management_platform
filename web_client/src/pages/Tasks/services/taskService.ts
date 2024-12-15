import { Task } from "../types/TaskInterfaces";
import APIClient from "./apiClient";
import endpoints from "../../../constants/endpoints";

export default new APIClient<Task>(endpoints.TASKS);
