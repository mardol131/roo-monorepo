import React from "react";
import Text from "../../../../components/ui/atoms/text";
import Checkbox from "../../../../components/ui/atoms/inputs/checkbox";
import Button from "@/app/components/ui/atoms/button";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function FilterSection({
  title,
  options,
  selectedIds,
  onSelectionChange,
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
      <Text variant="label1" className="mb-3 block text-zinc-900 font-semibold">
        {title}
      </Text>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
        {options.map((option) => (
          <Checkbox
            key={option.id}
            id={option.id}
            label={option.label}
            checked={selectedIds.includes(option.id)}
            onChange={(checked) => handleCheckboxChange(option.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
