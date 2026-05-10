import { Countries } from "../data/country-codes";

const CZ_API_URL =
  "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty";

export const getCompanyDataFromGov = async (
  ico: string,
  country: Countries,
): Promise<{
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  dic?: string;
} | null> => {
  if (country === "cz") {
    try {
      const response = await fetch(`${CZ_API_URL}/${ico}`);
      if (!response.ok) {
        throw new Error("Failed to fetch company data");
      }
      const data = await response.json();

      const sidlo = data.sidlo ?? {};
      const street = [
        sidlo.nazevUlice,
        sidlo.cisloDomovni
          ? `${sidlo.cisloDomovni}${
              sidlo.cisloOrientacni ? `/${sidlo.cisloOrientacni}` : ""
            }`
          : null,
      ]
        .filter(Boolean)
        .join(" ");
      return {
        name: data.obchodniJmeno?.toString() || "",
        street: street.toString() || "",
        city:
          sidlo.nazevMestskehoObvodu?.toString() ||
          sidlo.nazevObce?.toString() ||
          "",
        postalCode: sidlo.psc?.toString() || "",
        country: "Česká republika",
        dic: data.dic?.toString() || "",
      };
    } catch (error) {
      console.error("Error fetching company data:", error);
      return null;
    }
  }

  return null;
};
