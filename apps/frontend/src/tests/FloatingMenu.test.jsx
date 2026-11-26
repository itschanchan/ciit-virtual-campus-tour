import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import FloatingMenu from "../components/FloatingMenu"

const narration = {
  audioSrc: "/voice/CIIT_Glitch_Virtual_Campus_Recording_3.mp3",
  transcriptSrc: "/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_3.md",
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
    delete globalThis.fetch
    vi.restoreAllMocks()
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

  describe("Narration audio element", () => {
    const narrationWithSrc = {
      ...defaultProps.narration,
      audioSrc: "/voice/CIIT_Glitch_Virtual_Campus_Recording_3.mp3",
      transcriptSrc: "/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_3.md",
    }

    it("mounts a hidden audio element with the narration source", () => {
      render(<FloatingMenu {...defaultProps} narration={narrationWithSrc} />)

      const audio = document.querySelector("audio")
      expect(audio).toBeInTheDocument()
      expect(audio).toHaveAttribute("src", narrationWithSrc.audioSrc)
      expect(audio).toHaveAttribute("preload", "metadata")
      expect(audio).toHaveAttribute("aria-hidden", "true")
    })

    it("calls onPlay and plays the audio when clicked while idle", () => {
      const playSpy = vi.spyOn(HTMLMediaElement.prototype, "play")
      render(
        <FloatingMenu
          {...defaultProps}
          narration={narrationWithSrc}
          status="idle"
        />,
      )

      fireEvent.click(screen.getByRole("button", { name: "Play narration" }))
      expect(defaultProps.onPlay).toHaveBeenCalledTimes(1)
      expect(playSpy).toHaveBeenCalled()
    })

    it("calls onPause and pauses the audio when clicked while playing", () => {
      const pauseSpy = vi.spyOn(HTMLMediaElement.prototype, "pause")
      render(
        <FloatingMenu
          {...defaultProps}
          narration={narrationWithSrc}
          status="playing"
        />,
      )

      fireEvent.click(screen.getByRole("button", { name: "Pause narration" }))
      expect(defaultProps.onPause).toHaveBeenCalledTimes(1)
      expect(pauseSpy).toHaveBeenCalled()
    })

    it("shows Replay narration when the status is ended", () => {
      render(
        <FloatingMenu
          {...defaultProps}
          narration={narrationWithSrc}
          status="ended"
        />,
      )

      expect(
        screen.getByRole("button", { name: "Replay narration" }),
      ).toBeInTheDocument()
    })

    it("resets to position 0 and plays when Replay narration is clicked", () => {
      const playSpy = vi.spyOn(HTMLMediaElement.prototype, "play")
      render(
        <FloatingMenu
          {...defaultProps}
          narration={narrationWithSrc}
          status="ended"
        />,
      )

      fireEvent.click(screen.getByRole("button", { name: "Replay narration" }))
      expect(defaultProps.onPlay).toHaveBeenCalledTimes(1)
      expect(playSpy).toHaveBeenCalled()
    })

    it("keeps the play control enabled when blocked", () => {
      render(
        <FloatingMenu
          {...defaultProps}
          narration={narrationWithSrc}
          status="blocked"
        />,
      )

      const playButton = screen.getByRole("button", { name: "Play narration" })
      expect(playButton).not.toBeDisabled()
    })

    it("shows Narration unavailable and disables the play control on error", () => {
      render(
        <FloatingMenu
          {...defaultProps}
          narration={narrationWithSrc}
          status="error"
        />,
      )

      const playButton = screen.getByRole("button", {
        name: "Narration unavailable",
      })
      expect(playButton).toBeDisabled()
    })

    it("reports blocked when the play promise rejects", async () => {
      vi
        .spyOn(HTMLMediaElement.prototype, "play")
        .mockRejectedValueOnce(new Error("Blocked"))
      const onStatusChange = vi.fn()
      render(
        <FloatingMenu
          {...defaultProps}
          narration={narrationWithSrc}
          status="idle"
          onStatusChange={onStatusChange}
        />,
      )

      fireEvent.click(screen.getByRole("button", { name: "Play narration" }))
      await vi.waitFor(() => expect(onStatusChange).toHaveBeenCalledWith("blocked"))
    })
  })

  it("renders transcript when opened and narration present", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "Welcome to the CIIT Virtual Campus Tour.",
    })

    render(<FloatingMenu {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: "Show transcript" }))

    await waitFor(() =>
      expect(
        screen.getByText("Welcome to the CIIT Virtual Campus Tour."),
      ).toBeInTheDocument(),
    )
    expect(screen.getByRole("button", { name: "Hide transcript" })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
  })

  it("keeps the transcript mounted so it can animate open and closed", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "Welcome to the CIIT Virtual Campus Tour.",
    })

    render(<FloatingMenu {...defaultProps} />)

    const transcript = document.getElementById("floating-menu-transcript")
    expect(transcript).toBeInTheDocument()

    const panel = transcript.parentElement.parentElement
    expect(panel).toHaveAttribute("aria-hidden", "true")
    expect(panel).toHaveClass("grid-rows-[0fr]", "opacity-0")

    fireEvent.click(screen.getByRole("button", { name: "Show transcript" }))
    expect(panel).toHaveAttribute("aria-hidden", "false")
    expect(panel).toHaveClass("grid-rows-[1fr]", "opacity-100")

    fireEvent.click(screen.getByRole("button", { name: "Hide transcript" }))
    expect(panel).toHaveAttribute("aria-hidden", "true")
    expect(panel).toHaveClass("grid-rows-[0fr]", "opacity-0")
  })

  it("shows the transcript fallback when content is missing", async () => {
    render(
      <FloatingMenu
        {...defaultProps}
        narration={{
          ...defaultProps.narration,
          transcriptSrc: "",
        }}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Show transcript" }))

    await waitFor(() =>
      expect(
        screen.getByText("Transcript not available yet."),
      ).toBeInTheDocument(),
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

      const dialog = screen.getByRole("dialog", { name: "Floor Directory" })
      expect(dialog).toHaveAttribute("id", "floor-directory")
      expect(dialog).toHaveAttribute("aria-modal", "true")
    })

    it("displays the floor directory image with alt text", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      expect(screen.getByAltText("Floor Directory")).toBeInTheDocument()
    })

    it("closes the modal through the close button", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      fireEvent.click(
        screen.getByRole("button", { name: "Close floor directory" }),
      )

      expect(getMapBackdrop()).toHaveAttribute("aria-hidden", "true")
    })

    it("closes the modal through the backdrop", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      fireEvent.mouseDown(getMapBackdrop())

      expect(getMapBackdrop()).toHaveAttribute("aria-hidden", "true")
    })

    it("closes the modal through Escape", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      fireEvent.keyDown(document, { key: "Escape" })

      expect(getMapBackdrop()).toHaveAttribute("aria-hidden", "true")
    })

    it("does not enable vertical scrolling on the floor directory panel", () => {
      render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))

      expect(getMapDialog()).not.toHaveClass("overflow-y-auto")
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
      expect(getMapDialog()).not.toHaveClass("overflow-y-auto")
    })

    it("closes the directory when the gallery opens", () => {
      const onClose = vi.fn()
      const { rerender } = render(
        <FloatingMenu {...defaultProps} open={false} onClose={onClose} />,
      )

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      expect(getMapBackdrop()).toHaveAttribute("aria-hidden", "false")

      rerender(<FloatingMenu {...defaultProps} open onClose={onClose} />)

      expect(getMapBackdrop()).toHaveAttribute("aria-hidden", "true")
    })

    it("closes the directory when the sidebar opens", () => {
      const { rerender } = render(<FloatingMenu {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: "Open map" }))
      expect(getMapBackdrop()).toHaveAttribute("aria-hidden", "false")

      rerender(<FloatingMenu {...defaultProps} sidebarOpen />)

      expect(getMapBackdrop()).toHaveAttribute("aria-hidden", "true")
    })
  })
})
