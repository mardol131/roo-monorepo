const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload-file-to-cloud`;

export async function uploadFileToCDN(
  file: File,
  filename: string,
  bucket: string,
) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file, filename, bucket }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return await response.json();
}
