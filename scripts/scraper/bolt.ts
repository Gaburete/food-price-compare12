import { BrowserContext } from "playwright";

export async function scrapeBolt(context: BrowserContext, address: string) {
  const page = await context.newPage();
  const fees: Record<string, any> = {};

  try {
    // 1. Mergem pe pagina principală Bolt Food Constanța
    await page.goto("https://food.bolt.eu/ro-ro/462-constanta/", { waitUntil: 'domcontentloaded' });
    
    // 2. Setăm adresa (Dacă Bolt cere introducerea adresei pe web)
    // await page.click('input[placeholder="Introdu adresa"]');
    // await page.fill('input[placeholder="Introdu adresa"]', address);
    // await page.waitForTimeout(2000);
    // await page.keyboard.press('Enter');
    
    await page.waitForTimeout(3000);

    const restaurantsToScrape = [
      { id: "kfc-buc-1", url: "https://food.bolt.eu/ro-ro/462-constanta/p/kfc-tomis" }
    ];

    for (const rest of restaurantsToScrape) {
      await page.goto(rest.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Aici extragem taxa de livrare
      // const deliveryText = await page.textContent('.bolt-delivery-fee-selector');

      fees[rest.id] = {
        deliveryFee: 5.99,
        serviceFee: 1.99
      };
    }

  } finally {
    await page.close();
  }

  return fees;
}
