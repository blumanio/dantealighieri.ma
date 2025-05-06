// client/lib/autopostUtils.js

export const italianAuthors = ["Marco Bianchi", "Giulia Romano", "Sofia Conti"];

export function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export function generateExcerpt(content, maxLength = 150) {
  if (!content) {
    return "";
  }
  const plainText = content
    .replace(/^(#+\s*|>\s*|-\s*|\*\s*|\d+\.\s*)/gm, "")
    .replace(/[\*_`~#\[\]]/g, "")
    .replace(/\s\s+/g, " ")
    .trim();
  if (plainText.length <= maxLength) {
    return plainText;
  }
  const truncated = plainText.substring(0, maxLength);
  const lastSentenceEnd = Math.max(truncated.lastIndexOf(". "), truncated.lastIndexOf("? "), truncated.lastIndexOf("! "));
  const lastSpace = truncated.lastIndexOf(" ");
  const cutOffPoint = lastSentenceEnd > 0 ? lastSentenceEnd : (lastSpace > 0 ? lastSpace : maxLength);

  return truncated.substring(0, cutOffPoint) + "...";
}