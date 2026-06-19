import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <LoaderCircle className="animate-spin text-primary w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16" />
    </div>
  );
}
