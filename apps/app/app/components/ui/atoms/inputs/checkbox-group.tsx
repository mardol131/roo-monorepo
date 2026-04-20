import InputLabel from "../input-label";
import Checkbox from "./checkbox";

type Item = { id: string; name: string };

type Props = {
  items: Item[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  checkColor?: string;
  columns?: string;
};

function toggleItem(arr: string[], id: string, checked: boolean) {
  return checked ? [...arr, id] : arr.filter((x) => x !== id);
}

export default function CheckboxGroup({
  items,
  value,
  onChange,
  label,
  checkColor = "text-primary",
  columns = "grid-cols-2 sm:grid-cols-3",
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {label && <InputLabel label={label} />}
      <div className={`grid ${columns} gap-2`}>
        {items.map((item) => (
          <Checkbox
            key={item.id}
            checked={value.includes(item.id)}
            onChange={(checked) => onChange(toggleItem(value, item.id, checked))}
            label={item.name}
            checkColor={checkColor}
          />
        ))}
      </div>
    </div>
  );
}
