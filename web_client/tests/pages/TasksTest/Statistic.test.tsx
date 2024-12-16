import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Statistic from '../../../src/pages/Tasks/components/Statistic/Statistic'

// Mock matchMedia for Ant Design
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('Statistic Component', () => {
    const mockStats = {
        total: 10,
        byStatus: {
            PENDING: 3,
            IN_PROGRESS: 4,
            COMPLETED: 2,
            CANCELLED: 1,
        },
        byPriority: {
            LOW: 2,
            MEDIUM: 5,
            HIGH: 3,
        },
    };

    it('should render loading spinner when isLoading is true', () => {
        render(<Statistic isLoading={true} />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render all stats when data is provided', () => {
        render(<Statistic stats={mockStats} isLoading={false} />);

        // Check titles
        expect(screen.getByText('Total Tasks')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Low Priority')).toBeInTheDocument();
        expect(screen.getByText('Medium Priority')).toBeInTheDocument();
        expect(screen.getByText('High Priority')).toBeInTheDocument();

        // Check values using data-testid
        expect(screen.getByTestId('total-value')).toHaveTextContent('10');
        expect(screen.getByTestId('in-progress-value')).toHaveTextContent('4');
        expect(screen.getByTestId('completed-value')).toHaveTextContent('2');
        expect(screen.getByTestId('pending-value')).toHaveTextContent('3');
        expect(screen.getByTestId('low-priority-value')).toHaveTextContent('2');
        expect(screen.getByTestId('medium-priority-value')).toHaveTextContent('5');
        expect(screen.getByTestId('high-priority-value')).toHaveTextContent('3');
    });

    it('should render zeros when no stats are provided', () => {
        render(<Statistic isLoading={false} />);

        const statValues = screen.getAllByText('0');
        expect(statValues).toHaveLength(7); // Total, 3 status types, 3 priority types
    });
});
