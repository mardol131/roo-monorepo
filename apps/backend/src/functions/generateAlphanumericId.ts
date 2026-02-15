const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const ID_LENGTH = 18

export function generateAlphanumericId(length = ID_LENGTH) {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join('')
}
