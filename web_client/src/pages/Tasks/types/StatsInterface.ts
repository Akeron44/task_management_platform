interface StatusCounts {
  PENDING: number;
  IN_PROGRESS: number;
  COMPLETED: number;
  CANCELLED: number;
}

interface PriorityCounts {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
}

export interface TaskStats {
  total: number;
  byStatus: StatusCounts;
  byPriority: PriorityCounts;
}
