export const dialogPaperSx = {
  backgroundColor: "var(--color-surface)",
  color: "var(--color-ink)",
  border: "1px solid var(--color-line)",
  borderRadius: "var(--radius-panel)",
};

export const dialogTitleSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  paddingRight: 1,
};

export const dialogActionSx = {
  justifyContent: "flex-start",
  textTransform: "none",
  borderColor: "var(--color-line)",
  color: "var(--color-ink)",
  "&:hover": {
    borderColor: "var(--color-accent)",
    backgroundColor: "var(--color-accent-soft)",
  },
};
