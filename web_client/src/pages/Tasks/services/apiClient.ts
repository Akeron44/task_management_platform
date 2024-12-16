import axios from "axios";
import { processAxiosError } from "../../../helpers/apiErrorHelper";
import {
  CreateTask,
  Task,
  EditTask,
  TasksResponse,
} from "../types/TaskInterfaces";
import endpoints from "../../../constants/endpoints";
import { QueryParams } from "../hooks/useTasks";
import { TaskStats } from "../types/StatsInterface";

const axiosInstance = axios.create({
  baseURL: endpoints.BASE_URL,
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getToken = () => {
    return JSON.parse(localStorage.getItem("token") || "");
  };

  getAllTasks = async ({
    priority,
    status,
    dueDateStart,
    dueDateEnd,
    sort,
    sortBy,
    myTasks,
    take,
    skip,
  }: QueryParams) => {
    try {
      const token = this.getToken();
      const response = await axiosInstance.get<TasksResponse>(this.endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          priority,
          status,
          dueDateStart,
          dueDateEnd,
          sort: sort,
          sortBy: sortBy,
          myTasks: myTasks,
          take: take,
          skip: skip,
        },
      });

      return response.data;
    } catch (error) {
      processAxiosError(error);
    }
  };

  getTask = async (id: string | undefined) => {
    try {
      const token = this.getToken();
      const response = await axiosInstance.get<Task>(`${this.endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      processAxiosError(error);
    }
  };

  getTasksStatistics = async ({
    priority,
    status,
    dueDateStart,
    dueDateEnd,
    myTasks,
  }: QueryParams) => {
    try {
      const token = this.getToken();
      const response = await axiosInstance.get<TaskStats>(
        `${this.endpoint}/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            priority,
            status,
            dueDateStart,
            dueDateEnd,
            myTasks: myTasks,
          },
        }
      );

      return response.data;
    } catch (error) {
      processAxiosError(error);
    }
  };

  createTask = async (data: CreateTask) => {
    try {
      const token = this.getToken();
      const response = await axiosInstance.post<T>(this.endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      processAxiosError(error);
    }
  };

  editTask = async (taskId: string, data: EditTask) => {
    try {
      const token = this.getToken();
      const response = await axiosInstance.patch<T>(
        `${this.endpoint}/${taskId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      processAxiosError(error);
    }
  };

  deleteTask = async (taskId: string) => {
    try {
      const token = this.getToken();
      const response = await axiosInstance.delete<T>(
        `${this.endpoint}/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      processAxiosError(error);
    }
  };
}

export default APIClient;
