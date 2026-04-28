export function formatPhoneNumber(number: string, countryCode: string): string {
  return `+ ${countryCode} ${number}`;
}
