import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
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
      maxWidth="md"
      aria-labelledby="about-dialog-title"
      slotProps={{
        paper: { sx: dialogPaperSx },
        transition: { onExited: onClose },
      }}
    >
      <DialogTitle id="about-dialog-title" sx={dialogTitleSx}>
        <span></span>
        <IconButton
          size="small"
          aria-label="Close about dialog"
          onClick={onClose}
          sx={{ color: "inherit", ml: "auto" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent data-testid="about-dialog-content" sx={{ paddingTop: 1 }}>
        {/* Row 1: Logo | About Title + Paragraph | Credits (Div In Row) */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex shrink-0 flex-col items-center gap-2 text-center">
            <img
              src={"/img/ciit_glitch_virtual_tour_logo.png"}
              alt="CIIT logo"
              className="h-16 w-auto sm:h-45"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-ink mb-2 text-lg font-bold tracking-[0.12em] uppercase">
              About the Virtual Campus Tour
            </h2>
            <p className="mt-0 mb-4 text-sm leading-relaxed">
              The CIIT Virtual Campus Tour is a 360-degree walkthrough of the
              CIIT campus. Explore each floor, preview classrooms and
              facilities, and get a feel for student life before you visit in
              person.
            </p>
          </div>
        </div>

        {/* Credits */}
        <div className="min-w-0 flex-1">
          <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
            Credits
          </h3>

          <ul className="list-none gap-2 p-0 text-sm leading-relaxed">
            {CREDITS.map((credit) => (
              <li key={credit}>{credit}</li>
            ))}
          </ul>
        </div>

        {/* Row 2: [Tech Lead + Frontend] column | Backend row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex shrink-0 flex-col gap-4">
            <div>
              <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
                Tech Lead
              </h3>
              <p className="text-sm leading-relaxed">
                Sean Andrei A. Lacson, BS Computer Science
              </p>
            </div>
            <div>
              <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
                Frontend Team
              </h3>
              <p className="text-sm leading-relaxed">
                Azzy Dela Cruz, BS Computer Science
              </p>
              <p className="text-sm leading-relaxed">
                Cedrick Julianne Ocampo, BS Computer Science
              </p>
              <p className="text-sm leading-relaxed">
                Maverick Russell Luna, BS Computer Science
              </p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
              Backend Team
            </h3>
            <p className="text-sm leading-relaxed">
              Ariel Pontejos III, BS Computer Science
            </p>
            <p className="text-sm leading-relaxed">
              Laurence Kobe Catuiran, BS Computer Science
            </p>
            <p className="text-sm leading-relaxed">
              Peter Jorai Barraquias, BS Computer Science
            </p>
            <p className="text-sm leading-relaxed">
              Vincent Kyle Barayoga, BS Computer Science
            </p>
          </div>
        </div>

        {/* Row 3: Photography | Voice Over row, then Professors below */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="min-w-0 flex-1">
              <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
                Photography
              </h3>
              <p className="text-sm leading-relaxed">
                Cedrik Julianne Ocampo, BS Computer Science
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
                Voice Over
              </h3>
              <p className="text-sm leading-relaxed">
                Ricoh Roswell Ashton Ng, BS Computer Science
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-accent mb-2 text-xs font-extrabold tracking-[0.16em] uppercase">
              Special thanks to:
            </h3>
            <p className="mb-4 text-sm leading-relaxed">
              Cecilia S. Mendoza, Software Engineering 1
            </p>
            <p className="mb-4 text-sm leading-relaxed">
              Rizaldy Rapsing, Program Head
            </p>
          </div>
        </div>

        <Divider sx={{ marginY: 3 }} />

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

      <p className="text-muted mt-4 mb-0 text-center text-[0.7rem]">
        version 1.0.0
      </p>
    </Dialog>
  );
}
