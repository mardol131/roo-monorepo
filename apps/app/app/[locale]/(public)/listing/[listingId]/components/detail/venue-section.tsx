"use client";

import ItemsSection from "../items-section";
import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow } from "../listing-ui";
import { ListingVenueDetail } from "@roo/common";
import {
  BedDouble,
  Car,
  Coffee,
  Tag,
  Users,
  Wrench,
  Cpu,
  Dumbbell,
} from "lucide-react";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";

interface Props {
  detail: ListingVenueDetail;
}

const vehicleTypeLabels: Record<string, string> = {
  car: "Osobní auto",
  truck: "Nákladní auto",
  van: "Dodávka",
  bus: "Autobus",
};

const resolveId = (value: string | { id: string }) =>
  typeof value === "string" ? value : value.id;

export default function VenueSection({ detail }: Props) {
  const { data: filters } = useFilterOptions();

  const amenities = (detail.options.amenities ?? []).flatMap((entry) => {
    const found = filters?.amenities.find(
      (e) => e.id === resolveId(entry.amenity),
    );
    return found ? [found.name] : [];
  });
  const services = (detail.options.services ?? []).flatMap((entry) => {
    const found = filters?.services.find(
      (e) => e.id === resolveId(entry.service),
    );
    return found ? [found.name] : [];
  });
  const technology = (detail.options.technologies ?? []).flatMap((entry) => {
    const found = filters?.technologies.find(
      (e) => e.id === resolveId(entry.technology),
    );
    return found ? [found.name] : [];
  });
  const activities = (detail.options.activities ?? []).flatMap((entry) => {
    const found = filters?.activities.find(
      (e) => e.id === resolveId(entry.activity),
    );
    return found ? [found.name] : [];
  });
  const personnel = (detail.options.personnel ?? []).flatMap((entry) => {
    const found = filters?.personnel.find(
      (e) => e.id === resolveId(entry.personnel),
    );
    return found ? [found.name] : [];
  });

  const vehicleTypes = (detail.propertyAccess.vehicleTypes ?? []).map(
    (v: string) => vehicleTypeLabels[v] ?? v,
  );
  const accessFlags = [
    detail.propertyAccess.loadingRamp && "Nakládací rampa",
    detail.propertyAccess.loadingElevator && "Nákladní výtah",
    detail.propertyAccess.serviceAccess && "Servisní přístup",
    detail.propertyAccess.serviceArea && "Servisní plocha",
  ].filter((f): f is string => !!f);

  return (
    <>
      {amenities.length > 0 && (
        <SectionWrapper title="Vybavení">
          <ItemsSection
            items={amenities.map((name) => ({
              id: name,
              label: name,
              icon: <Tag size={18} />,
            }))}
            displayCount={8}
            buttonText={`Ukázat všech ${amenities.length} položek`}
            columns={2}
          />
        </SectionWrapper>
      )}

      {services.length > 0 && (
        <SectionWrapper title="Služby">
          <ItemsSection
            items={services.map((name) => ({
              id: name,
              label: name,
              icon: <Wrench size={18} />,
            }))}
            displayCount={8}
            buttonText={`Ukázat všech ${services.length} služeb`}
            columns={2}
          />
        </SectionWrapper>
      )}

      {technology.length > 0 && (
        <SectionWrapper title="Technika">
          <ItemsSection
            items={technology.map((name) => ({
              id: name,
              label: name,
              icon: <Cpu size={18} />,
            }))}
            displayCount={8}
            buttonText="Ukázat vše"
            columns={2}
          />
        </SectionWrapper>
      )}

      {activities.length > 0 && (
        <SectionWrapper title="Aktivity">
          <ItemsSection
            items={activities.map((name) => ({
              id: name,
              label: name,
              icon: <Dumbbell size={18} />,
            }))}
            displayCount={8}
            buttonText="Ukázat vše"
            columns={2}
          />
        </SectionWrapper>
      )}

      {personnel.length > 0 && (
        <SectionWrapper title="Personál">
          <ItemsSection
            items={personnel.map((name) => ({
              id: name,
              label: name,
              icon: <Users size={18} />,
            }))}
            displayCount={8}
            buttonText="Ukázat vše"
            columns={2}
          />
        </SectionWrapper>
      )}

      {(vehicleTypes.length > 0 || accessFlags.length > 0) && (
        <SectionWrapper title="Přístup a logistika">
          <div className="flex flex-col gap-4">
            {vehicleTypes.length > 0 && (
              <div className="flex flex-col gap-2">
                <InfoRow icon={<Car size={16} />} label="Vozidla" value="" />
                <div className="ml-7">
                  <ChipList items={vehicleTypes} />
                </div>
              </div>
            )}
            {accessFlags.length > 0 && (
              <div className="ml-7">
                <ChipList items={accessFlags} />
              </div>
            )}
          </div>
        </SectionWrapper>
      )}

      {detail.parking.hasParking && (
        <SectionWrapper title="Parkování">
          <div className="flex flex-col gap-2">
            {detail.parking.parkingCapacity != null && (
              <InfoRow
                icon={<Car size={16} />}
                label="Kapacita"
                value={`${detail.parking.parkingCapacity} míst`}
              />
            )}
            {detail.parking.parkingIsIncludedInPrice ? (
              <InfoRow icon={<Car size={16} />} label="Cena" value="V ceně" />
            ) : detail.parking.parkingPrice != null ? (
              <InfoRow
                icon={<Car size={16} />}
                label="Cena"
                value={`${detail.parking.parkingPrice.toLocaleString("cs-CZ")} Kč`}
              />
            ) : null}
          </div>
        </SectionWrapper>
      )}

      {detail.accomodation.hasAccommodation && (
        <SectionWrapper title="Ubytování">
          {detail.accomodation.accommodationCapacity != null && (
            <InfoRow
              icon={<BedDouble size={16} />}
              label="Kapacita"
              value={`${detail.accomodation.accommodationCapacity} osob`}
            />
          )}
        </SectionWrapper>
      )}

      {detail.breakfast.breakfastIncluded && (
        <SectionWrapper title="Snídaně">
          <div className="flex flex-col gap-2">
            {!detail.breakfast.breakfastIsIncludedInPrice &&
              detail.breakfast.price != null && (
                <InfoRow
                  icon={<Coffee size={16} />}
                  label="Cena"
                  value={`${detail.breakfast.price.toLocaleString("cs-CZ")} Kč ${detail.breakfast.priceUnit === "person" ? "/ osoba" : "/ rezervace"}`}
                />
              )}
            {detail.breakfast.breakfastIsIncludedInPrice && (
              <InfoRow
                icon={<Coffee size={16} />}
                label="Cena"
                value="V ceně"
              />
            )}
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
