import { BrowserContext } from "playwright";

export async function scrapeWolt(context: BrowserContext, address: string) {
  const page = await context.newPage();
  const fees: Record<string, any> = {};

  try {
    await page.goto("https://wolt.com/ro/rou/constanta", { waitUntil: 'domcontentloaded' });
    
    // Setare adresă
    // await page.fill('[data-test-id="address-search-input"]', address);
    // await page.click('[data-test-id="address-search-result"]');
    await page.waitForTimeout(3000);

    const restaurantsToScrape = [
      { id: "kfc-buc-1", url: "https://wolt.com/ro/rou/constanta/restaurant/kfc-tomis" }
    ];

    for (const rest of restaurantsToScrape) {
      await page.goto(rest.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      fees[rest.id] = {
        deliveryFee: 10.99,
        serviceFee: 2.50
      };
    }

  } finally {
    await page.close();
  }

  return fees;
}
