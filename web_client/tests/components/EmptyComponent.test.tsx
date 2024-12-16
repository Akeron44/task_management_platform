import { it, expect, describe } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import EmptyComponent from "../../src/components/Empty/EmptyComponent"
import '@testing-library/jest-dom/vitest'

describe('Empty Component', () => {
    it("should render the empty state image", () => {
        render(<EmptyComponent message="No tasks" />)
        
        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg');
    });

    it("should render the provided message", () => {
        const message = "Custom empty message";
        render(<EmptyComponent message={message} />)
        
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it("should not render a button when myTasks is false", () => {
        render(<EmptyComponent message="No tasks" myTasks={false} />)
        
        const button = screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    });

    it("should not render a button when myTasks is undefined", () => {
        render(<EmptyComponent message="No tasks" />)
        
        const button = screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    });

    it("should render 'Add Task' button when myTasks is true", () => {
        render(<EmptyComponent message="No tasks" myTasks={true} />)
        
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('+ Add Task');
    });

    it("should not show modal by default", () => {
        render(<EmptyComponent message="No tasks" myTasks={true} />)
        
        const modal = screen.queryByRole('dialog');
        expect(modal).not.toBeInTheDocument();
    });
});