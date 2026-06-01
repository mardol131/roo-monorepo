export const buckets = {
  "listings-videos": "listings-videos",
  "listings-images": "listings-images",
};

export type Bucket = keyof typeof buckets;

export const bucketsArray: Bucket[] = ["listings-images", "listings-videos"];
