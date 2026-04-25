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
        // Încercăm selectori comuni pentru butonul de info taxe
        const infoButton = page.locator('[data-test-id="service-fee-info"], .store-service-fee-info-icon, button:has-text("Cum calculăm")').first();
        if (await infoButton.count() > 0) {
          await infoButton.click();
          await page.waitForTimeout(1000);
        } else {
          // Alternative: click pe sumarul de taxe din coș
          const cartSummary = page.locator('[data-test-id="cart-summary-total"]').first();
          if (await cartSummary.count() > 0) {
             await cartSummary.click();
             await page.waitForTimeout(1000);
             const innerInfoBtn = page.locator('[data-test-id="service-fee-info"]').first();
             if (await innerInfoBtn.count() > 0) {
                 await innerInfoBtn.click();
                 await page.waitForTimeout(1000);
             }
          }
        }

        // 3. Extragem datele reale din DOM (cu fallback pe valorile default dacă selectorii nu găsesc nimic)
        let extracted = {
          deliveryFee: 8.99,
          serviceFeePercent: 0.06,
          serviceFeeMin: 2.49,
          serviceFeeMax: 7.99,
          smallOrderFee: 5.99,
          smallOrderThreshold: 40,
        };

        const feeBlocks = await page.locator('[class*="FeesModal_feeInformation"]').all();
        
        for (const block of feeBlocks) {
          const headerText = await block.locator('[class*="FeesModal_feeHeader"] p').first().textContent() || "";
          
          if (headerText.includes("Serviciu")) {
            const detailsText = await block.locator('span[class*="FeesModal_secondaryColor"]').textContent() || "";
            const minMatch = detailsText.match(/de la ([\d,]+)\s*RON/);
            const percentMatch = detailsText.match(/reprezintă (\d+)\s*%/);
            const maxMatch = detailsText.match(/limitată la ([\d,]+)\s*RON/);

            if (minMatch) extracted.serviceFeeMin = parseFloat(minMatch[1].replace(',', '.'));
            if (percentMatch) extracted.serviceFeePercent = parseFloat(percentMatch[1]) / 100;
            if (maxMatch) extracted.serviceFeeMax = parseFloat(maxMatch[1].replace(',', '.'));
          }
          
          if (headerText.includes("Comandă mică")) {
            const thresholdMatch = headerText.match(/sub ([\d,]+)\s*RON/);
            if (thresholdMatch) extracted.smallOrderThreshold = parseFloat(thresholdMatch[1].replace(',', '.'));
            
            const amountText = await block.locator('[class*="FeesModal_feeAmountContainer"] p').last().textContent() || "";
            const feeMatch = amountText.match(/([\d,]+)\s*RON/);
            if (feeMatch) extracted.smallOrderFee = parseFloat(feeMatch[1].replace(',', '.'));
          }

          if (headerText.includes("Livrare")) {
            const amountText = await block.locator('[class*="FeesModal_feeAmountContainer"] p').last().textContent() || "";
            const feeMatch = amountText.match(/([\d,]+)\s*RON/);
            if (feeMatch) extracted.deliveryFee = parseFloat(feeMatch[1].replace(',', '.'));
          }
        }

        fees[rest.id] = {
          glovo: {
            ...extracted,
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
