import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import Login from '../../../src/pages/Login/Login'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
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

const mockMutate = vi.fn();
let mockIsPending = false;

// Mock the useLogin hook
vi.mock('../../../src/pages/Login/hooks/useLogin', () => ({
    default: () => ({
        mutate: mockMutate,
        isPending: mockIsPending
    })
}));

// Mock the custom form components
vi.mock('../../../src/pages/Login/components/EmailInput/EmailInput', () => ({
    default: ({ control }: any) => (
        <input
            type="email"
            placeholder="Email"
            {...control.register('email')}
            data-testid="email-input"
        />
    )
}));

vi.mock('../../../src/pages/Login/components/PasswordInput/PasswordInput', () => ({
    default: ({ control }: any) => (
        <input
            type="password"
            placeholder="Password"
            {...control.register('password')}
            data-testid="password-input"
        />
    )
}));

describe('Login Component', () => {
    beforeEach(() => {
        mockMutate.mockClear();
        mockIsPending = false;
    });

    afterEach(() => {
        cleanup();
    });

    it('should render login form with all elements', () => {
        render(<Login />);

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should show loading spinner when form is submitting', async () => {
        mockIsPending = true;
        render(<Login />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should handle form submission with valid data', async () => {
        const { getByTestId, getByRole } = render(<Login />);
        
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button', { name: /sign in/i });

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123A$');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123A$'
            });
        });
    });

    it('should prevent form submission with invalid email', async () => {
        render(<Login />);
        
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await userEvent.type(emailInput, 'invalid-email');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).not.toHaveBeenCalled();
        });
    });

    it('should prevent form submission with empty password', async () => {
        render(<Login />);
        
        const emailInput = screen.getByTestId('email-input');
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).not.toHaveBeenCalled();
        });
    });

    it('should handle form submission errors', async () => {
        mockMutate.mockRejectedValueOnce(new Error('Login failed'));
        
        render(<Login />);
        
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });
});
