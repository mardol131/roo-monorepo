import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {};

export default function DescriptionSection({}: Props) {
  return (
    <section className="flex flex-col gap-4">
      <Text variant="heading5" color="dark">
        O tomto produktu
      </Text>
      <Text variant="body2" color="secondary" className="leading-relaxed">
        Toto je kvalitní produkt, který byl vybrán s péčí a pozorností. Nabízí
        vynikající poměr ceny a kvality, má špičkový design a je vyroben z
        nejlepších materiálů. Ideální volba pro ty, kteří si cení kvality a
        stylového provedení.
      </Text>
    </section>
  );
}
