import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import ForumIcon from "@mui/icons-material/Forum";
import IosShareIcon from "@mui/icons-material/IosShare";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";
import {
  DISCORD_URL,
  MESSENGER_URL,
  SHARE_MESSAGE,
  buildEmailShareUrl,
  buildFacebookShareUrl,
  buildWhatsAppShareUrl,
  buildXShareUrl,
  getTourUrl,
} from "../lib/shareLinks";
import {
  dialogActionSx,
  dialogPaperSx,
  dialogTitleSx,
} from "../lib/dialogStyles";

const DESTINATIONS = [
  { key: "facebook", label: "Share on Facebook", text: "Facebook", Icon: FacebookIcon },
  { key: "messenger", label: "Share on Messenger", text: "Messenger", Icon: ChatBubbleIcon },
  { key: "x", label: "Share on X", text: "X", Icon: XIcon },
  { key: "discord", label: "Share on Discord", text: "Discord", Icon: ForumIcon },
  { key: "whatsapp", label: "Share on WhatsApp", text: "WhatsApp", Icon: WhatsAppIcon },
  { key: "email", label: "Share by email", text: "Email", Icon: EmailIcon },
];

const URL_BUILDERS = {
  facebook: buildFacebookShareUrl,
  x: buildXShareUrl,
  whatsapp: buildWhatsAppShareUrl,
  email: buildEmailShareUrl,
};

const LINK_FIELD_SX = {
  "& .MuiInputBase-input": { color: "var(--color-ink)" },
  "& .MuiInputLabel-root": { color: "var(--color-muted)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-line)" },
};

const COPY_FAILED_MESSAGE =
  "Copy was blocked. Select the link above to copy it manually.";
const PENDING_PASTE_MESSAGE =
  "Link copied. Paste it in the chat to share the tour.";

function openDestination(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();

  const copied = document.execCommand?.("copy");
  field.remove();

  if (!copied) {
    throw new Error("Copy failed");
  }
}

export default function ShareDialog({ open, onClose }) {
  const [notice, setNotice] = useState(null);
  const [failed, setFailed] = useState(false);
  const tourUrl = getTourUrl();
  const canUseNativeShare = typeof navigator?.share === "function";

  function handleExited() {
    setNotice(null);
    setFailed(false);
    onClose?.();
  }

  async function handleCopy() {
    try {
      await copyText(tourUrl);
      setFailed(false);
      setNotice("Link copied to your clipboard.");
    } catch {
      setFailed(true);
      setNotice(COPY_FAILED_MESSAGE);
    }
  }

  async function copyThenOpen(destinationUrl) {
    try {
      await copyText(tourUrl);
      setFailed(false);
      setNotice(PENDING_PASTE_MESSAGE);
    } catch {
      setFailed(true);
      setNotice(COPY_FAILED_MESSAGE);
    }

    openDestination(destinationUrl);
  }

  function handleDestination(key) {
    if (key === "messenger") {
      copyThenOpen(MESSENGER_URL);
      return;
    }

    if (key === "discord") {
      copyThenOpen(DISCORD_URL);
      return;
    }

    const buildUrl = URL_BUILDERS[key];
    if (buildUrl) {
      openDestination(buildUrl(tourUrl));
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({
        title: "CIIT Virtual Campus Tour",
        text: SHARE_MESSAGE,
        url: tourUrl,
      });
    } catch {
      setNotice(null);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="share-dialog-title"
      slotProps={{
        paper: { sx: dialogPaperSx },
        transition: { onExited: handleExited },
      }}
    >
      <DialogTitle id="share-dialog-title" sx={dialogTitleSx}>
        <span>Share this tour</span>
        <IconButton
          size="small"
          aria-label="Close share dialog"
          onClick={onClose}
          sx={{ color: "inherit" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent data-testid="share-dialog-content" sx={{ paddingTop: 1 }}>
        <p className="text-muted mt-0 mb-3 text-sm">
          Send the virtual campus tour to a friend, classmate, or community.
        </p>

        <TextField
          value={tourUrl}
          label="Tour link"
          size="small"
          fullWidth
          slotProps={{ input: { readOnly: true } }}
          sx={LINK_FIELD_SX}
        />

        {notice && (
          <Alert severity={failed ? "error" : "success"} sx={{ marginTop: 2 }}>
            {notice}
          </Alert>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DESTINATIONS.map(({ key, label, text, Icon }) => (
            <Button
              key={key}
              variant="outlined"
              startIcon={<Icon />}
              aria-label={label}
              onClick={() => handleDestination(key)}
              sx={dialogActionSx}
            >
              {text}
            </Button>
          ))}
        </div>
      </DialogContent>

      <DialogActions sx={{ paddingX: 3, paddingBottom: 2 }}>
        <Button
          variant="contained"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
        >
          Copy tour link
        </Button>

        {canUseNativeShare && (
          <Button startIcon={<IosShareIcon />} onClick={handleNativeShare}>
            More options
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
