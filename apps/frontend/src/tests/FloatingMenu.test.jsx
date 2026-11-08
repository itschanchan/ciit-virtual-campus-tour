import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
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

describe("FloatingMenu", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    defaultProps.onPlay.mockReset()
    defaultProps.onPause.mockReset()
    defaultProps.onStatusChange.mockReset()
    defaultProps.onMuteToggle.mockReset()
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
})
