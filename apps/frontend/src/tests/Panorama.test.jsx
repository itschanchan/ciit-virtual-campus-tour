import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, act } from "@testing-library/react"
import { TourProvider } from "../context/TourContext"
import { useTour } from "../context/useTour"
import { catalogData } from "../lib/catalog"

// Mock PanoramaViewer so it calls onReady immediately, isolating Panorama's
// autoplay timer logic from Marzipano internals.
vi.mock("../components/PanoramaViewer", () => ({
  default: function PanoramaViewer({ onReady }) {
    setTimeout(() => onReady?.(), 0)
    return null
  },
}))

import Panorama from "../pages/Panorama"

function cloneCatalog() {
  return JSON.parse(JSON.stringify(catalogData))
}

function Harness() {
  const { narrationStatus } = useTour()
  return <p>narration:{narrationStatus}</p>
}

describe("Panorama autoplay", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("starts playback one second after the viewer reports ready", async () => {
    const catalog = cloneCatalog()

    render(
      <TourProvider catalogSource={catalog}>
        <Harness />
        <Panorama />
      </TourProvider>,
    )

    await waitFor(() =>
      expect(screen.getByText("narration:idle")).toBeInTheDocument(),
    )

    // PanoramaViewer mock calls onReady via setTimeout(0).
    // Then Panorama's 1000 ms autoplay timer fires playNarration.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    })

    expect(screen.getByText("narration:loading")).toBeInTheDocument()
  })

  it("does not schedule another timer once playback is loading", async () => {
    const catalog = cloneCatalog()

    render(
      <TourProvider catalogSource={catalog}>
        <Harness />
        <Panorama />
      </TourProvider>,
    )

    await waitFor(() =>
      expect(screen.getByText("narration:idle")).toBeInTheDocument(),
    )

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    })

    expect(screen.getByText("narration:loading")).toBeInTheDocument()

    // Wait another second: status is "loading", so no new timer fires.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    })

    expect(screen.getByText("narration:loading")).toBeInTheDocument()
  })
})
