import { renderHook, act } from "@testing-library/react";
import { useTheme } from "@/lib/useTheme";

beforeEach(() => {
  localStorage.clear();
  document.body.className = "";
});

describe("useTheme", () => {
  it("defaults to light when matchMedia reports no dark preference", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("reads stored theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("toggleTheme switches dark → light", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
  });

  it("toggleTheme switches light → dark", () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("persists theme change to localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("adds light class to body when theme is light", () => {
    localStorage.setItem("theme", "light");
    renderHook(() => useTheme());
    expect(document.body.classList.contains("light")).toBe(true);
  });

  it("removes light class from body when theme is dark", () => {
    document.body.classList.add("light");
    localStorage.setItem("theme", "dark");
    renderHook(() => useTheme());
    expect(document.body.classList.contains("light")).toBe(false);
  });

  it("uses matchMedia dark preference when localStorage is empty", () => {
    window.matchMedia = (query: string) =>
      ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });
});
