export async function uploadFileToCloud(file: File): Promise<string> {
  // TODO: upload to CDN, return final URL
  return URL.createObjectURL(file);
}
