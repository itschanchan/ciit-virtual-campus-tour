import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import FloorDirectoryDialog from "../components/FloorDirectoryDialog"

function renderDialog(props = {}) {
  return render(
    <FloorDirectoryDialog
      open
      onClose={vi.fn()}
      imageSrc="/img/glitch_directory.png"
      imageAlt="Floor Directory"
      {...props}
    />,
  )
}

function enableViewer() {
  const img = screen.getByAltText("Floor Directory")
  fireEvent.load(img)
}

describe("FloorDirectoryDialog", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the dialog with the title and close control", () => {
    renderDialog()

    const dialog = screen.getByRole("dialog", { name: "Floor Directory" })
    expect(dialog).toHaveAttribute("id", "floor-directory")
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(screen.getByText("Floor Directory")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Close floor directory" }),
    ).toBeInTheDocument()
  })

  it("receives focus on the close control when opened", () => {
    renderDialog()

    expect(
      screen.getByRole("button", { name: "Close floor directory" }),
    ).toHaveFocus()
  })

  it("calls onClose on Escape", () => {
    const onClose = vi.fn()
    renderDialog({ onClose })

    fireEvent.keyDown(document, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose on backdrop mousedown", () => {
    const onClose = vi.fn()
    renderDialog({ onClose })

    const backdrop = document.querySelector("[aria-hidden='false']")
    fireEvent.mouseDown(backdrop)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not call onClose on backdrop mousedown when targeting the dialog", () => {
    const onClose = vi.fn()
    renderDialog({ onClose })

    const dialog = screen.getByRole("dialog", { name: "Floor Directory" })
    fireEvent.mouseDown(dialog)

    expect(onClose).not.toHaveBeenCalled()
  })

  it("returns focus to the map button on close", () => {
    const mapButton = document.createElement("button")
    mapButton.textContent = "Open map"
    document.body.appendChild(mapButton)

    const returnFocusRef = { current: mapButton }
    const { unmount } = renderDialog({ returnFocusRef })

    fireEvent.click(screen.getByRole("button", { name: "Close floor directory" }))

    unmount()

    expect(document.activeElement).toBe(mapButton)

    document.body.removeChild(mapButton)
  })

  it("wraps Tab focus from the last control back to the close button", () => {
    renderDialog()
    enableViewer()

    const zoomIn = screen.getByRole("button", { name: "Zoom in" })
    const closeButton = screen.getByRole("button", { name: "Close floor directory" })

    zoomIn.focus()
    fireEvent.keyDown(zoomIn, { key: "Tab", shiftKey: false })

    expect(document.activeElement).toBe(closeButton)
  })

  it("wraps Shift+Tab focus from the close button back to the last control", () => {
    renderDialog()
    enableViewer()

    const closeButton = screen.getByRole("button", { name: "Close floor directory" })
    const zoomIn = screen.getByRole("button", { name: "Zoom in" })

    closeButton.focus()
    fireEvent.keyDown(closeButton, { key: "Tab", shiftKey: true })

    expect(document.activeElement).toBe(zoomIn)
  })
})
