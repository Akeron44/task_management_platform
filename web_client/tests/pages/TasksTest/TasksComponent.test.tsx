import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import TasksComponent from '../../../src/pages/Tasks/components/TasksComponent/TasksComponents'

// At the top of the file
const mockTasksHook = vi.hoisted(() => ({
    default: vi.fn()
}));

vi.mock('../../../src/pages/Tasks/hooks/useTasks', () => mockTasksHook);

vi.mock('../../../src/pages/Tasks/hooks/useGetTasksStats', () => ({
    default: () => ({
        data: {
            total: 1,
            byStatus: {
                PENDING: 1,
                IN_PROGRESS: 0,
                COMPLETED: 0,
                CANCELLED: 0,
            },
            byPriority: {
                LOW: 0,
                MEDIUM: 0,
                HIGH: 1,
            },
        },
        error: null,
        isLoading: false,
    })
}));

// Mock the store
vi.mock('../../../../store/useTaskFilters', () => ({
    useTaskFilters: () => ({
        filters: {
            priority: [],
            status: [],
            dueDate: null,
        },
        sortConfig: {
            field: 'none',
            order: 'none',
        },
    })
}));

// Mock the components
vi.mock('../TaskCard/TaskCard', () => ({
    default: (props: any) => (
        <div data-testid="task-card">
            {props.title}
        </div>
    )
}));

vi.mock('../../../../components/Empty/EmptyComponent', () => ({
    default: ({ message }: any) => (
        <div data-testid="empty-state">{message}</div>
    )
}));

vi.mock('../../../../components/Error/ErrorComponent', () => ({
    default: ({ message }: any) => (
        <div data-testid="error-component">{message}</div>
    )
}));

// Mock antd components
vi.mock('antd', () => ({
    Spin: ({ children }: any) => <div data-testid="spinner">{children}</div>,
    Pagination: ({ current, total, onChange }: any) => (
        <div data-testid="pagination">
            <button onClick={() => onChange(current - 1)}>Previous</button>
            <span>Page {current} of {Math.ceil(total / 10)}</span>
            <button onClick={() => onChange(current + 1)}>Next</button>
        </div>
    )
}));

describe('TasksComponent', () => {
    beforeEach(() => {
        mockTasksHook.default.mockReturnValue({
            data: {
                tasks: [
                    {
                        id: '1',
                        title: 'Test Task',
                        description: 'Test Description',
                        priority: 'HIGH',
                        status: 'PENDING',
                        dueDate: new Date('2024-12-31'),
                        createdAt: new Date('2024-01-01'),
                    },
                ],
                total: 1,
            },
            error: null,
            isLoading: false,
        });
    });


    it('should render loading state', () => {
        mockTasksHook.default.mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        });

        render(<TasksComponent myTasks={true} />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
});
