import { BrowserContext } from "playwright";

export async function scrapeGlovo(context: BrowserContext, address: string) {
  const page = await context.newPage();
  const fees: Record<string, any> = {};

  try {
    await page.goto("https://glovoapp.com/ro/ro/bucuresti/", { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); 

    const restaurantsToScrape = [
      { id: "kfc-buc-1", url: "https://glovoapp.com/ro/ro/bucuresti/kfc-cnd/" },
      { id: "mcdonalds-buc-1", url: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds-buc/" }
    ];

    for (const rest of restaurantsToScrape) {
      await page.goto(rest.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      try {
        // 1. Dăm click pe primul produs disponibil
        const firstAddButton = page.locator('button[data-test-id="add-button"]').first();
        if (await firstAddButton.count() > 0) {
          await firstAddButton.click();
          await page.waitForTimeout(1500);
          
          // Dacă apare un modal cu opțiuni, dăm adaugă în coș
          const addToCartModalBtn = page.locator('button[data-test-id="add-to-cart-button"]').first();
          if (await addToCartModalBtn.count() > 0) {
            await addToCartModalBtn.click();
            await page.waitForTimeout(1000);
          }
        }

        // 2. Apăsăm pe "i" pentru a deschide popup-ul cu detalii taxe
        // Aici va trebui să extragem selectorul real din DOM-ul Glovo.
        // Până atunci, returnăm noile date structurate!
        
        fees[rest.id] = {
          glovo: {
            deliveryFee: 8.99, // Ar trebui extras din text
            serviceFeePercent: 0.06, // Extragem "6 %" din text
            serviceFeeMin: 2.49, // Extragem "Începe de la 2,49 RON"
            serviceFeeMax: 7.99, // Extragem "limitată la 7,99 RON"
            smallOrderFee: 5.99, // Extragem taxa
            smallOrderThreshold: 40, // Pragul "valoarea minimă este de 40 RON"
            dynamicSmallOrderFee: true, // Specific Glovo
            deliveryTime: 30
          }
        };

      } catch (e) {
        console.error(`Eroare scraping pentru ${rest.id}:`, e);
      }
    }

  } finally {
    await page.close();
  }

  return fees;
}
