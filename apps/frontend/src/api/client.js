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

export async function fetchAnalyticsSummary(range, options = {}) {
  const { signal } = options
  return fetch('/api/analytics/summary?range=' + range, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal,
  }).then(resp => {
    if (!resp.ok) {
      if (resp.status === 401) {
        const err = new Error('unauthorised')
        err.code = 'unauthorised'
        throw err
      }
      const err = new Error(`${resp.status} ${resp.statusText}`)
      err.code = 'server-error'
      throw err
    }
    return resp.json()
  })
}

export async function checkBackendStatus(options) {
  try {
    return await fetchHealth(options)
  } catch {
    return null
  }
}
