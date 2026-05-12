import { BrowserContext } from "playwright";

export async function scrapeGlovo(context: BrowserContext, address: string) {
  const page = await context.newPage();
  const fees: Record<string, any> = {};
  const menus: Record<string, any[]> = {};

  try {
    await page.goto("https://glovoapp.com/ro/ro/constanta/", { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); 

    // Accept cookies if they appear
    try {
        const cookieBtn = page.locator('button:has-text("Acceptați toate"), #onetrust-accept-btn-handler').first();
        if (await cookieBtn.count() > 0) {
           await cookieBtn.click();
           await page.waitForTimeout(1000);
        }
    } catch(e) {}

    // Setăm adresa pentru a debloca accesul la meniuri
    try {
       const addressInput = page.locator('[data-test-id="address-input"], input[data-test-id="address-search-input"], input[type="text"]').first();
       if (await addressInput.count() > 0) {
           await addressInput.click();
           await addressInput.fill(address || "Bulevardul Tomis 47, Constanța");
           await page.waitForTimeout(2000);
           await page.keyboard.press("Enter");
           await page.waitForTimeout(2000);
           
           const firstSuggestion = page.locator('[data-test-id="address-prediction"]').first();
           if (await firstSuggestion.count() > 0) {
               await firstSuggestion.click();
               await page.waitForTimeout(3000);
           }
       }
    } catch (e) {
       console.log("Nu am putut seta adresa, mergem mai departe...", e);
    }

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
          
          // Căutăm direct containere care arată a produse
          // Glovo folosește frecvent div-uri complexe, încercăm selecția după structura de preț
          const priceElements = Array.from(document.querySelectorAll('span, p, div')).filter(el => {
              const text = el.textContent || "";
              return (text.includes('RON') || text.includes('lei')) && text.match(/[\d,]+\s*(RON|lei)/i);
          });
          
          // Extragem părintele care ar putea fi cardul de produs
          const processedNodes = new Set();

          priceElements.forEach(priceEl => {
             // Urcăm 3-4 niveluri în arborele DOM
             let card = priceEl.parentElement;
             let depth = 0;
             while(card && depth < 5) {
                 if (card.querySelector('img') || card.textContent?.length! > 50) {
                     break; // am găsit cardul probabil
                 }
                 card = card.parentElement;
                 depth++;
             }

             if (card && !processedNodes.has(card)) {
                 processedNodes.add(card);
                 
                 // Extragem numele (de obicei cel mai îngroșat/mare text sau h3/span cu anumite clase)
                 const texts = Array.from(card.querySelectorAll('span, p, h3, h4'))
                                    .map(el => el.textContent?.trim() || "")
                                    .filter(t => t.length > 2 && !t.match(/RON|lei/i) && !t.includes('+'));
                 
                 if (texts.length > 0) {
                     const name = texts[0]; // Presupunem că primul text e titlul
                     const description = texts.slice(1).join(" ").substring(0, 200);
                     
                     const priceText = priceEl.textContent?.trim() || "0";
                     const priceMatch = priceText.match(/([\d,]+)/);
                     const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
                     
                     const imgEl = card.querySelector('img');
                     const imageUrl = imgEl ? (imgEl.getAttribute('src') || "") : "";
                     
                     // Încercăm să aflăm categoria
                     let category = "Meniu";
                     let parent = card.parentElement;
                     let catDepth = 0;
                     while(parent && catDepth < 5) {
                         const heading = parent.querySelector('h2');
                         if (heading && heading.textContent) {
                             category = heading.textContent.trim();
                             break;
                         }
                         parent = parent.parentElement;
                         catDepth++;
                     }

                     const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                     if (name && price > 0 && name.length < 100) {
                         items.push({
                             id,
                             name,
                             description,
                             category,
                             imageUrl,
                             prices: [{
                                 platform: "glovo",
                                 available: true,
                                 price: price,
                                 deepLink: url
                             }]
                         });
                     }
                 }
             }
          });
          
          // Eliminăm duplicatele după id
          const uniqueItems = [];
          const seenIds = new Set();
          for (const item of items) {
              if (!seenIds.has(item.id)) {
                  seenIds.add(item.id);
                  uniqueItems.push(item);
              }
          }

          return uniqueItems;
        }, rest.url);
        
        // DEBUG: Facem și un screenshot
        try {
            const screenshot = await page.screenshot({ type: 'jpeg', quality: 30 });
            menuItems.push({
               id: "debug-screenshot",
               name: "Screenshot",
               description: screenshot.toString('base64')
            });
        } catch (e) {}

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

