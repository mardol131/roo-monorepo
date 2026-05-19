import Text from "@/app/components/ui/atoms/text";

interface Props {
  description: string;
}

export default function DescriptionSection({ description }: Props) {
  return (
    <Text variant="body" color="secondary" className="leading-relaxed">
      {description}
    </Text>
  );
}
