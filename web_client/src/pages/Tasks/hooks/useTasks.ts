import { keepPreviousData, useQuery } from "@tanstack/react-query";
import queryKeys from "../../../constants/queryKeys";
import { TasksResponse } from "../types/TaskInterfaces";
import taskService from "../services/taskService";

export interface QueryParams {
  priority: string[];
  status: string[];
  dueDateStart?: string;
  dueDateEnd?: string;
  sortBy?: string;
  sort?: string;
  myTasks: boolean;
  take?: number;
  skip?: number;
}

const useTasks = (query: QueryParams, page: number) => {
  const pageSize = 10;

  return useQuery<TasksResponse | undefined, Error>({
    queryKey: [queryKeys.TASKS, query, page],
    queryFn: () =>
      taskService.getAllTasks({
        priority: query.priority,
        status: query.status,
        dueDateStart: query.dueDateStart,
        dueDateEnd: query.dueDateEnd,
        sort: query.sort,
        sortBy: query.sortBy,
        myTasks: query.myTasks,
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
    staleTime: 1000,
    placeholderData: keepPreviousData,
  });
};

export default useTasks;
