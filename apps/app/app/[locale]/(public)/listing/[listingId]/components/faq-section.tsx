import Text from "@/app/components/ui/atoms/text";
import { Listing } from "@roo/common";
import FAQItem from "./faq-item";

type FAQItem = NonNullable<Listing["faq"]>[number];
type Group = NonNullable<FAQItem["group"]>;

interface FAQSectionProps {
  faqs: Listing["faq"];
}

const groupLabels: Record<Group, string> = {
  general: "Obecné",
  booking: "Rezervace",
  cancellation: "Storno",
  payment: "Platba",
  other: "Ostatní",
};

const groupOrder: Group[] = ["general", "booking", "payment", "cancellation", "other"];

export default function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  const grouped = faqs.reduce<Record<string, FAQItem[]>>((acc, faq) => {
    const key = faq.group ?? "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(faq);
    return acc;
  }, {});

  const presentGroups = groupOrder.filter((g) => grouped[g]?.length);
  const hasMultipleGroups = presentGroups.length > 1;

  return (
    <div className="flex flex-col gap-8">
      {presentGroups.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          {hasMultipleGroups && (
            <Text
              as="span"
              variant="caption"
              color="textLight"
              className="uppercase tracking-widest font-semibold mb-3 block"
            >
              {groupLabels[group]}
            </Text>
          )}
          {grouped[group].map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      ))}
    </div>
  );
}
