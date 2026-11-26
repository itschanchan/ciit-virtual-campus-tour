const FALLBACK_SCALE = 1;
const MAX_ZOOM_FACTOR = 4;
const MIN_PERCENT = 100;
const MAX_PERCENT = 400;

function isPositiveNumber(value) {
  return Number.isFinite(value) && value > 0;
}

export function measureFitScale({
  wrapperWidth,
  wrapperHeight,
  contentWidth,
  contentHeight,
}) {
  if (!isPositiveNumber(wrapperWidth) || !isPositiveNumber(wrapperHeight)) {
    return FALLBACK_SCALE;
  }

  if (!isPositiveNumber(contentWidth) || !isPositiveNumber(contentHeight)) {
    return FALLBACK_SCALE;
  }

  const widthRatio = wrapperWidth / contentWidth;
  const heightRatio = wrapperHeight / contentHeight;
  const fitScale = Math.min(widthRatio, heightRatio);

  return isPositiveNumber(fitScale) ? fitScale : FALLBACK_SCALE;
}

export function getMaxScale(fitScale) {
  const safeFitScale = isPositiveNumber(fitScale) ? fitScale : FALLBACK_SCALE;

  return safeFitScale * MAX_ZOOM_FACTOR;
}

export function getZoomPercent(scale, fitScale) {
  const safeFitScale = isPositiveNumber(fitScale) ? fitScale : FALLBACK_SCALE;

  if (!isPositiveNumber(scale)) {
    return MIN_PERCENT;
  }

  const percent = Math.round((scale / safeFitScale) * 100);

  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, percent));
}
