import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import NarrationTranscript from "../components/NarrationTranscript"
import { clearTranscriptCache } from "../lib/transcripts"

const fetchMock = vi.fn()

beforeEach(() => {
  globalThis.fetch = fetchMock
  clearTranscriptCache()
})

afterEach(() => {
  vi.restoreAllMocks()
  delete globalThis.fetch
})

describe("NarrationTranscript", () => {
  it("shows loading state while fetching", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "First paragraph.\n\nSecond paragraph.",
    })

    render(<NarrationTranscript src="/transcripts/1.md" />)

    expect(
      screen.getByText("Loading transcript..."),
    ).toBeInTheDocument()
  })

  it("renders paragraphs after a successful fetch", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.",
    })

    render(<NarrationTranscript src="/transcripts/1.md" />)

    await waitFor(() =>
      expect(screen.getByText("First paragraph.")).toBeInTheDocument(),
    )
    await waitFor(() =>
      expect(screen.getByText("Second paragraph.")).toBeInTheDocument(),
    )
    await waitFor(() =>
      expect(screen.getByText("Third paragraph.")).toBeInTheDocument(),
    )
  })

  it("shows the fallback when the fetch fails", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"))

    render(<NarrationTranscript src="/transcripts/missing.md" />)

    await waitFor(() =>
      expect(
        screen.getByText("Transcript not available yet."),
      ).toBeInTheDocument(),
    )
  })

  it("shows the fallback when the response is not ok", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 })

    render(<NarrationTranscript src="/transcripts/missing.md" />)

    await waitFor(() =>
      expect(
        screen.getByText("Transcript not available yet."),
      ).toBeInTheDocument(),
    )
  })

  it("shows the fallback when the text is empty", async () => {
    fetchMock.mockResolvedValue({ ok: true, text: async () => "   " })

    render(<NarrationTranscript src="/transcripts/empty.md" />)

    await waitFor(() =>
      expect(
        screen.getByText("Transcript not available yet."),
      ).toBeInTheDocument(),
    )
  })

  it("shows the fallback when src is empty", async () => {
    render(<NarrationTranscript src="" />)

    await waitFor(() =>
      expect(
        screen.getByText("Transcript not available yet."),
      ).toBeInTheDocument(),
    )
  })

  it("caches the transcript so fetch is called once", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "Cached paragraph.",
    })

    render(<NarrationTranscript src="/transcripts/cached.md" />)
    await waitFor(() =>
      expect(screen.getByText("Cached paragraph.")).toBeInTheDocument(),
    )

    render(<NarrationTranscript src="/transcripts/cached.md" />)
    await waitFor(() =>
      expect(screen.getByText("Cached paragraph.")).toBeInTheDocument(),
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
