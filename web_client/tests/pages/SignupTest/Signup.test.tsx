import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import Signup from '../../../src/pages/Signup/Signup'

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

vi.mock('../../../src/pages/Signup/hooks/useSignup', () => ({
    default: () => ({
        mutate: mockMutate,
        isPending: mockIsPending
    })
}));

vi.mock('../../../src/pages/Signup/components/EmailInput/EmailInput', () => ({
    default: ({ control }: any) => (
        <input
            type="email"
            placeholder="Email"
            {...control.register('email', { required: true })}
            data-testid="email-input"
        />
    )
}));

vi.mock('../../../src/pages/Signup/components/PasswordInput/PasswordInput', () => ({
    default: ({ control }: any) => (
        <input
            type="password"
            placeholder="Password"
            {...control.register('password', { required: true })}
            data-testid="password-input"
        />
    )
}));

vi.mock('../../../src/pages/Signup/components/NameInput/NameInput', () => ({
    default: ({ control }: any) => (
        <input
            type="text"
            placeholder="Name"
            {...control.register('name', { required: true })}
            data-testid="name-input"
        />
    )
}));

vi.mock('../../../src/pages/Signup/components/AgeInput/AgeInput', () => ({
    default: ({ control }: any) => (
        <input
            type="number"
            placeholder="Age"
            {...control.register('age', { valueAsNumber: true })}
            data-testid="age-input"
        />
    )
}));

describe('Signup Component', () => {
    beforeEach(() => {
        mockMutate.mockClear();
        mockIsPending = false;
    });

    afterEach(() => {
        cleanup();
    });

    it('should render signup form with all elements', () => {
        render(<Signup />);

        expect(screen.getByText('Welcome')).toBeInTheDocument();
        expect(screen.getByText('Create your account')).toBeInTheDocument();
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
        expect(screen.getByTestId('age-input')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should show loading spinner when form is submitting', async () => {
        mockIsPending = true;
        render(<Signup />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should handle form submission with valid data', async () => {
        const { getByTestId, getByRole } = render(<Signup />);
        
        const nameInput = getByTestId('name-input');
        const ageInput = getByTestId('age-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');

        await userEvent.type(nameInput, 'John Doe');
        await userEvent.type(ageInput, '25');
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'Password123$');
        
        const form = nameInput.closest('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({
                name: 'John Doe',
                age: 25,
                email: 'test@example.com',
                password: 'Password123$'
            });
        });
    });

    it('should prevent form submission with invalid email', async () => {
        const { getByTestId, getByRole } = render(<Signup />);
        
        const nameInput = getByTestId('name-input');
        const ageInput = getByTestId('age-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button', { name: /create account/i });

        await userEvent.type(nameInput, 'John Doe');
        await userEvent.type(ageInput, '25');
        await userEvent.type(emailInput, 'invalid-email');
        await userEvent.type(passwordInput, 'Password123$');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).not.toHaveBeenCalled();
        });
    });


    it('should handle form submission errors', async () => {
        mockMutate.mockRejectedValueOnce(new Error('Signup failed'));
        
        const { getByTestId, getByRole } = render(<Signup />);
        
        const nameInput = getByTestId('name-input');
        const ageInput = getByTestId('age-input');
        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByRole('button', { name: /create account/i });

        await userEvent.type(nameInput, 'John Doe');
        await userEvent.type(ageInput, '25');
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'Password123$');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });
});
