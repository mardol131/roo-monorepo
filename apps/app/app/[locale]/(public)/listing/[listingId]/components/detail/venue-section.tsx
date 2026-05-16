import ItemsSection from "../items-section";
import SectionWrapper from "../section-wrapper";
import { ChipList, InfoRow, resolveNames } from "../listing-ui";
import { Listing } from "@roo/common";
import {
  BedDouble,
  Car,
  Coffee,
  MapPin,
  Maximize2,
  Tag,
  Users,
  Wrench,
  Cpu,
  Dumbbell,
} from "lucide-react";
import DescriptionSection from "../description-section";

type VenueDetail = Extract<Listing["details"][number], { blockType: "venue" }>;

interface Props {
  listing: Listing;
  detail: VenueDetail;
}

const spacesTypeLabels: Record<VenueDetail["spacesType"], string> = {
  area: "Otevřená plocha",
  building: "Budova",
  room: "Místnost",
};

const vehicleTypeLabels: Record<string, string> = {
  car: "Osobní auto",
  truck: "Nákladní auto",
  van: "Dodávka",
  bus: "Autobus",
};

export default function VenueSection({ listing, detail }: Props) {
  const cityName =
    typeof detail.location.city === "string"
      ? detail.location.city
      : (detail.location.city?.name ?? "");

  const amenities = resolveNames(detail.amenities ?? []);
  const services = resolveNames(detail.services ?? []);
  const technology = resolveNames(detail.technology ?? []);
  const activities = resolveNames(detail.activities ?? []);
  const placeTypes = resolveNames(detail.placeTypes ?? []);

  const vehicleTypes = (detail.access.vehicleTypes ?? []).map(
    (v) => vehicleTypeLabels[v] ?? v,
  );
  const accessFlags = [
    detail.access.loadingRamp && "Nakládací rampa",
    detail.access.loadingElevator && "Nákladní výtah",
    detail.access.helpWithLoadingAndUnloading && "Pomoc s nakládkou",
    detail.access.serviceAccess && "Servisní přístup",
    detail.access.serviceArea && "Servisní plocha",
  ].filter((f): f is string => !!f);

  const mapUrl = `https://maps.google.com/?q=${detail.location.latitude},${detail.location.longitude}`;

  return (
    <>
      {listing.description && (
        <SectionWrapper title="O tomto inzerátu">
          <DescriptionSection description={listing.description} />
        </SectionWrapper>
      )}

      <SectionWrapper title="Kde nás najdete">
        <div className="flex flex-col gap-2">
          <InfoRow
            icon={<MapPin size={16} />}
            label="Adresa"
            value={`${detail.location.address}${cityName ? `, ${cityName}` : ""}`}
          />
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline-offset-2 hover:underline ml-7"
          >
            Zobrazit na mapě
          </a>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Základní informace">
        <div className="grid grid-cols-2 gap-3">
          <InfoRow
            icon={<Users size={16} />}
            label="Kapacita"
            value={`${detail.capacity} osob`}
          />
          <InfoRow
            icon={<Maximize2 size={16} />}
            label="Plocha"
            value={`${detail.area} m²`}
          />
          <InfoRow
            icon={<Tag size={16} />}
            label="Typ prostoru"
            value={spacesTypeLabels[detail.spacesType]}
          />
          {(listing.indoor != null || listing.outdoor != null) && (
            <InfoRow
              icon={<Tag size={16} />}
              label="Prostředí"
              value={
                listing.indoor && listing.outdoor
                  ? "Interiér i exteriér"
                  : listing.indoor
                    ? "Interiér"
                    : "Exteriér"
              }
            />
          )}
        </div>
        {placeTypes.length > 0 && (
          <div className="mt-4">
            <ChipList items={placeTypes} />
          </div>
        )}
      </SectionWrapper>

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

      {detail.hasAccommodation && (
        <SectionWrapper title="Ubytování">
          {detail.accommodationCapacity != null && (
            <InfoRow
              icon={<BedDouble size={16} />}
              label="Kapacita"
              value={`${detail.accommodationCapacity} osob`}
            />
          )}
        </SectionWrapper>
      )}

      {detail.breakfast.included && (
        <SectionWrapper title="Snídaně">
          <div className="flex flex-col gap-2">
            {detail.breakfast.timeFrom && detail.breakfast.timeTo && (
              <InfoRow
                icon={<Coffee size={16} />}
                label="Čas"
                value={`${detail.breakfast.timeFrom}–${detail.breakfast.timeTo}`}
              />
            )}
            {!detail.breakfast.breakfastIsIncludedInPrice &&
              detail.breakfast.price != null && (
                <InfoRow
                  icon={<Coffee size={16} />}
                  label="Cena"
                  value={`${detail.breakfast.price.toLocaleString("cs-CZ")} Kč ${detail.breakfast.pricePer === "person" ? "/ osoba" : "/ rezervace"}`}
                />
              )}
            {detail.breakfast.breakfastIsIncludedInPrice && (
              <InfoRow icon={<Coffee size={16} />} label="Cena" value="V ceně" />
            )}
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
