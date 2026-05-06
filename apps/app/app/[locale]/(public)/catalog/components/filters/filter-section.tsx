import Checkbox, {
  CheckboxProps,
} from "@/app/components/ui/atoms/inputs/checkbox";
import Text from "@/app/components/ui/atoms/text";

interface FilterOption {
  id: string;
  name: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  size?: CheckboxProps["size"];
}

export default function FilterSection({
  title,
  options,
  selectedIds,
  onSelectionChange,
  size,
}: FilterSectionProps) {
  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, optionId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== optionId));
    }
  };

  return (
    <div className=" ">
      <Text
        variant="label-lg"
        className="mb-3 block text-zinc-900 font-semibold"
      >
        {title}
      </Text>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
        {options.map((option) => (
          <Checkbox
            key={option.id}
            id={option.id}
            label={option.name}
            checked={selectedIds.includes(option.id)}
            onChange={(checked) => handleCheckboxChange(option.id, checked)}
            size={size || "md"}
          />
        ))}
      </div>
    </div>
  );
}
