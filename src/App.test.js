import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import App from "./App";

afterEach(cleanup);

test("renders Weather Forecast title", () => {
  render(<App />);
  const title = screen.getByText(/Weather Forecast/i);
  expect(title).toBeInTheDocument();
});

test("renders search link", () => {
  render(<App />);
  const buttonText = screen.getByText(/Search/i);
  expect(buttonText).toBeInTheDocument();
});

test("after clicking on button, displays loading message", () => {
  render(<App />);
  fireEvent.click(screen.getByText("Search"));
  expect(screen.getByTestId("fetch-loading").textContent).toBe("Loading...");
});

test("after clicking on button, displays city if API succeeds", async () => {
  // Mock API
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () =>
        Promise.resolve({
          value: { name: "Oslo" },
        }),
    })
  );

  render(<App />);
  fireEvent.click(screen.getByText("Search"));
  await waitFor(() => screen.findByRole("weather-card"));

  expect(screen.getByText(/Oslo/i)).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch.mock.calls[0][0]).toBe(
    "https://api.chucknorris.io/jokes/random"
  );

  // Clear mock
  global.fetch.mockClear();
});
