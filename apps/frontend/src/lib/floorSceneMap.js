// Floor labels in sidebar display order.
export const FLOOR_SEQUENCE = [
  "LG",
  "UG",
  "1F",
  "2F",
  "3F",
  "4F",
  "5F",
  "5M",
  "6F",
  "7F",
  "8F",
  "9F",
  "10F",
  "11F",
];

// Maps each floor label to its designated first scene ID
// (per spec: Sidebar Buttons and Panorama ID Guide).
export const FLOOR_SCENE_MAP = {
  LG: "0-lg---1",
  UG: "6-ug---2",
  "4F": "10-4f---1",
  "5F": "23-5f---1",
  "5M": "27-5m---1",
  "6F": "34-6f---11",
  "7F": "38-7f---5",
  "8F": "46-8f---6",
  "9F": "51-9f---5",
};

// Maps a scene ID's floor code (e.g. "lg" in "0-lg---1") to its floor label.
const FLOOR_CODE_MAP = FLOOR_SEQUENCE.reduce((map, floor) => {
  map[floor.toLowerCase()] = floor;
  return map;
}, {});

// Resolves the floor for ANY scene ID by reading the floor code between the
// first and second dashes, so every scene (not just the nine first scenes)
// syncs the sidebar (Integration Rule #1).
export function getFloorForSceneId(sceneId) {
  if (!sceneId) {
    return null;
  }

  const parts = sceneId.split("-");
  const floorCode = parts[1] ?? "";
  return FLOOR_CODE_MAP[floorCode] ?? null;
}

export function getSceneIdForFloor(floor) {
  return FLOOR_SCENE_MAP[floor] ?? null;
}

export function getFloorForLocation(location) {
  if (!location || typeof location.order !== "number") {
    return null;
  }

  return FLOOR_SEQUENCE[location.order] ?? null;
}

export function getFloorIndex(floor) {
  return FLOOR_SEQUENCE.indexOf(floor);
}
