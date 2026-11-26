import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "../lib/motion";

function mockMatchMedia(matches) {
  let listener = null;

  const mediaQuery = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn((event, handler) => {
      listener = handler;
    }),
    removeEventListener: vi.fn(),
  };

  window.matchMedia = vi.fn(() => mediaQuery);

  function emit(nextMatches) {
    mediaQuery.matches = nextMatches;
    listener?.({ matches: nextMatches });
  }

  return { emit, mediaQuery };
}

describe("usePrefersReducedMotion", () => {
  afterEach(() => {
    delete window.matchMedia;
  });

  it("defaults to false without matchMedia", () => {
    delete window.matchMedia;

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it("reads the current reduced-motion preference", () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it("updates when the preference changes", () => {
    const { emit } = mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);

    act(() => emit(true));

    expect(result.current).toBe(true);
  });
});
