import { useCallback, useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { usePrefersReducedMotion } from "../lib/motion";
import {
  getMaxScale,
  getZoomPercent,
  measureFitScale,
} from "../lib/zoomViewer";

const ZOOM_STEP_FACTOR = 0.25;
const DOUBLE_CLICK_FACTOR = 2;
const DEFAULT_MAX_SCALE = 100;
const PENDING_MIN_SCALE = 0.001;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_DISTANCE = 30;
const TAP_MOVE_LIMIT = 10;

const TOOL_BUTTON_CLASS =
  "bg-surface-soft text-ink hover:text-accent focus-visible:ring-accent inline-flex size-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

function readInstanceFitScale(instance) {
  if (!instance) {
    return null;
  }

  const wrapper = instance.wrapperComponent;
  const content = instance.contentComponent;

  if (!wrapper || !content) {
    return null;
  }

  if (!wrapper.clientWidth || !wrapper.clientHeight) {
    return null;
  }

  if (!content.offsetWidth || !content.offsetHeight) {
    return null;
  }

  return measureFitScale({
    wrapperWidth: wrapper.clientWidth,
    wrapperHeight: wrapper.clientHeight,
    contentWidth: content.offsetWidth,
    contentHeight: content.offsetHeight,
  });
}

function isShortTap(start, touch) {
  if (!start) {
    return false;
  }

  const movedX = Math.abs(touch.clientX - start.x);
  const movedY = Math.abs(touch.clientY - start.y);

  return movedX <= TAP_MOVE_LIMIT && movedY <= TAP_MOVE_LIMIT;
}

export default function FloorDirectoryViewer({
  src,
  alt,
  active,
  onImageStatusChange,
}) {
  const transformRef = useRef(null);
  const fitScaleRef = useRef(1);
  const pendingFitRef = useRef(false);
  const lastTapRef = useRef(null);
  const tapStartRef = useRef(null);

  const [fitScale, setFitScale] = useState(1);
  const [boundsReady, setBoundsReady] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [imageStatus, setImageStatus] = useState("loading");
  const reducedMotion = usePrefersReducedMotion();

  const animationTime = reducedMotion ? 0 : 250;

  const syncFitScale = useCallback(() => {
    const instance = transformRef.current?.instance;
    const nextFitScale = readInstanceFitScale(instance);

    if (nextFitScale === null) {
      return null;
    }

    fitScaleRef.current = nextFitScale;
    setFitScale(nextFitScale);
    setBoundsReady(true);

    return nextFitScale;
  }, []);

  const fitView = useCallback(
    (duration = animationTime) => {
      transformRef.current?.fitToView({ animationTime: duration });
    },
    [animationTime],
  );

  const handleTransform = useCallback((_ref, state) => {
    const nextPercent = getZoomPercent(state.scale, fitScaleRef.current);
    setZoomPercent((current) => (current === nextPercent ? current : nextPercent));
  }, []);

  const handleInit = useCallback(() => {
    syncFitScale();
  }, [syncFitScale]);

  useEffect(() => {
    if (!active || imageStatus !== "ready") {
      return;
    }

    const previousFitScale = fitScaleRef.current;
    const nextFitScale = syncFitScale();

    pendingFitRef.current =
      nextFitScale !== null && nextFitScale !== previousFitScale;
    fitView();
  }, [active, imageStatus, fitView, syncFitScale]);

  useEffect(() => {
    if (!active || !boundsReady || !pendingFitRef.current) {
      return;
    }

    pendingFitRef.current = false;
    fitView();
  }, [active, boundsReady, fitScale, fitView]);

  const handleResize = useCallback(() => {
    if (!active) {
      return;
    }

    const instance = transformRef.current?.instance;

    if (!instance) {
      return;
    }

    const currentPercent = getZoomPercent(
      instance.state.scale,
      fitScaleRef.current,
    );
    const previousFitScale = fitScaleRef.current;
    const nextFitScale = syncFitScale();

    if (nextFitScale === null || currentPercent > 100) {
      return;
    }

    pendingFitRef.current = nextFitScale !== previousFitScale;
    fitView(0);
  }, [active, fitView, syncFitScale]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [active, handleResize]);

  useEffect(() => {
    if (!active || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const instance = transformRef.current?.instance;
    const wrapper = instance?.wrapperComponent;
    const content = instance?.contentComponent;

    if (!wrapper) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(wrapper);

    if (content) {
      observer.observe(content);
    }

    return () => {
      observer.disconnect();
    };
  }, [active, handleResize]);

  function reportStatus(nextStatus) {
    setImageStatus(nextStatus);
    onImageStatusChange?.(nextStatus);
  }

  function handleImageLoad() {
    reportStatus("ready");
  }

  function handleImageError() {
    reportStatus("failed");
  }

  function zoomIn() {
    transformRef.current?.zoomIn(fitScaleRef.current * ZOOM_STEP_FACTOR, animationTime);
  }

  function zoomOut() {
    transformRef.current?.zoomOut(fitScaleRef.current * ZOOM_STEP_FACTOR, animationTime);
  }

  function resetView() {
    transformRef.current?.resetTransform(animationTime);
  }

  function toggleZoom(clientX, clientY) {
    const instance = transformRef.current;

    if (!instance) {
      return;
    }

    const currentFitScale = fitScaleRef.current;
    const isFitted = instance.state.scale <= currentFitScale * 1.01;

    if (!isFitted) {
      fitView();
      return;
    }

    const targetScale = Math.min(
      getMaxScale(currentFitScale),
      currentFitScale * DOUBLE_CLICK_FACTOR,
    );

    instance.zoomToPoint(targetScale, clientX, clientY, animationTime);
  }

  function handleDoubleClick(event) {
    event.preventDefault();
    toggleZoom(event.clientX, event.clientY);
  }

  function handleTouchStart(event) {
    if (event.touches.length !== 1) {
      tapStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    tapStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    const touch = event.changedTouches?.[0];
    const start = tapStartRef.current;

    tapStartRef.current = null;

    if (!touch || !isShortTap(start, touch)) {
      lastTapRef.current = null;
      return;
    }

    const now = Date.now();
    const lastTap = lastTapRef.current;
    const isDoubleTap =
      lastTap !== null &&
      now - lastTap.time <= DOUBLE_TAP_MS &&
      Math.abs(touch.clientX - lastTap.x) <= DOUBLE_TAP_DISTANCE &&
      Math.abs(touch.clientY - lastTap.y) <= DOUBLE_TAP_DISTANCE;

    lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };

    if (isDoubleTap) {
      lastTapRef.current = null;
      toggleZoom(touch.clientX, touch.clientY);
    }
  }

  if (imageStatus === "failed") {
    return (
      <div
        role="alert"
        className="text-muted grid h-full place-items-center rounded-xl bg-surface-strong px-6 text-center"
      >
        The floor directory is unavailable right now. Close this dialog and
        try again.
      </div>
    );
  }

  const isReady = imageStatus === "ready";
  const canZoomIn = isReady && zoomPercent < 400;
  const canZoomOut = isReady && zoomPercent > 100;
  const canReset = isReady && zoomPercent > 100;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-surface-strong">
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={boundsReady ? fitScale : PENDING_MIN_SCALE}
          maxScale={boundsReady ? getMaxScale(fitScale) : DEFAULT_MAX_SCALE}
          limitToBounds
          disablePadding
          centerZoomedOut
          fitOnInit="contain"
          onInit={handleInit}
          onTransform={handleTransform}
          doubleClick={{ disabled: true }}
          wheel={{ step: 0.02 }}
          panning={{ velocityDisabled: reducedMotion }}
          velocityAnimation={{ disabled: reducedMotion }}
          autoAlignment={{
            sizeX: 0,
            sizeY: 0,
            animationTime: reducedMotion ? 0 : 200,
          }}
          zoomAnimation={{ disabled: reducedMotion }}
          keyboard={{
            disabled: false,
            panStep: 50,
            zoomStep: fitScale * ZOOM_STEP_FACTOR,
            animationTime: reducedMotion ? 0 : 150,
          }}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
              touchAction: "none",
              overscrollBehavior: "contain",
              cursor: zoomPercent > 100 ? "grab" : "zoom-in",
            }}
            wrapperProps={{
              role: "group",
              "aria-label": "Floor directory viewer",
              onDoubleClick: handleDoubleClick,
              onTouchStart: handleTouchStart,
              onTouchEnd: handleTouchEnd,
            }}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="block max-w-none select-none"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </TransformComponent>
        </TransformWrapper>

        {imageStatus === "loading" && (
          <p className="text-muted pointer-events-none absolute inset-0 grid place-items-center px-4 text-center">
            Loading the floor directory...
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={TOOL_BUTTON_CLASS}
            aria-label="Zoom out"
            onClick={zoomOut}
            disabled={!canZoomOut}
          >
            <ZoomOutIcon fontSize="small" />
          </button>
          <button
            type="button"
            className={TOOL_BUTTON_CLASS}
            aria-label="Zoom in"
            onClick={zoomIn}
            disabled={!canZoomIn}
          >
            <ZoomInIcon fontSize="small" />
          </button>
          <button
            type="button"
            className={TOOL_BUTTON_CLASS}
            aria-label="Reset view"
            onClick={resetView}
            disabled={!canReset}
          >
            <RestartAltIcon fontSize="small" />
          </button>
        </div>

        <span
          className="text-muted text-[0.85rem] font-bold tabular-nums"
          aria-label="Zoom level"
        >
          {zoomPercent}%
        </span>
      </div>
    </div>
  );
}
