import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { RESTAURANTS } from "../client/src/lib/data";
import { applyDeliveryFeeOverrides } from "../shared/delivery-fees";
import { applyRestaurantMenus } from "../shared/restaurant-menus";
import {
  readDeliveryFeeDataset,
  writeDeliveryFeeDataset,
} from "./deliveryFeeStore";
import { readRestaurantMenusDataset } from "./restaurantMenuStore";
import { runScrapers } from "../scripts/scraper/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const syncToken = process.env.DELIVERY_FEES_SYNC_TOKEN;
  const syncSourceUrl = process.env.DELIVERY_FEES_SOURCE_URL;

  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("/api/restaurants", async (_req, res) => {
    try {
      const deliveryFees = await readDeliveryFeeDataset();
      const menus = await readRestaurantMenusDataset();
      const restaurants = applyRestaurantMenus(
        applyDeliveryFeeOverrides(RESTAURANTS, deliveryFees),
        menus
      );
      res.json({
        restaurants,
        deliveryFeesUpdatedAt: deliveryFees.updatedAt,
        deliveryFeesSource: deliveryFees.source ?? null,
        menusUpdatedAt: menus.updatedAt,
        menusSource: menus.source ?? null,
      });
    } catch (error) {
      console.error("Failed to load restaurants", error);
      res.status(500).json({ error: "Failed to load restaurants" });
    }
  });

  app.get("/api/delivery-fees", async (_req, res) => {
    try {
      const dataset = await readDeliveryFeeDataset();
      res.json(dataset);
    } catch (error) {
      console.error("Failed to load delivery fees", error);
      res.status(500).json({ error: "Failed to load delivery fees" });
    }
  });

  app.post("/api/admin/delivery-fees/sync", async (req, res) => {
    const providedToken = req.header("x-sync-token");

    if (!syncToken || providedToken !== syncToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      console.log("Pornim scraper-ul pentru Bulevardul Tomis, 47...");
      const addressToScrape = req.body.address || "Bulevardul Tomis 47, Constanta";
      const scrapedFees = await runScrapers(addressToScrape);

      const dataset = {
        updatedAt: new Date().toISOString(),
        source: "playwright-scraper",
        fees: {
          "kfc-buc-1": {
            ...(scrapedFees.glovo?.["kfc-buc-1"] ? { glovo: scrapedFees.glovo["kfc-buc-1"] } : {}),
            ...(scrapedFees.bolt?.["kfc-buc-1"] ? { bolt: scrapedFees.bolt["kfc-buc-1"] } : {}),
            ...(scrapedFees.wolt?.["kfc-buc-1"] ? { wolt: scrapedFees.wolt["kfc-buc-1"] } : {})
          }
        }
      };

      await writeDeliveryFeeDataset(dataset as any);

      res.json({
        ok: true,
        updatedAt: dataset.updatedAt,
        source: dataset.source ?? null,
        restaurantCount: RESTAURANTS.length,
        scrapedFees
      });
    } catch (error) {
      console.error("Delivery fee sync failed", error);
      res.status(500).json({ error: "Delivery fee sync failed" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
