import { it, expect, describe, vi, afterEach } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import ErrorComponent from "../../src/components/Error/ErrorComponent"
import '@testing-library/jest-dom/vitest'
import * as localStorageHelper from '../../src/helpers/localStorageHelper'

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate
}));

vi.mock('../../src/helpers/localStorageHelper', () => ({
    clearLocalStorage: vi.fn()
}));

describe('Error Component', () => {
    afterEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("should render error message", () => {
        render(<ErrorComponent message="Something went wrong" />);
        expect(screen.getByText("Error")).toBeInTheDocument();
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should show login button when message contains 'unauthorized'", () => {
        render(<ErrorComponent message="Unauthorized access" />);
        const loginButton = screen.getByRole('button', { name: /log in/i });
        expect(loginButton).toBeInTheDocument();
    });

    it("should not show login button for other error messages", () => {
        render(<ErrorComponent message="Generic error message" />);
        const loginButton = screen.queryByRole('button', {name: /log in/i});
        expect(loginButton).not.toBeInTheDocument();
    });

    it("should clear localStorage and navigate to login when login button is clicked", () => {
        render(<ErrorComponent message="Unauthorized access" />);

        const loginButton = screen.getByRole('button', { name: /log in/i });
        fireEvent.click(loginButton);

        expect(localStorageHelper.clearLocalStorage).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it("should render error icon", () => {
        render(<ErrorComponent message="Test error" />);
   
        const errorIcon = screen.getByRole('img', { hidden: true });
        expect(errorIcon).toBeInTheDocument();
    });
});
