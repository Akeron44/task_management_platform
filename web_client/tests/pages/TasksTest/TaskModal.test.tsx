import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import TaskModal from '../../../src/pages/Tasks/components/TaskModal/TaskModal'
import { CreateTask } from '../../../src/pages/Tasks/types/TaskInterfaces'

vi.mock('../../../src/pages/Tasks/hooks/useCreateTask', () => ({
    default: (closeModal: () => void) => ({
        mutate: vi.fn(closeModal),
        isPending: false
    })
}));

vi.mock('../../../src/pages/Tasks/hooks/useEditTask', () => ({
    default: (closeModal: () => void) => ({
        mutate: vi.fn(closeModal),
        isPending: false
    })
}));

// Mock the form components
vi.mock('./components/TitleInput/TitleInput', () => ({
    default: ({ control }: any) => (
        <input
            type="text"
            {...control.register('title')}
            data-testid="title-input"
        />
    )
}));

vi.mock('./components/DescriptionInput/DescriptionInput', () => ({
    default: ({ control }: any) => (
        <textarea
            {...control.register('description')}
            data-testid="description-input"
        />
    )
}));

vi.mock('./components/PrioritySelect/PrioritySelect', () => ({
    default: ({ control }: any) => (
        <select
            {...control.register('priority')}
            data-testid="priority-select"
        >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
        </select>
    )
}));

vi.mock('./components/StatusSelect/StatusSelect', () => ({
    default: ({ control }: any) => (
        <select
            {...control.register('status')}
            data-testid="status-select"
        >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
        </select>
    )
}));

vi.mock('./components/DateInput/DateInput', () => ({
    default: ({ control }: any) => (
        <input
            type="date"
            {...control.register('dueDate')}
            data-testid="date-input"
        />
    )
}));

vi.mock('antd', () => ({
    Modal: ({ children, title, open, ...props }: any) => 
        open === true ? <div role="dialog">{title}{children}</div> : null,
    Spin: ({ children }: any) => <div data-testid="spinner">{children}</div>,
    Form: {
        Item: ({ children, label }: any) => (
            <div>
                {label && <label>{label}</label>}
                {children}
            </div>
        )
    },
    Input: Object.assign(
        (props: any) => <input {...props} />,
        { TextArea: (props: any) => <textarea {...props} /> }
    ),
    Select: Object.assign(
        (props: any) => <select {...props}>{props.children}</select>,
        { Option: ({ children, value }: any) => <option value={value}>{children}</option> }
    ),
    DatePicker: (props: any) => <input type="date" {...props} />,
    Button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    )
}));

describe('TaskModal Component', () => {
    const mockCloseModal = vi.fn();
    const mockTaskData: CreateTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        status: 'PENDING',
        dueDate: new Date('2024-12-31'),
    };

    it('should not render when modal is closed', () => {
        render(
            <TaskModal
                isModalOpen={false}
                closeModal={mockCloseModal}
                isTaskLoading={false}
            />
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

});
