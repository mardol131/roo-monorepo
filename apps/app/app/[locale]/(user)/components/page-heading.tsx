import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import Breadcrumbs from "./breadcrumbs";

type Props = {
  heading: string;
  description: string;
  button?: ButtonProps;
};

export default function PageHeading({ heading, description, button }: Props) {
  return (
    <div>
      <Breadcrumbs />
      <div className="flex items-start justify-between mb-8">
        <div>
          <Text variant="heading4" color="dark" className="font-bold">
            {heading}
          </Text>
          <Text variant="label2" color="secondary" className="mt-1">
            {description}
          </Text>
        </div>
        {button && <Button {...button} />}
      </div>
    </div>
  );
}
