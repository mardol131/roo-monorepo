import { MediaSchema } from "@roo/common";

const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload-file-to-cloud`;

export async function uploadFileToCloud(file: File): Promise<MediaSchema> {
  const isVideo = file.type.startsWith("video/");
  const bucket = isVideo ? "listings-videos" : "listings-images";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
    },
    body: formData,
    credentials: "include",
  });

  const data = await response.json();
  return data;
}
