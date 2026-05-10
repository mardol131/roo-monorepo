export function generateMediaUrl(
  filename: string,
  bucket: string = "listings-images",
): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
}
