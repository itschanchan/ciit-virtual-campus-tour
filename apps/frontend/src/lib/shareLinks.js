export const SHARE_MESSAGE = "Explore the CIIT Virtual Campus Tour.";
export const MESSENGER_URL = "https://www.messenger.com/";
export const DISCORD_URL = "https://discord.com/";

export function getTourUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.href;
}

export function buildFacebookShareUrl(tourUrl = getTourUrl()) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tourUrl)}`;
}

export function buildXShareUrl(tourUrl = getTourUrl()) {
  const url = encodeURIComponent(tourUrl);
  const text = encodeURIComponent(SHARE_MESSAGE);
  return `https://x.com/intent/post?url=${url}&text=${text}`;
}

export function buildWhatsAppShareUrl(tourUrl = getTourUrl()) {
  const text = encodeURIComponent(`${SHARE_MESSAGE} ${tourUrl}`);
  return `https://wa.me/?text=${text}`;
}

export function buildEmailShareUrl(tourUrl = getTourUrl()) {
  const subject = encodeURIComponent("CIIT Virtual Campus Tour");
  const body = encodeURIComponent(`${SHARE_MESSAGE}\n${tourUrl}`);
  return `mailto:?subject=${subject}&body=${body}`;
}
