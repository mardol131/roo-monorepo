import { getCollection } from "@/app/functions/api/general";
import { RoadmapItem } from "@roo/common";

const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roadmap-items`;

export async function fetchRoadmapItems() {
  const res = await getCollection({
    collection: "roadmap-items",
  });
  if (!res) throw new Error("Failed to fetch roadmap items");
  return res;
}

export async function voteForRoadmapItem(id: string) {
  const res = await fetch(`${apiUrl}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ roadmapItemId: id }),
  });
  if (!res.ok) throw new Error("Failed to vote for roadmap item");
  return res;
}
