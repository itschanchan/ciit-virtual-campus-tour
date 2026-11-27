import { useEffect, useRef } from "react";
import FloorDirectoryViewer from "./FloorDirectoryViewer";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  const elements = container.querySelectorAll(FOCUSABLE_SELECTOR);

  return Array.from(elements).filter((element) => {
    return !element.hasAttribute("hidden");
  });
}

function trapFocus(event, container) {
  const focusable = getFocusableElements(container);

  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const activeElement = document.activeElement;
  const focusIsInside = container.contains(activeElement);

  if (event.shiftKey && (!focusIsInside || activeElement === first)) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export default function FloorDirectoryDialog({
  open,
  onClose,
  imageSrc = "/img/glitch_directory.png",
  imageAlt = "Floor Directory",
  returnFocusRef,
}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const returnTarget = returnFocusRef?.current;
    const previousFocus = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key === "Tab") {
        trapFocus(event, dialogRef.current);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (returnTarget?.isConnected) {
        returnTarget.focus();
        return;
      }

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open, returnFocusRef]);

  return (
    <div
      className={`bg-canvas/78 backdrop-blur-gallery tiny:p-0 fixed inset-0 z-60 grid place-items-center p-5 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      inert={!open}
      aria-hidden={!open}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCloseRef.current?.();
        }
      }}
    >
      <section
        ref={dialogRef}
        id="floor-directory"
        className={`rounded-gallery-panel bg-surface shadow-gallery tiny:h-dvh tiny:max-h-dvh tiny:w-full tiny:rounded-none tiny:p-3 flex h-[90dvh] max-h-[52rem] w-[min(68rem,100%)] flex-col overflow-hidden p-5 transition-all duration-300 ease-out sm:p-5 ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="floor-directory-title"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id="floor-directory-title"
            className="mb-0 text-[clamp(1.4rem,3vw,2rem)]"
          >
            Floor Directory
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="bg-surface text-ink hover:text-accent focus-visible:ring-accent inline-flex size-11 shrink-0 items-center justify-center gap-1.5 rounded-full text-xl leading-none transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Close floor directory"
            onClick={() => onCloseRef.current?.()}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <FloorDirectoryViewer
            src={imageSrc}
            alt={imageAlt}
            active={open}
          />
        </div>
      </section>
    </div>
  );
}
