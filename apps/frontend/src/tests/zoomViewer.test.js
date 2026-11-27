import { describe, expect, it } from "vitest";
import {
  getMaxScale,
  getZoomPercent,
  measureFitScale,
} from "../lib/zoomViewer";

describe("measureFitScale", () => {
  it("uses the smaller contain ratio", () => {
    const heightLimited = measureFitScale({
      wrapperWidth: 600,
      wrapperHeight: 300,
      contentWidth: 1200,
      contentHeight: 1900,
    });
    const widthLimited = measureFitScale({
      wrapperWidth: 300,
      wrapperHeight: 1000,
      contentWidth: 1200,
      contentHeight: 1900,
    });

    expect(heightLimited).toBeCloseTo(300 / 1900, 6);
    expect(widthLimited).toBeCloseTo(300 / 1200, 6);
  });

  it("falls back to one when a size is missing", () => {
    const missingWrapper = measureFitScale({
      wrapperWidth: 0,
      wrapperHeight: 400,
      contentWidth: 1200,
      contentHeight: 1900,
    });
    const missingContent = measureFitScale({
      wrapperWidth: 600,
      wrapperHeight: 400,
      contentWidth: Number.NaN,
      contentHeight: 1900,
    });

    expect(missingWrapper).toBe(1);
    expect(missingContent).toBe(1);
  });
});

describe("getMaxScale", () => {
  it("is four times the fitted scale", () => {
    expect(getMaxScale(0.5)).toBe(2);
    expect(getMaxScale(0.21)).toBeCloseTo(0.84, 6);
  });

  it("falls back to a usable cap when the fit is invalid", () => {
    expect(getMaxScale(0)).toBe(4);
    expect(getMaxScale(Number.NaN)).toBe(4);
  });
});

describe("getZoomPercent", () => {
  it("reports the fitted view as 100%", () => {
    expect(getZoomPercent(0.5, 0.5)).toBe(100);
  });

  it("reports four times the fit as 400%", () => {
    expect(getZoomPercent(2, 0.5)).toBe(400);
  });

  it("rounds to the nearest whole percent", () => {
    expect(getZoomPercent(0.505, 0.5)).toBe(101);
  });

  it("clamps outside the 100% to 400% range", () => {
    expect(getZoomPercent(0.1, 0.5)).toBe(100);
    expect(getZoomPercent(9, 0.5)).toBe(400);
    expect(getZoomPercent(Number.NaN, 0.5)).toBe(100);
  });
});
