import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('The tour encountered an unexpected rendering error.', error)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error" role="alert">
          <p className="eyebrow">CIIT Virtual Campus Tour</p>
          <h1>The tour needs a fresh start.</h1>
          <p>Something unexpected happened while showing the tour. Reload the page to try again.</p>
          <button type="button" className="primary-button" onClick={this.handleRetry}>
            Reload the tour
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
