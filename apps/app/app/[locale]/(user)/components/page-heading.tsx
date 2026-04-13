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
      <div className="flex items-start gap-10 justify-between mb-8">
        <div className="max-w-user-profile-content">
          <Text variant="heading4" color="dark" className="font-bold">
            {heading}
          </Text>
          <Text variant="label1" color="secondary" className="mt-3">
            {description}
          </Text>
        </div>
        {button && (
          <div className="shrink-0">
            <Button {...button} />
          </div>
        )}
      </div>
    </div>
  );
}
