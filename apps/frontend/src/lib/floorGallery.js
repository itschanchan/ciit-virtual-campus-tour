const galleryModules = import.meta.glob(
  "../assets/gallery/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

function getFolderFromPath(path) {
  const parts = path.split("/");
  return parts[3] ?? "";
}

function getFileName(path) {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? "";
}

function humanizeFileName(fileName) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  return withoutExtension.replace(/[-_]+/g, " ").trim();
}

function sortByFileName(first, second) {
  return first.fileName.localeCompare(second.fileName, undefined, {
    numeric: true,
  });
}

export function getFloorGalleryImages(floor, locationName = "") {
  if (!floor) {
    return [];
  }

  const folder = floor.toLowerCase();
  const sortedFiles = Object.entries(galleryModules)
    .filter(([path]) => getFolderFromPath(path) === folder)
    .map(([path, src]) => ({ src, fileName: getFileName(path) }))
    .sort(sortByFileName);

  return sortedFiles.map((file, index) => {
    const label = humanizeFileName(file.fileName) || `View ${index + 1}`;

    return {
      src: file.src,
      alt: locationName ? `${locationName} - ${label}` : label,
      caption: label,
      order: index,
    };
  });
}
