import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { dialogPaperSx, dialogTitleSx } from "../lib/dialogStyles";

const CREDITS = [
  "Presented by CIIT College of Innovation and Integrated Technology.",
  "Tour content, location descriptions, and narration produced by the CIIT community.",
  "Built with React, Marzipano, and Material UI.",
  "Thank you to the CIIT students, faculty, and staff who shared their campus.",
];

export default function AboutDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="about-dialog-title"
      slotProps={{
        paper: { sx: dialogPaperSx },
        transition: { onExited: onClose },
      }}
    >
      <DialogTitle id="about-dialog-title" sx={dialogTitleSx}>
        <span>About the Virtual Campus Tour</span>
        <IconButton
          size="small"
          aria-label="Close about dialog"
          onClick={onClose}
          sx={{ color: "inherit" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent data-testid="about-dialog-content" sx={{ paddingTop: 1 }}>
        <p className="mt-0 mb-4 text-sm leading-relaxed">
          The CIIT Virtual Campus Tour is a 360-degree walkthrough of the CIIT
          campus. Explore each floor, preview classrooms and facilities, and get
          a feel for student life before you visit in person.
        </p>

        <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
          Credits
        </h3>

        <ul className="mb-4 grid list-none gap-2 p-0 text-sm leading-relaxed">
          {CREDITS.map((credit) => (
            <li key={credit}>{credit}</li>
          ))}
        </ul>

        <a
          href="https://www.ciit.edu.ph/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="CIIT official website"
          className="hover:text-accent-hover text-sm font-bold underline"
        >
          Visit the official CIIT website
        </a>
      </DialogContent>
    </Dialog>
  );
}
