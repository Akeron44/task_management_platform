export const FORMINPUT = {
  TITLE: {
    name: "title" as const,
    label: "Title",
    type: "text",
  },
  DESCRIPTION: {
    name: "description" as const,
    label: "Description",
    type: "text",
  },
  STATUS: {
    name: "status" as const,
    label: "Status",
    type: "select",
  },
  PRIORITY: {
    name: "priority" as const,
    label: "Priority",
    type: "select",
  },
  DUEDATE: {
    name: "dueDate" as const,
    label: "Deadline",
    type: "Date",
  },
};
