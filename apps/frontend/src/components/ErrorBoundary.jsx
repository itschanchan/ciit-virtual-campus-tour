import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("The tour encountered an unexpected rendering error.", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="compact:p-6 narrow:p-4 compact:justify-items-center narrow:justify-items-center compact:gap-3 narrow:gap-3 grid min-h-dvh place-content-center justify-items-start gap-4 p-8"
          role="alert"
        >
          <p className="text-accent compact:text-xs narrow:text-xs mb-0 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">
            CIIT Virtual Campus Tour
          </p>
          <h1 className="compact:max-w-xs narrow:max-w-xs compact:text-3xl narrow:text-2xl mb-0 max-w-[20ch] text-[clamp(2rem,6vw,4rem)]">
            The tour needs a fresh start.
          </h1>
          <p className="text-muted compact:max-w-lg narrow:max-w-md compact:text-sm narrow:text-sm max-w-[42rem]">
            Something unexpected happened while showing the tour. Reload the
            page to try again.
          </p>
          <button
            type="button"
            className="bg-accent text-accent-ink hover:bg-accent-hover compact:w-full narrow:w-full inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-transparent px-4 py-2 font-bold transition-colors"
            onClick={this.handleRetry}
          >
            Reload the tour
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
