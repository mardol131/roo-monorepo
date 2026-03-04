import Text from "@/app/components/ui/atoms/text";
import FAQItem from "./faq-item";

export interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="heading5">Často kladené otázky</Text>

      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
