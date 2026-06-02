import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders BOOP header", () => {
  render(<App />);
  const headerElement = screen.getByText(/BOOP Web/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders Create Puzzle link", () => {
  render(<App />);
  const createLink = screen.getByText(/Create Puzzle/i);
  expect(createLink).toBeInTheDocument();
});
