import Button from "../../../../components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";

export default function HeroSection() {
  return (
    <div className="rounded-[4rem] overflow-hidden relative">
      {/* Three-panel video background */}
      <div className="absolute inset-0 grid grid-cols-3">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source
            src={generateMediaUrl("6760602-uhd_2560_1440_25fps.mp4", "videos")}
            type="video/mp4"
          />
        </video>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full scale-x-101 object-cover"
        >
          <source
            src={generateMediaUrl("wedding.mp4", "videos")}
            type="video/mp4"
          />
        </video>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source
            src={generateMediaUrl("852304-hd_1920_1080_24fps.mp4", "videos")}
            type="video/mp4"
          />
        </video>
      </div>

      {/* Gradient overlay — dark for readability, fades to white at bottom for search section */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-black/55" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-48 px-4 text-center">
        {/* Eyebrow badge */}
        {/* <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2 mb-10">
          <Text variant="label-lg" color="white">
            Plánování eventů bez stresu
          </Text>
        </div> */}

        {/* Headline */}
        <Text
          variant="display-2xl"
          color="white"
          as="h1"
          className="mb-4 max-w-4xl leading-tight"
        >
          Místo, catering &amp; zábava —{" "}
          <span className="text-primary">z jednoho místa</span>
        </Text>

        {/* Subtext */}
        <Text
          variant="body-lg"
          color="white"
          className="max-w-lg mb-12 opacity-75"
        >
          Naplánujte celý event během pár minut. Bez emailů, bez stresu, bez
          zdlouhavé koordinace.
        </Text>

        {/* CTAs */}
        <div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Button
              text="Prozkoumat katalog"
              size="xl"
              version="primary"
              link={{ pathname: "/catalog" }}
            />
            <Button
              text="Jak to funguje"
              size="xl"
              version="white"
              link={{ pathname: "/pages/how-it-works-for-user" }}
            />
          </div>{" "}
          <Button
            text="Chcete se stát dodavatelem?"
            size="sm"
            className="text-white mt-5"
            version="none"
            link={{ pathname: "/pages/how-it-works-for-company" }}
          />
        </div>
      </div>
    </div>
  );
}
