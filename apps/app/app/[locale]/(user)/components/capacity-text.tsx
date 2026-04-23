import Text from "@/app/components/ui/atoms/text";

export function CapacityText({
  capacity,
}: {
  capacity: { min?: number | null; max: number };
}) {
  return (
    <Text variant="body-sm" color="textDark">
      {capacity.min ? `${capacity.min}–${capacity.max}` : `max. ${capacity.max}`}{" "}
      osob
    </Text>
  );
}
