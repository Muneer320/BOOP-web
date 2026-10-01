import { render, screen, within } from "@testing-library/react";
import App from "./App";
import { apiService } from "./services/api";

jest.mock("./services/api", () => ({
  apiService: { checkStatus: jest.fn() },
}));

beforeEach(() => {
  // react-scripts resets mock implementations before every test
  apiService.checkStatus.mockResolvedValue({ data: {} });
  sessionStorage.clear();
  window.history.pushState({}, "", "/");
});

test("renders the header with the main navigation", () => {
  render(<App />);
  const nav = screen.getByRole("navigation", { name: /main navigation/i });
  for (const label of ["Create", "Play", "Examples", "About"]) {
    expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
  }
});

test("wakes the backend once per browser session", () => {
  render(<App />);
  render(<App />);
  expect(apiService.checkStatus).toHaveBeenCalledTimes(1);
});

test("the examples page lists the sample books", async () => {
  window.history.pushState({}, "", "/examples");
  render(<App />);
  expect(await screen.findByRole("heading", { name: /sample puzzle books/i })).toBeInTheDocument();
  expect(screen.getAllByText(/Mega Puzzle Book/).length).toBeGreaterThan(0);
});

test("unknown routes show the not-found page", async () => {
  window.history.pushState({}, "", "/does-not-exist");
  render(<App />);
  expect(await screen.findByRole("heading", { name: /page not found/i })).toBeInTheDocument();
});
