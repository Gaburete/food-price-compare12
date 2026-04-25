import { BrowserContext } from "playwright";

export async function scrapeBolt(context: BrowserContext, address: string) {
  const page = await context.newPage();
  const fees: Record<string, any> = {};

  try {
    await page.goto("https://food.bolt.eu/ro-ro/bucuresti/", { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const restaurantsToScrape = [
      { id: "kfc-buc-1", url: "https://food.bolt.eu/ro-ro/bucuresti/p/kfc-unirii" },
      { id: "mcdonalds-buc-1", url: "https://food.bolt.eu/ro-ro/bucuresti/p/mcdonalds-unirii" }
    ];

    for (const rest of restaurantsToScrape) {
      await page.goto(rest.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      try {
        // 1. Apăsăm pe primul produs
        const firstProduct = page.locator('div[data-test="restaurant-menu-item"]').first();
        if (await firstProduct.count() > 0) {
          await firstProduct.click();
          await page.waitForTimeout(1000);

          // 2. Apăsăm adaugă în coș
          const addToCartBtn = page.locator('button[data-test="add-to-cart"]').first();
          if (await addToCartBtn.count() > 0) {
            await addToCartBtn.click();
            await page.waitForTimeout(1000);
          }
        }

        // 3. Extragem datele
        // Aici vom adăuga logica reală când primim selectorii
        let extracted = {
          deliveryFee: 7.99,
          serviceFeePercent: null, // Bolt Food are adesea o taxă fixă de serviciu
          serviceFee: 3.19, // Fixed
          smallOrderFee: 0.10, // Diferența fixă sau calculată
          smallOrderThreshold: 40,
        };

        fees[rest.id] = {
          bolt: {
            ...extracted,
            dynamicSmallOrderFee: false, // Dacă e diferență dinamică, vom schimba în true
            deliveryTime: 25
          }
        };

      } catch (e) {
        console.error(`Eroare scraping Bolt pentru ${rest.id}:`, e);
      }
    }

  } finally {
    await page.close();
  }

  return fees;
}
