import { act, fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchBar } from "./index";

// ─── Mock useFilter ────────────────────────────────────────────────────────────

const mockSetSearch = vi.fn();
let mockSearch = "";

vi.mock("@/hooks/use-filter", () => ({
  // eslint-disable-next-line react/component-hook-factories
  useFilter: () => ({
    search: mockSearch,
    type: "",
    page: 1,
    setSearch: mockSetSearch,
    setType: vi.fn(),
    setPage: vi.fn(),
  }),
}));

// ─── Mock useDebounce — real setTimeout so fake timers can control it ─────────

let debounceDelay = 0;

vi.mock("@/hooks/use-debounce", () => ({
  // eslint-disable-next-line react/component-hook-factories
  useDebounce: (value: string) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(setDebounced, debounceDelay, value);
      return () => clearTimeout(timer);
    }, [value]);
    return debounced;
  },
}));

describe("searchBar", () => {
  beforeEach(() => {
    mockSearch = "";
    debounceDelay = 0;
    mockSetSearch.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders an input with the correct aria-label", () => {
    render(<SearchBar />);
    expect(
      screen.getByRole("searchbox", { name: /search pokémon/i }),
    ).toBeInTheDocument();
  });

  it("initialises input value from FilterContext search", () => {
    mockSearch = "char";
    render(<SearchBar />);
    expect(screen.getByRole("searchbox")).toHaveValue("char");
  });

  it("renders with empty string when search is empty", () => {
    mockSearch = "";
    render(<SearchBar />);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("updates the displayed input value immediately on typing", () => {
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "pikachu" } });
    expect(input).toHaveValue("pikachu");
  });

  it("does not call setSearch before the debounce delay", () => {
    debounceDelay = 300;
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "pika" } });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(mockSetSearch).not.toHaveBeenCalled();
  });

  it("calls setSearch with the debounced value after 300ms", () => {
    debounceDelay = 300;
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "pika" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(mockSetSearch).toHaveBeenCalledWith("pika");
  });

  it("calls setSearch with empty string when input is cleared", () => {
    debounceDelay = 0;
    mockSearch = "pika";
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "" } });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(mockSetSearch).toHaveBeenCalledWith("");
  });

  it("cancels the debounce timer when the component unmounts", () => {
    debounceDelay = 300;
    const { unmount } = render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "squirtle" } });
    unmount();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(mockSetSearch).not.toHaveBeenCalled();
  });
});
