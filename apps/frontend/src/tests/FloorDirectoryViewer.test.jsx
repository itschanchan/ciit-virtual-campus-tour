import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import FloorDirectoryViewer from "../components/FloorDirectoryViewer"

function mockSizes({
  wrapperWidth = 600,
  wrapperHeight = 400,
  contentWidth = 1200,
  contentHeight = 1900,
} = {}) {
  const elements = new Map()

  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return elements.get(this)?.wrapperWidth ?? wrapperWidth
    },
  })
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get() {
      return elements.get(this)?.wrapperHeight ?? wrapperHeight
    },
  })
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return elements.get(this)?.contentWidth ?? contentWidth
    },
  })
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return elements.get(this)?.contentHeight ?? contentHeight
    },
  })

  return {
    set(element, { wrapperWidth, wrapperHeight, contentWidth, contentHeight }) {
      elements.set(element, { wrapperWidth, wrapperHeight, contentWidth, contentHeight })
    },
  }
}

function renderViewer(props = {}) {
  return render(<FloorDirectoryViewer src="/img/glitch_directory.png" alt="Floor Directory" active {...props} />)
}

function image() {
  return screen.getByAltText("Floor Directory")
}

function percent() {
  return screen.getByText(/^\d{3}%$/)
}

function percentValue() {
  return Number(percent().textContent.replace("%", ""))
}

describe("FloorDirectoryViewer", () => {
  beforeEach(() => {
    mockSizes()
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn(() => ({ matches: true })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the image with the Floor Directory alt text", () => {
    renderViewer()

    expect(image()).toBeInTheDocument()
  })

  it("shows a role=alert message and reports failure when the image fails", () => {
    const onImageStatusChange = vi.fn()
    renderViewer({ onImageStatusChange })

    fireEvent.error(image())

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(onImageStatusChange).toHaveBeenCalledWith("failed")
  })

  it("mounts fitted at 100% when sizes are stubbed", () => {
    renderViewer()

    expect(percent().textContent).toBe("100%")
  })

  it("re-fits to 100% when reopened after being closed", () => {
    const { rerender } = renderViewer()

    rerender(<FloorDirectoryViewer src="/img/glitch_directory.png" alt="Floor Directory" active={false} />)
    rerender(<FloorDirectoryViewer src="/img/glitch_directory.png" alt="Floor Directory" active />)

    expect(percent().textContent).toBe("100%")
  })

  it("updates the percentage when zoom in is clicked", () => {
    renderViewer()
    fireEvent.load(image())

    expect(percentValue()).toBe(100)

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }))

    expect(percentValue()).toBeGreaterThan(100)
    expect(percentValue()).toBeLessThanOrEqual(400)
  })

  it("disables zoom out and reset at 100%", () => {
    renderViewer()
    fireEvent.load(image())

    expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Reset view" })).toBeDisabled()
  })

  it("clamps the percentage at 400% and disables zoom in", () => {
    renderViewer()
    fireEvent.load(image())

    const zoomIn = screen.getByRole("button", { name: "Zoom in" })
    for (let i = 0; i < 30; i++) {
      fireEvent.click(zoomIn)
    }

    expect(percentValue()).toBeGreaterThanOrEqual(399)
    expect(percentValue()).toBeLessThanOrEqual(400)
  })

  it("returns to 100% when reset is clicked", () => {
    renderViewer()
    fireEvent.load(image())

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }))
    expect(percentValue()).toBeGreaterThan(100)

    fireEvent.click(screen.getByRole("button", { name: "Reset view" }))
    expect(percentValue()).toBe(100)
  })

  it("exposes the percentage as aria-label Zoom level", () => {
    renderViewer()

    expect(percent()).toHaveAttribute("aria-label", "Zoom level")
  })

  it("zooms the content when the wheel is used over the viewer", () => {
    renderViewer()
    fireEvent.load(image())

    expect(percentValue()).toBe(100)

    const wrapper = document.querySelector("[role='group']")
    fireEvent.wheel(wrapper, { deltaY: -100, cancelable: true })

    expect(percentValue()).toBeGreaterThan(100)
  })

  it("uses zero animation times under reduced motion", () => {
    renderViewer()
    fireEvent.load(image())

    expect(percentValue()).toBe(100)

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }))
    expect(percentValue()).not.toBe(100)
  })
})
