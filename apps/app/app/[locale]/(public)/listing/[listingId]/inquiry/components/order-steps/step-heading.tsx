import Text from "@/app/components/ui/atoms/text";

type Props = {
  title: string;
  description: string;
};

export default function StepHeading({ title, description }: Props) {
  return (
    <div className="pb-6 border-b border-zinc-100 mb-6">
      <Text variant="h3" color="textDark" className="font-bold">
        {title}
      </Text>
      <Text variant="body" color="secondary" className="mt-1">
        {description}
      </Text>
    </div>
  );
}
