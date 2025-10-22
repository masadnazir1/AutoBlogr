// services/trendingService.js
import puppeteer from "puppeteer";

export async function getTrendingKeywords() {
  const url = "https://trends.google.com/trending?geo=PK";
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for any table body to appear
  await page.waitForSelector("tbody tr", { timeout: 20000 });

  const keywords = await page.evaluate(() => {
    const rows = document.querySelectorAll("tbody tr");
    const data = [];

    for (const row of rows) {
      // Find any text cell inside the row
      const textNodes = Array.from(row.querySelectorAll("td, div, span"))
        .map((el) => el.innerText?.trim())
        .filter(Boolean)
        .filter((t) => /^[a-zA-Z0-9\s&().,+\-']{3,}$/.test(t)); // basic noise filter

      // Pick the first visible phrase that looks like a search term
      const keyword = textNodes.find(
        (t) =>
          t.length > 2 &&
          !t.toLowerCase().includes("search") &&
          !t.toLowerCase().includes("ago") &&
          !t.toLowerCase().includes("active") &&
          !t.toLowerCase().includes("explore")
      );

      if (keyword && !data.includes(keyword)) data.push(keyword);
    }

    return data;
  });

  await browser.close();
  return keywords;
}
