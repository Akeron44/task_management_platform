import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import TaskCard from '../../../src/pages/Tasks/components/TaskCard/TaskCard'
import { Modal } from 'antd'
import { Task } from '../../../src/pages/Tasks/types/TaskInterfaces';

vi.mock('../../../src/pages/Tasks/hooks/useDeleteTask', () => ({
    default: () => ({
        mutate: vi.fn(),
        isPending: false
    })
}));

vi.mock('../../../src/pages/Tasks/components/EditTaskModal/EditTaskModal', () => ({
    default: ({ isModalOpen }: { isModalOpen: boolean }) => 
        isModalOpen ? <div data-testid="edit-modal">Edit Modal</div> : null
}));

vi.mock('antd', () => ({
    Modal: {
        confirm: vi.fn(),
    },
    Button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

vi.mock('@ant-design/icons', () => ({
    EditOutlined: () => 'EditIcon',
    DeleteOutlined: () => 'DeleteIcon',
    CalendarOutlined: () => 'CalendarIcon',
}));

describe('TaskCard Component', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING' as const,
        priority: 'HIGH' as const,
        dueDate: new Date('2024-12-31'),
        createdAt: new Date('2024-01-01'),
        myTask: true,
    };

    it('should render task details correctly', () => {
        render(<TaskCard {...mockTask} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('HIGH')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText(/Created: Jan 1, 2024/)).toBeInTheDocument();
        expect(screen.getByText(/Deadline: Dec 31, 2024/)).toBeInTheDocument();
    });

    it('should not show action buttons when myTask is false', () => {
        render(<TaskCard {...mockTask} myTask={false} />);
        
        expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('should format dates correctly', () => {
        const dates = {
            ...mockTask,
            createdAt: new Date('2024-01-15'),
            dueDate: new Date('2024-06-30'),
        };

        render(<TaskCard {...dates} />);

        expect(screen.getByText(/Created: Jan 15, 2024/)).toBeInTheDocument();
        expect(screen.getByText(/Deadline: Jun 30, 2024/)).toBeInTheDocument();
    });
});
