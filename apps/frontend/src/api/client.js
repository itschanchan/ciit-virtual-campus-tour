export async function fetchHealth({ signal, fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('Fetch is not available.')
  }

  const response = await fetchImpl('/api/health', {
    signal,
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Backend status is unavailable.')
  }

  return response.json()
}

export async function checkBackendStatus(options) {
  try {
    return await fetchHealth(options)
  } catch {
    return null
  }
}
