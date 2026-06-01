export function formatPhoneNumber(number: string, countryCode: string): string {
  return `+ ${countryCode} ${number}`;
}

export function truncateText(text: string, max = 150): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "...";
}
