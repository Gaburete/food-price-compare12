import { BrowserContext } from "playwright";

export async function scrapeWolt(context: BrowserContext, address: string) {
  const page = await context.newPage();
  const fees: Record<string, any> = {};

  try {
    await page.goto("https://wolt.com/ro/rou/bucuresti/", { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const restaurantsToScrape = [
      { id: "kfc-buc-1", url: "https://wolt.com/ro/rou/bucharest/restaurant/kfc" },
      { id: "mcdonalds-buc-1", url: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" }
    ];

    for (const rest of restaurantsToScrape) {
      await page.goto(rest.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      try {
        // 1. Apăsăm pe primul produs
        const firstProduct = page.locator('div[data-test-id="MenuItem"]').first();
        if (await firstProduct.count() > 0) {
          await firstProduct.click();
          await page.waitForTimeout(1000);

          // 2. Apăsăm adaugă în coș
          const addToCartBtn = page.locator('button[data-test-id="ProductModalAddButton"]').first();
          if (await addToCartBtn.count() > 0) {
            await addToCartBtn.click();
            await page.waitForTimeout(1000);
          }
        }

        // 3. Extragem datele
        // Aici vom adăuga logica reală când primim selectorii pentru Wolt
        let extracted = {
          deliveryFee: 10.19,
          serviceFeePercent: null,
          serviceFee: 2.79, // Wolt are de obicei taxă fixă de serviciu care se schimbă
          smallOrderFee: 0, // Wolt poate adăuga "suprataxă pentru comandă mică"
          smallOrderThreshold: null, 
        };

        fees[rest.id] = {
          wolt: {
            ...extracted,
            dynamicSmallOrderFee: true, // Diferența dintre comandă și prag, la fel ca Glovo
            deliveryTime: 20
          }
        };

      } catch (e) {
        console.error(`Eroare scraping Wolt pentru ${rest.id}:`, e);
      }
    }

  } finally {
    await page.close();
  }

  return fees;
}
