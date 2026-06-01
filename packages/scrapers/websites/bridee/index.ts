import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";
import { SCRAPER_CONFIG } from "./config";

async function scrapeDetailPagesLinks() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const csvFile = fs.createWriteStream(SCRAPER_CONFIG.detailPageCsvFileName);
  csvFile.write(SCRAPER_CONFIG.detailPageCsvHeader.join(",") + "\n");

  let pageNumber = 1;
  let numberOfCards = 1;
  const baseUrl = new URL(SCRAPER_CONFIG.baseListUrl);

  while (numberOfCards > 0) {
    const fullurl = new URL(baseUrl.toString());
    fullurl.searchParams.set("page", pageNumber.toString());

    await page.goto(fullurl.toString());

    const pageData = await page.evaluate(() => {
      return {
        html: document.documentElement.innerHTML,
      };
    });

    const html = cheerio.load(pageData.html);

    const cards = html(".card");

    for (const card of cards) {
      const name = html(card).find("h5").text().trim();
      const link = html(card).find("a").attr("href");
      csvFile.write(`"${name}","${link}"\n`);
    }

    numberOfCards = cards.length;
    if (numberOfCards === 0) break;

    console.log(`Stránka ${pageNumber}: nalezeno ${numberOfCards} karet`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    pageNumber++;
  }

  await browser.close();
}

async function scrapeDetailInfo() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const csvFile = fs.createWriteStream(SCRAPER_CONFIG.detailInfoCsvFileName);
  csvFile.write(SCRAPER_CONFIG.detailInfoCsvHeader.join(",") + "\n");

  const linksArray: { name: string; link: string }[] = fs
    .readFileSync(SCRAPER_CONFIG.detailPageCsvFileName, "utf-8")
    .split("\n")
    .slice(1) // Remove header
    .filter((line) => line.trim() !== "") // Remove empty lines
    .map((line) => {
      const sep = line.lastIndexOf('","');
      const name = line.slice(1, sep);
      const link = line.slice(sep + 3, -1);
      return { name, link };
    });

  const total = linksArray.length;
  console.log(`Celkem dodavatelů k načtení: ${total}`);

  for (const [index, { name, link }] of linksArray.entries()) {
    console.log(`[${index + 1}/${total}] ${name}`);
    await page.goto(link);

    const hrefs: string[] = [];

    for (let i = 0; i < 5; i++) {
      await page.evaluate((i) => {
        const button = document.querySelector(
          `button[data-trigger-type='contact'][data-trigger-id='${i}']`,
        );
        button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }, i);

      try {
        await page.waitForSelector(
          `a[popup-event='contact'][data-trigger-id='${i}']`,
          { timeout: 5000 },
        );
      } catch {
        continue;
      }

      const href = await page.evaluate((i) => {
        return (
          document
            .querySelector(`a[popup-event='contact'][data-trigger-id='${i}']`)
            ?.getAttribute("href") ?? null
        );
      }, i);

      if (href) hrefs.push(href);
    }

    const locationData = await page.evaluate(() => {
      const location =
        document
          .querySelector("#location > .flex.gap-2 p")
          ?.textContent?.trim() ?? "";
      const regions = Array.from(
        document.querySelectorAll("#location .flex.flex-col .flex.gap-2 p"),
      ).map((el) => el.textContent?.trim() ?? "");
      return { location, regions: regions.join("|") };
    });

    const websiteInfo = {
      email: "",
      phone: "",
      website: "",
      instagram: "",
      facebook: "",
    };

    for (const href of hrefs) {
      if (href.startsWith("mailto:")) {
        websiteInfo.email = href.replace("mailto:", "");
      } else if (href.startsWith("tel:")) {
        websiteInfo.phone = href.replace("tel:", "").replace(/\s/g, "");
      } else if (href.includes("instagram")) {
        websiteInfo.instagram = href;
      } else if (href.includes("facebook")) {
        websiteInfo.facebook = href;
      } else if (href.startsWith("http")) {
        websiteInfo.website = href;
      }
    }

    csvFile.write(
      `"${name}","${websiteInfo.website}","${websiteInfo.phone}","${websiteInfo.email}","${websiteInfo.instagram}","${websiteInfo.facebook}","${locationData.location}","${locationData.regions}"\n`,
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await browser.close();
}

async function main() {
  await scrapeDetailInfo();
}

main().catch((error) => {
  console.error("Error during scraping:", error);
});
