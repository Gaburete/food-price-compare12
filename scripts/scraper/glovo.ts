import { BrowserContext } from "playwright";

export async function scrapeGlovo(context: BrowserContext, address: string) {
  const page = await context.newPage();
  const fees: Record<string, any> = {};
  const menus: Record<string, any[]> = {};

  try {
    await page.goto("https://glovoapp.com/ro/ro/constanta/", { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); 

    const restaurantsToScrape = [
      { id: "mcdonalds-constanta", url: "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta" }
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
          ...extracted,
          dynamicSmallOrderFee: true, // Specific Glovo
          deliveryTime: 30
        };

        // 4. Extragem meniul
        console.log(`Începem extragerea meniului pentru ${rest.id}...`);
        
        // Închidem modalul de taxe apasând de mai multe ori pe X sau oriunde pe ecran
        await page.mouse.click(10, 10);
        await page.waitForTimeout(1000);

        // Scroll pentru lazy loading
        await page.evaluate(async () => {
          for(let i = 0; i < 8; i++) {
             window.scrollBy(0, 1200);
             await new Promise(r => setTimeout(r, 800));
          }
        });

        const menuItems = await page.evaluate((url) => {
          const items: any[] = [];
          
          // Hai să luăm toate elementele care par a fi prețuri, indiferent de format (lei, ron)
          const htmlText = document.body.innerText;
          const sampleText = htmlText.substring(0, 1000); // primele 1000 caractere
          
          // Găsim toate clasele care conțin "product" sau "card" sau "price"
          const classNames = new Set();
          document.querySelectorAll('*').forEach(el => {
              if (el.className && typeof el.className === 'string') {
                  el.className.split(' ').forEach(cls => {
                      if (cls.includes('product') || cls.includes('price') || cls.includes('card')) {
                          classNames.add(cls);
                      }
                  });
              }
          });

          const dataTestIds = new Set();
          document.querySelectorAll('[data-test-id]').forEach(el => {
             dataTestIds.add(el.getAttribute('data-test-id'));
          });

          items.push({
             id: "debug-info",
             name: "Debug Info",
             description: `Text sample: ${sampleText.substring(0, 50)}...`,
             category: "Debug",
             imageUrl: "",
             classes: Array.from(classNames).slice(0, 20),
             testIds: Array.from(dataTestIds).filter(id => id?.includes('product') || id?.includes('item') || id?.includes('price')),
             prices: []
          });

          return items;
        }, rest.url);

        console.log(`Au fost extrase ${menuItems.length} produse pentru ${rest.id}.`);
        menus[rest.id] = menuItems;

      } catch (e) {
        console.error(`Eroare scraping pentru ${rest.id}:`, e);
      }
    }

  } finally {
    await page.close();
  }

  return { fees, menus };
}

