import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import FloatingMenu from "../components/FloatingMenu"

const narration = {
  audioSrc: "/panoramas/placeholder/narration.wav",
  transcript: "Welcome to the CIIT Virtual Campus Tour.",
  durationSeconds: 2,
}

const defaultProps = {
  narration,
  status: "idle",
  onPlay: vi.fn(),
  onPause: vi.fn(),
  onStatusChange: vi.fn(),
  muted: false,
  onMuteToggle: vi.fn(),
}

function mockMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe("FloatingMenu", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    defaultProps.onPlay.mockReset()
    defaultProps.onPause.mockReset()
    defaultProps.onStatusChange.mockReset()
    defaultProps.onMuteToggle.mockReset()
  })

  afterEach(() => {
    delete window.matchMedia
  })

  it("renders play/pause and mute/unmute controls", () => {
    render(<FloatingMenu {...defaultProps} />)

    expect(screen.getByRole("button", { name: "Play narration" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Mute narration" })).toBeInTheDocument()
  })

  it("shows pause label when narration is playing", () => {
    render(<FloatingMenu {...defaultProps} status="playing" />)

    expect(screen.getByRole("button", { name: "Pause narration" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Play narration" })).not.toBeInTheDocument()
  })

  it("calls onPlay when the play button is clicked while idle", () => {
    render(<FloatingMenu {...defaultProps} status="idle" />)

    fireEvent.click(screen.getByRole("button", { name: "Play narration" }))
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1)
  })

  it("calls onPause when the pause button is clicked while playing", () => {
    render(<FloatingMenu {...defaultProps} status="playing" />)

    fireEvent.click(screen.getByRole("button", { name: "Pause narration" }))
    expect(defaultProps.onPause).toHaveBeenCalledTimes(1)
  })

  it("toggles play/pause correctly on repeated clicks (SC-001)", () => {
    render(<FloatingMenu {...defaultProps} status="idle" />)

    fireEvent.click(screen.getByRole("button", { name: "Play narration" }))
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1)

    render(<FloatingMenu {...defaultProps} status="playing" />)
    fireEvent.click(screen.getByRole("button", { name: "Pause narration" }))
    expect(defaultProps.onPause).toHaveBeenCalledTimes(1)
  })

  it("shows the audio visualization when narration is playing", () => {
    const { container } = render(<FloatingMenu {...defaultProps} status="playing" />)

    const viz = container.querySelector(".audio-viz")
    expect(viz).not.toHaveClass("hidden")
    expect(viz).toHaveClass("playing")
  })

  it("hides the audio visualization when narration is paused", () => {
    const { container } = render(<FloatingMenu {...defaultProps} status="paused" />)

    const viz = container.querySelector(".audio-viz")
    expect(viz).toHaveClass("hidden")
  })

  it("calls onMuteToggle when the mute button is clicked", () => {
    render(<FloatingMenu {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: "Mute narration" }))
    expect(defaultProps.onMuteToggle).toHaveBeenCalledTimes(1)
  })

  it("shows unmute label when narration is muted", () => {
    render(<FloatingMenu {...defaultProps} muted={true} />)

    expect(screen.getByRole("button", { name: "Unmute narration" })).toBeInTheDocument()
  })

  it("renders Material UI SVG icons instead of hint text for play/pause and mute controls", () => {
    render(<FloatingMenu {...defaultProps} />)

    // No visible "p" or "m" hint text
    expect(screen.queryByText("p")).not.toBeInTheDocument()
    expect(screen.queryByText("m")).not.toBeInTheDocument()

    // SVG icons present inside buttons
    const playButton = screen.getByRole("button", { name: "Play narration" })
    const muteButton = screen.getByRole("button", { name: "Mute narration" })
    expect(playButton.querySelector("svg")).toBeInTheDocument()
    expect(muteButton.querySelector("svg")).toBeInTheDocument()
  })

  it("triggers play/pause when the play button has focus and p is pressed", () => {
    render(<FloatingMenu {...defaultProps} status="idle" />)

    const playButton = screen.getByRole("button", { name: "Play narration" })
    playButton.focus()
    fireEvent.keyDown(playButton, { key: "p" })
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1)
  })

  it("triggers mute/unmute when the mute button has focus and m is pressed", () => {
    render(<FloatingMenu {...defaultProps} />)

    const muteButton = screen.getByRole("button", { name: "Mute narration" })
    muteButton.focus()
    fireEvent.keyDown(muteButton, { key: "m" })
    expect(defaultProps.onMuteToggle).toHaveBeenCalledTimes(1)
  })

  it("exposes accessible names on all controls", () => {
    render(<FloatingMenu {...defaultProps} />)

    expect(screen.getByRole("button", { name: "Play narration" })).toHaveAttribute(
      "aria-label",
      "Play narration",
    )
    expect(screen.getByRole("button", { name: "Mute narration" })).toHaveAttribute(
      "aria-label",
      "Mute narration",
    )
  })

  it("renders transcript when opened and narration present", () => {
    render(<FloatingMenu {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: "Show transcript" }))
    expect(screen.getByText(narration.transcript)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Hide transcript" })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
  })

  it("renders all controls on a narrow mobile viewport", () => {
    mockMatchMedia(true)
    render(<FloatingMenu {...defaultProps} />)

    expect(screen.getByRole("button", { name: "Play narration" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Mute narration" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Show transcript" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Open map" })).toBeInTheDocument()
  })

  it("hides the audio visualization on a narrow mobile viewport", () => {
    mockMatchMedia(true)
    const { container } = render(
      <FloatingMenu {...defaultProps} status="playing" />
    )

    const viz = container.querySelector(".audio-viz")
    expect(viz).toHaveClass("narrow:hidden")
  })

  it("keeps controls tappable on a narrow mobile viewport", () => {
    mockMatchMedia(true)
    render(<FloatingMenu {...defaultProps} status="playing" />)

    const playButton = screen.getByRole("button", { name: "Pause narration" })

    fireEvent.click(playButton)
    expect(defaultProps.onPause).toHaveBeenCalledTimes(1)
  })

  it("keeps the mute button tappable on a narrow mobile viewport", () => {
    mockMatchMedia(true)
    render(<FloatingMenu {...defaultProps} />)

    const muteButton = screen.getByRole("button", { name: "Mute narration" })

    fireEvent.click(muteButton)
    expect(defaultProps.onMuteToggle).toHaveBeenCalledTimes(1)
  })

  describe("Room Gallery", () => {
    const galleryImageFixtures = [
      {
        src: "/gallery/lg/first.jpg",
        alt: "The first lobby photo.",
        caption: "First preview",
        order: 0,
      },
      {
        src: "/gallery/lg/second.jpg",
        alt: "The second lobby photo.",
        caption: "Second preview",
        order: 1,
      },
      {
        src: "/gallery/lg/third.jpg",
        alt: "The third lobby photo.",
        caption: "Third preview",
        order: 2,
      },
    ]

    const defaultNarrationProps = {
      narration: defaultProps.narration,
      onPlay: defaultProps.onPlay,
      onPause: defaultProps.onPause,
      onStatusChange: defaultProps.onStatusChange,
      muted: defaultProps.muted,
      onMuteToggle: defaultProps.onMuteToggle,
    }

    function ControlledFloatingMenu({
      galleryImages = galleryImageFixtures,
      initialOpen = true,
      onClose = vi.fn(),
      onOpen = vi.fn(),
      sidebarOpen = false,
      floorLabel = "",
      status = "idle",
    }) {
      const [isOpen, setIsOpen] = useState(initialOpen)
      function handleClose() {
        onClose()
        setIsOpen(false)
      }
      return (
        <FloatingMenu
          images={galleryImages}
          open={isOpen}
          onClose={handleClose}
          onOpen={onOpen}
          sidebarOpen={sidebarOpen}
          floorLabel={floorLabel}
          status={status}
          {...defaultNarrationProps}
        />
      )
    }

    function getDialog() {
      return document.getElementById("room-gallery")
    }

    function getBackdrop() {
      return getDialog().parentElement
    }

    it("keeps the dialog mounted but hidden when open is false", () => {
      const { rerender } = render(
        <FloatingMenu
          images={galleryImageFixtures}
          open={false}
          onClose={vi.fn()}
          {...defaultNarrationProps}
        />,
      )

      const dialog = getDialog()

      expect(dialog).toBeInTheDocument()
      expect(getBackdrop()).toHaveAttribute("aria-hidden", "true")

      rerender(
        <FloatingMenu
          images={galleryImageFixtures}
          open
          onClose={vi.fn()}
          {...defaultNarrationProps}
        />,
      )

      expect(getBackdrop()).toHaveAttribute("aria-hidden", "false")
    })

    it("exposes the dialog name, modal state, and close control", () => {
      render(<ControlledFloatingMenu />)

      const dialog = screen.getByRole("dialog", { name: "Gallery" })
      expect(dialog).toHaveAttribute("aria-modal", "true")
      expect(
        screen.getByRole("button", { name: "Close gallery" }),
      ).toBeInTheDocument()
    })

    it("renders only the active image and navigates with the arrow buttons", () => {
      render(<ControlledFloatingMenu />)

      expect(screen.getByAltText("The first lobby photo.")).toBeInTheDocument()
      expect(
        screen.queryByAltText("The second lobby photo."),
      ).not.toBeInTheDocument()
      expect(screen.getByText("First preview")).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: "Next image" }))

      expect(screen.getByAltText("The second lobby photo.")).toBeInTheDocument()
      expect(
        screen.queryByAltText("The first lobby photo."),
      ).not.toBeInTheDocument()
      expect(screen.getByText("2 / 3")).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: "Previous image" }))

      expect(screen.getByAltText("The first lobby photo.")).toBeInTheDocument()
    })

    it("wraps around at the end of the gallery", () => {
      render(<ControlledFloatingMenu />)

      fireEvent.click(screen.getByRole("button", { name: "Previous image" }))
      expect(screen.getByAltText("The third lobby photo.")).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: "Next image" }))
      expect(screen.getByAltText("The first lobby photo.")).toBeInTheDocument()
    })

    it("navigates with the left and right arrow keys", () => {
      render(<ControlledFloatingMenu />)

      fireEvent.keyDown(document, { key: "ArrowRight" })
      expect(screen.getByAltText("The second lobby photo.")).toBeInTheDocument()

      fireEvent.keyDown(document, { key: "ArrowLeft" })
      expect(screen.getByAltText("The first lobby photo.")).toBeInTheDocument()
    })

    it("hides the arrow controls when there is only one image", () => {
      render(<ControlledFloatingMenu galleryImages={[galleryImageFixtures[0]]} />)

      expect(
        screen.queryByRole("button", { name: "Previous image" }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Next image" }),
      ).not.toBeInTheDocument()
    })

    it("shows a friendly empty state", () => {
      render(<ControlledFloatingMenu galleryImages={[]} />)

      expect(
        screen.getByText("No gallery images are available for this location yet."),
      ).toBeInTheDocument()
    })

    it("closes through the close button", () => {
      const onClose = vi.fn()
      render(<ControlledFloatingMenu onClose={onClose} />)

      fireEvent.click(screen.getByRole("button", { name: "Close gallery" }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("closes through the backdrop", () => {
      const onClose = vi.fn()
      render(<ControlledFloatingMenu onClose={onClose} />)

      fireEvent.mouseDown(getBackdrop())

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("closes through Escape", () => {
      const onClose = vi.fn()
      render(<ControlledFloatingMenu onClose={onClose} />)

      fireEvent.keyDown(document, { key: "Escape" })

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("restores focus to the trigger after closing with the close button", async () => {
      const trigger = document.createElement("button")
      trigger.textContent = "Open gallery"
      const main = document.createElement("main")
      main.id = "tour-main"
      main.tabIndex = -1
      document.body.append(trigger, main)
      trigger.focus()

      render(<ControlledFloatingMenu />)

      fireEvent.click(screen.getByRole("button", { name: "Close gallery" }))

      await waitFor(() => expect(trigger).toHaveFocus())

      trigger.remove()
      main.remove()
    })

    it("renders a fallback when an image fails to load", () => {
      render(<ControlledFloatingMenu />)

      fireEvent.error(screen.getByAltText(galleryImageFixtures[0].alt))

      const fallback = screen.getByRole("img", { name: galleryImageFixtures[0].alt })
      expect(fallback).toHaveTextContent("Image unavailable")
    })

    it("hides the gallery on a narrow mobile viewport when sidebar is open", () => {
      mockMatchMedia(true)
      const { container } = render(
        <ControlledFloatingMenu sidebarOpen={true} />,
      )

      expect(container.querySelector("#room-gallery")).not.toBeInTheDocument()
    })

    it("keeps narration controls operable while the gallery is open (US2)", () => {
      render(<ControlledFloatingMenu status="playing" />)

      expect(
        screen.getByRole("button", { name: "Pause narration" }),
      ).toBeInTheDocument()
      expect(
        screen.getByAltText("The first lobby photo."),
      ).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: "Pause narration" }))
      expect(defaultProps.onPause).toHaveBeenCalledTimes(1)
    })

    it("puts all floating menu controls in the tab order with accessible names (US3)", () => {
      render(<ControlledFloatingMenu />)

      const controls = [
        "Play narration",
        "Mute narration",
        "Show transcript",
        "Open map",
        "Close gallery",
        "Previous image",
        "Next image",
      ]

      for (const name of controls) {
        // getByRole already resolves the accessible name (aria-label or text content)
        const control = screen.getByRole("button", { name })
        expect(control).toBeInTheDocument()
      }
    })

    it("calls onOpen when the View Gallery button is clicked", () => {
      const onOpen = vi.fn()
      const { container } = render(<ControlledFloatingMenu onOpen={onOpen} />)

      const viewGalleryButton = container.querySelector(
        'button[aria-controls="room-gallery"]'
      )
      expect(viewGalleryButton).toBeInTheDocument()

      fireEvent.click(viewGalleryButton)
      expect(onOpen).toHaveBeenCalledTimes(1)
    })

    it("reflects gallery open state in View Gallery button aria-expanded", () => {
      const { container } = render(<ControlledFloatingMenu initialOpen={true} />)

      let viewGalleryButton = container.querySelector(
        'button[aria-controls="room-gallery"]'
      )
      expect(viewGalleryButton).toHaveAttribute("aria-expanded", "true")

      fireEvent.click(screen.getByRole("button", { name: "Close gallery" }))

      viewGalleryButton = container.querySelector(
        'button[aria-controls="room-gallery"]'
      )
      expect(viewGalleryButton).toHaveAttribute("aria-expanded", "false")
    })

    it("renders View Gallery button as icon-only with PhotoCameraIcon", () => {
      const { container } = render(<ControlledFloatingMenu />)

      const viewGalleryButton = container.querySelector(
        'button[aria-controls="room-gallery"]'
      )
      expect(viewGalleryButton).toBeInTheDocument()
      expect(viewGalleryButton.querySelector("svg")).toBeInTheDocument()
      expect(viewGalleryButton.textContent.trim()).toBe("")
    })

    it("does not enable vertical scrolling on the gallery panel", () => {
      render(<ControlledFloatingMenu />)

      const dialog = getDialog()
      expect(dialog).not.toHaveClass("overflow-y-auto")
    })

    it("scales the gallery image to viewport bounds on mobile", () => {
      render(<ControlledFloatingMenu />)

      const image = screen.getByAltText("The first lobby photo.")
      expect(image).toHaveClass("max-h-[calc(90dvh-10rem)]")
    })

    it("renders all gallery elements on a narrow mobile viewport", () => {
      mockMatchMedia(true)
      render(<ControlledFloatingMenu />)

      expect(screen.getByAltText("The first lobby photo.")).toBeInTheDocument()
      expect(screen.getByText("First preview")).toBeInTheDocument()
      expect(screen.getByText("1 / 3")).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Close gallery" }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Next image" }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Previous image" }),
      ).toBeInTheDocument()
    })

    it("uses tighter padding on compact viewports", () => {
      mockMatchMedia(true)
      render(<ControlledFloatingMenu />)

      const dialog = getDialog()
      expect(dialog).toHaveClass("tiny:p-3")
    })
  })

  describe("Floor Directory Modal", () => {
    function getMapDialog() {
      return document.getElementById("floor-directory")
    }

    function getMapBackdrop() {
      const dialog = getMapDialog()
      return dialog ? dialog.parentElement : null
    }

    it("renders the Open map button", () => {
      render(<FloatingMenu {...defaultProps} />)

      expect(
        screen.getByRole("button", { name: "Open map" }),
      ).toBeInTheDocument()
    })

    it("opens the floor directory modal when the Map button is clicked", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      const dialog = getMapDialog()
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute("role", "dialog")
      expect(dialog).toHaveAttribute("aria-modal", "true")
    })

    it("displays the floor directory image with alt text", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      expect(
        screen.getByAltText("Floor Directory"),
      ).toBeInTheDocument()
    })

    it("closes the modal through the close button", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      fireEvent.click(screen.getByRole("button", { name: "Close floor directory" }))

      const backdrop = getMapBackdrop()
      expect(backdrop).toHaveAttribute("aria-hidden", "true")
    })

    it("closes the modal through the backdrop", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      fireEvent.mouseDown(getMapBackdrop())

      const backdrop = getMapBackdrop()
      expect(backdrop).toHaveAttribute("aria-hidden", "true")
    })

    it("closes the modal through Escape", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      fireEvent.keyDown(document, { key: "Escape" })

      const backdrop = getMapBackdrop()
      expect(backdrop).toHaveAttribute("aria-hidden", "true")
    })

    it("does not enable vertical scrolling on the floor directory panel", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      const dialog = getMapDialog()
      expect(dialog).not.toHaveClass("overflow-y-auto")
    })

    it("renders all modal elements on a narrow mobile viewport", () => {
      mockMatchMedia(true)
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      expect(screen.getByAltText("Floor Directory")).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Close floor directory" }),
      ).toBeInTheDocument()
    })

    it("fits on a tablet viewport without scrolling", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      expect(screen.getByAltText("Floor Directory")).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Close floor directory" }),
      ).toBeInTheDocument()

      const dialog = getMapDialog()
      expect(dialog).not.toHaveClass("overflow-y-auto")
    })

    it("zooms in with scroll wheel on desktop", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      const image = screen.getByAltText("Floor Directory")
      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(1)")

      fireEvent.wheel(getMapBackdrop(), { deltaY: -100 })

      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(1.1)")
    })

    it("zooms out with scroll wheel on desktop", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      fireEvent.wheel(getMapBackdrop(), { deltaY: -100 })
      fireEvent.wheel(getMapBackdrop(), { deltaY: 100 })

      const image = screen.getByAltText("Floor Directory")
      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(1)")
    })

    it("clamps zoom at minimum fit-to-viewport", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      fireEvent.wheel(getMapBackdrop(), { deltaY: 1000 })

      const image = screen.getByAltText("Floor Directory")
      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(1)")
    })

    it("clamps zoom at maximum readable level", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      for (let i = 0; i < 100; i++) {
        fireEvent.wheel(getMapBackdrop(), { deltaY: -100 })
      }

      const image = screen.getByAltText("Floor Directory")
      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(3)")
    })

    it("zooms with pinch gesture on touch screens", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      const image = screen.getByAltText("Floor Directory")
      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(1)")

      fireEvent.touchStart(getMapBackdrop(), {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 },
        ],
      })

      fireEvent.touchMove(getMapBackdrop(), {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 300, clientY: 100 },
        ],
      })

      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(2)")
    })

    it("pans the zoomed image with mouse drag on desktop", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      fireEvent.wheel(getMapBackdrop(), { deltaY: -100 })

      const image = screen.getByAltText("Floor Directory")
      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(1.1)")

      fireEvent.mouseDown(image.parentElement, { clientX: 100, clientY: 100 })
      fireEvent.mouseMove(getMapBackdrop(), { clientX: 200, clientY: 200 })

      expect(image).not.toHaveStyle("transform: translate(0px, 0px) scale(1.1)")
    })

    it("pans the zoomed image with single-finger drag on touch screens", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      fireEvent.wheel(getMapBackdrop(), { deltaY: -100 })

      const image = screen.getByAltText("Floor Directory")
      expect(image).toHaveStyle("transform: translate(0px, 0px) scale(1.1)")

      fireEvent.touchStart(getMapBackdrop(), {
        touches: [{ clientX: 100, clientY: 100 }],
      })

      fireEvent.touchMove(getMapBackdrop(), {
        touches: [{ clientX: 250, clientY: 150 }],
      })

      expect(image).not.toHaveStyle("transform: translate(0px, 0px) scale(1.1)")
    })

    it("resets pan and zoom when the modal is reopened", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      fireEvent.wheel(getMapBackdrop(), { deltaY: -100 })

      const image = screen.getByAltText("Floor Directory")
      fireEvent.mouseDown(image.parentElement, { clientX: 100, clientY: 100 })
      fireEvent.mouseMove(getMapBackdrop(), { clientX: 200, clientY: 200 })

      expect(image).not.toHaveStyle("transform: translate(0px, 0px) scale(1.1)")

      fireEvent.click(screen.getByRole("button", { name: "Close floor directory" }))
      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      const resetImage = screen.getByAltText("Floor Directory")
      expect(resetImage).toHaveStyle("transform: translate(0px, 0px) scale(1)")
    })
  })
})
