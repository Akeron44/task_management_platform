import { FilterValues } from "../../../layout/AppLayout/components/FilterModal/FilterModal";
import { SortValues } from "../../../layout/AppLayout/components/SortModal/SortModal";
import { Task } from "../types/TaskInterfaces";

const priorityOrder = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const getFilteredAndSortedTasks = (
  tasks: Task[] | undefined,
  filters: FilterValues,
  sortConfig: SortValues
): Task[] => {
  if (!tasks) return [];

  let results = tasks ? [...tasks] : [];

  if (filters.priority.length) {
    results = results.filter((task) =>
      filters.priority.includes(task.priority)
    );
  }

  if (filters.status.length) {
    results = results.filter((task) => filters.status.includes(task.status));
  }

  if (filters.dueDate && filters.dueDate[0] && filters.dueDate[1]) {
    const [startDate, endDate] = filters.dueDate;
    results = results.filter((task) => {
      const taskDate = new Date(task.dueDate!);
      return taskDate >= new Date(startDate) && taskDate <= new Date(endDate);
    });
  }

  results.sort((a, b) => {
    switch (sortConfig.field) {
      case "priority":
        return sortConfig.order === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      case "status":
        return sortConfig.order === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      case "dueDate":
        return sortConfig.order === "asc"
          ? new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
          : new Date(b.dueDate!).getTime() - new Date(a.dueDate!).getTime();
      default:
        return 0;
    }
  });

  return results;
};
