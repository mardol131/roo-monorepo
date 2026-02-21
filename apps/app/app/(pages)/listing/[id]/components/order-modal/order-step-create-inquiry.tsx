"use client";

import React, { useState } from "react";
import { Calendar, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";

export default function OrderStepCreateInquiry() {
  const { currentOfferIndex, offers, goToPreviousStep, closeOrderModal } =
    useOrderStore();

  const offer = offers[currentOfferIndex];

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
    // TODO: Handle form submission
    console.log("Inquiry submitted:", {
      offerId: offer.id,
      ...formData,
    });
    closeOrderModal();
    // Show success message or redirect
  };

  const isValid = formData.name && formData.email && formData.eventDate;

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-4 border-b border-zinc-200">
        <Text variant="heading5" color="dark" className="font-bold">
          Vytvoření poptávky
        </Text>
        <Text variant="body3" color="secondary" className="mt-1">
          Vyplňte své údaje a informace o akci
        </Text>
      </div>

      {/* Selected Offer Summary */}
      <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
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

      {/* Inquiry Form */}
      <div className="flex flex-col gap-6">
        {/* Personal Information */}
        <div>
          <Text variant="label1" color="dark" className="font-medium mb-4">
            Kontaktní informace
          </Text>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1.5">
                <Text variant="label2" color="dark">
                  Jméno a příjmení *
                </Text>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1.5">
                <Text variant="label2" color="dark">
                  Email *
                </Text>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="phone" className="block mb-1.5">
              <Text variant="label2" color="dark">
                Telefon
              </Text>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Event Information */}
        <div>
          <Text variant="label1" color="dark" className="font-medium mb-4">
            Informace o akci
          </Text>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventDate" className="block mb-1.5">
                <Text variant="label2" color="dark">
                  Datum akce *
                </Text>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="guestCount" className="block mb-1.5">
                <Text variant="label2" color="dark">
                  Počet hostů
                </Text>
              </label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                placeholder="např. 50"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="eventLocation" className="block mb-1.5">
              <Text variant="label2" color="dark">
                Místo konání
              </Text>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                id="eventLocation"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleInputChange}
                placeholder="např. Praha, Ostrava..."
                className="w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Additional Message */}
        <div>
          <label htmlFor="message" className="block mb-1.5">
            <Text variant="label2" color="dark">
              Další informace nebo požadavky
            </Text>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Popište nám více detailů o vaší akci..."
              rows={4}
              className="w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-zinc-100">
          <Button text="Zpět" version="secondary" onClick={goToPreviousStep} />
          <Button
            text="Odeslat poptávku"
            version="primary"
            disabled={!isValid}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
