# Paronama Viewer & Sidebar Buttons Integration

This is the document for integrating panorama tiles to the buttons in the sidebar.

## Sidebar Buttons and Panorama ID Guide

The name of the floor shall display the panorama by calling its ID. Here is the guide which tile to display when each button is triggered:

- **LG**: "0-lg---1",
- **UG**: "6-ug---2",
- **4F**: "10-4f---1",
- **5F**: "23-5f---1",
- **5M**: "27-5m---1",
- **6F**: "34-6f---11",
- **7F**: "38-7f---5",
- **8F**: "46-8f---6",
- **9F**: "51-9f---5",

---

## Integration Rules

1. **Button Sync:** The side bar buttons in order (the list above) shall be synchronized with the current displayed panorama.

Example: All of the panorama tiles with "lg" with its ID will sync in with the LG button.

2. **Active Button**: Display the location ID (from `catalog.json`) only on the active button.
