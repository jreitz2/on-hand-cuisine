import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";
import { Recipe } from "../types";

describe("Header", () => {
  let setRecipes: jest.Mock;
  let setLoading: jest.Mock;
  let favorites: Recipe[] = [];

  beforeEach(() => {
    setRecipes = jest.fn();
    setLoading = jest.fn();
  });

  test("updates search term on input change", () => {
    const { getByPlaceholderText } = render(
      <Header
        setRecipes={setRecipes}
        setLoading={setLoading}
        favorites={favorites}
      />
    );
    const input = getByPlaceholderText(
      "bacon, sugar, flour"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "test" } });

    expect(input.value).toBe("test");
  });

  test("toggles vegetarian option on click", () => {
    const { getByLabelText } = render(
      <Header
        setRecipes={setRecipes}
        setLoading={setLoading}
        favorites={favorites}
      />
    );
    const checkbox = getByLabelText("Vegetarian") as HTMLInputElement;

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
  });

  test("toggles gluten-free option on click", () => {
    const { getByLabelText } = render(
      <Header
        setRecipes={setRecipes}
        setLoading={setLoading}
        favorites={favorites}
      />
    );
    const checkbox = getByLabelText("Gluten-free") as HTMLInputElement;

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
  });

  test("calls setLoading on form submit", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Header
        setRecipes={setRecipes}
        setLoading={setLoading}
        favorites={favorites}
      />
    );
    const input = getByPlaceholderText("bacon, sugar, flour");
    const button = getByText("Search");

    fireEvent.change(input, { target: { value: "chicken" } });
    fireEvent.submit(button);

    await waitFor(() => {
      expect(setLoading).toHaveBeenCalledWith(true);
    });
  });
});
