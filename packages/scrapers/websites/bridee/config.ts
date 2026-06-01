export const SCRAPER_CONFIG = {
  baseListUrl: "https://bridee.cz/dodavatele",
  detailPageCsvHeader: ["name", "link"],
  detailPageCsvFileName: new URL("bridee-supplier-links.csv", import.meta.url)
    .pathname,
  detailInfoCsvHeader: [
    "name",
    "website",
    "phone",
    "email",
    "instagram",
    "facebook",
    "location",
    "regions",
  ],
  detailInfoCsvFileName: new URL("bridee-suppliers.csv", import.meta.url)
    .pathname,
};
