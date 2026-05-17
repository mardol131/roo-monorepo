import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { Listing } from "@roo/common";
import Image from "next/image";

type Employee = NonNullable<Listing["employees"]>[number];

interface Props {
  employees: Employee[];
}

export default function EmployeesSection({ employees }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {employees.map((employee) => (
        <div
          key={employee.id ?? employee.name}
          className="flex items-center gap-4 p-4 rounded-lg border border-zinc-100 bg-zinc-50"
        >
          {employee.image.filename && (
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-zinc-200">
              <Image
                src={generateMediaUrl(employee.image.filename)}
                alt={employee.image.alt ?? employee.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-0.5 min-w-0">
            <Text variant="label-lg" color="textDark" className="font-semibold">
              {employee.name}
            </Text>
            <Text as="span" variant="caption" color="textLight">
              {employee.role}
            </Text>
            {employee.description && (
              <Text
                variant="caption"
                color="textLight"
                className="mt-1 line-clamp-2"
              >
                {employee.description}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
