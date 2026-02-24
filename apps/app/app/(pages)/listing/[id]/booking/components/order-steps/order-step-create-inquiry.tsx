"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  CheckSquare2,
} from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";

type InquiryStep = "select-event" | "existing-event-form" | "new-event-form";

export default function OrderStepCreateInquiry() {
  const { currentOfferIndex, offers, goToPreviousStep } = useOrderStore();

  const offer = offers[currentOfferIndex];

  const [activeSection, setActiveSection] = useState<InquiryStep | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventLocation: "",
    guestCount: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Inquiry submitted:", {
      offerId: offer.id,
      activeSection,
      ...formData,
    });
    alert("Poptávka byla úspěšně odeslána!");
  };

  const toggleSection = (section: InquiryStep) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Render: All sections
  return (
    <div className="flex border p-4 rounded-2xl border-zinc-200 flex-col gap-6">
      {/* Selected Offer Summary */}
      <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
        <Text variant="label1" color="dark" className="font-medium mb-2">
          Vybraná varianta
        </Text>
        <Text variant="body2" color="dark" className="font-semibold">
          {offer.title}
        </Text>
        <Text variant="label2" color="secondary">
          {offer.price.toLocaleString("cs-CZ")} Kč • {offer.duration}
        </Text>
      </div>

      {/* Event Selection Buttons */}
      <div className="flex flex-col gap-6">
        <div>
          <Text variant="heading5" color="dark" className="font-bold mb-2">
            Kam chcete tuto poptávku přidat?
          </Text>
          <Text variant="label3" color="secondary">
            Zvolte, zda chcete přidat tohoto dodavatele k existujícímu eventu
            nebo vytvořit nový event.
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <button
            onClick={() => toggleSection("existing-event-form")}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              activeSection === "existing-event-form"
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
              <CheckSquare2 className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <Text variant="label1" color="dark" className="font-semibold">
                Přidat do existujícího eventu
              </Text>
              <Text variant="label3" color="secondary" className="mt-1">
                Máte už vytvořený event a chcete sem přidat tohoto dodavatele
              </Text>
            </div>
          </button>

          <button
            onClick={() => toggleSection("new-event-form")}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              activeSection === "new-event-form"
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Plus className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <Text variant="label1" color="dark" className="font-semibold">
                Vytvořit nový event
              </Text>
              <Text variant="label3" color="secondary" className="mt-1">
                Plánujete nový event a chcete si předem zarezervovat tohoto
                dodavatele
              </Text>
            </div>
          </button>
        </div>
      </div>

      {/* Existing Event Form Section */}
      {activeSection === "existing-event-form" && (
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <Text variant="label1" color="dark" className="font-semibold mb-4">
            Vyberte event
          </Text>
          <div className="mb-4">
            {/* TODO: Implementovat seznam existujících eventů */}
            <Text variant="label3" color="secondary">
              Formulář pro výběr existujícího eventu
            </Text>
          </div>
        </div>
      )}

      {/* New Event Form Section */}
      {activeSection === "new-event-form" && (
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <Text variant="label1" color="dark" className="font-semibold mb-4">
            Vytvořit nový event
          </Text>
          <div className="mb-4">
            {/* TODO: Implementovat formulář pro vytvoření nového eventu */}
            <Text variant="label3" color="secondary">
              Formulář pro vytvoření nového eventu
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}
