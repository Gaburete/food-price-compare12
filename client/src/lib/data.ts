// ============================================================
// FoodRadar — Date restaurante, meniuri și prețuri
// Design: Modern Minimal, accent portocaliu-roșu, Sora font
// Notă: Prețurile produselor sunt reale acolo unde sunt specificate,
//       taxele de livrare sunt estimative pentru MVP
// ============================================================

export type Platform = "glovo" | "bolt" | "wolt";

// Prețul unui produs specific pe o platformă
export interface ProductPlatformPrice {
  platform: Platform;
  available: boolean;
  price: number;       // RON — prețul produsului pe această platformă
  deepLink: string;
}

// Un produs din meniu
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;    // ex: "Meniuri", "Burgeri", "Deserturi"
  imageUrl: string;
  prices: ProductPlatformPrice[];
}

// Datele de livrare ale unui restaurant pe o platformă
export interface PlatformData {
  platform: Platform;
  available: boolean;
  deliveryFee: number;      // RON — taxa de livrare
  serviceFee: number;       // RON — taxa de servicii (valoare fixă de rezervă)
  serviceFeePercent?: number; // procent (ex: 0.06) din comandă
  serviceFeeMin?: number;     // limita minimă (ex: 2.49 RON)
  serviceFeeMax?: number;     // limita maximă (ex: 7.99 RON)
  smallOrderFee?: number;   // RON — taxă comandă mică fixă (opțională, se aplică sub un prag)
  smallOrderThreshold?: number; // RON — pragul sub care se aplică taxa (ex: 40)
  dynamicSmallOrderFee?: boolean; // dacă true, taxa = max(0, threshold - productPrice) ex: Glovo
  deliveryTime: number;     // minute — timp estimat livrare
  deepLink: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  platforms: PlatformData[];
  menu?: MenuItem[];   // meniu opțional — completat treptat
}

export const CITIES = [
  "București",
  "Cluj-Napoca",
  "Timișoara",
  "Iași",
  "Constanța",
  "Brașov",
  "Craiova",
  "Galați",
  "Ploiești",
  "Oradea",
];

export const PLATFORM_INFO: Record<Platform, { name: string; color: string; bgColor: string; borderColor: string; textColor: string }> = {
  glovo: {
    name: "Glovo",
    color: "#FFC244",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
  },
  bolt: {
    name: "Bolt Food",
    color: "#34D186",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-700",
  },
  wolt: {
    name: "Wolt",
    color: "#009DE0",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-300",
    textColor: "text-sky-700",
  },
};

export function calculateTotalFees(
  platformData: PlatformData,
  productPrice: number = 0
): {
  totalFee: number;
  deliveryFee: number;
  serviceFee: number;
  smallOrderFee: number;
} {
  const deliveryFee = platformData.deliveryFee;

  let smallOrderFee = 0;
  if (
    platformData.smallOrderThreshold &&
    productPrice > 0 &&
    productPrice < platformData.smallOrderThreshold
  ) {
    if (platformData.dynamicSmallOrderFee) {
      smallOrderFee = Math.max(0, platformData.smallOrderThreshold - productPrice);
    } else if (platformData.smallOrderFee) {
      smallOrderFee = platformData.smallOrderFee;
    }
  }

  let serviceFee = platformData.serviceFee;
  if (platformData.serviceFeePercent != null) {
    // Calculăm procentul din valoarea comenzii (fără taxa de livrare)
    serviceFee = productPrice * platformData.serviceFeePercent;
    
    if (platformData.serviceFeeMin != null && serviceFee < platformData.serviceFeeMin) {
      serviceFee = platformData.serviceFeeMin;
    }
    if (platformData.serviceFeeMax != null && serviceFee > platformData.serviceFeeMax) {
      serviceFee = platformData.serviceFeeMax;
    }
  }

  return {
    totalFee: deliveryFee + serviceFee + smallOrderFee,
    deliveryFee,
    serviceFee,
    smallOrderFee,
  };
}

export const RESTAURANTS: Restaurant[] = [
  // ===== BUCUREȘTI =====
  {
    id: "kfc-buc-1",
    name: "KFC",
    category: "Fast Food",
    city: "București",
    address: "Calea Victoriei 155, Sector 1",
    rating: 4.2,
    reviewCount: 1842,
    imageUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 7.99, serviceFee: 2.5, deliveryTime: 25, deepLink: "https://glovoapp.com/ro/ro/bucuresti/kfc/" },
      { platform: "bolt", available: true, deliveryFee: 5.99, serviceFee: 1.99, deliveryTime: 30, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
      { platform: "wolt", available: true, deliveryFee: 9.99, serviceFee: 0, deliveryTime: 20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/kfc" },
    ],
  },
  {
    id: "mcdonalds-buc-1",
    name: "McDonald's",
    category: "Fast Food",
    city: "București",
    address: "Bulevardul Unirii 14, Sector 4",
    rating: 4.0,
    reviewCount: 2341,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 0, serviceFee: 0.72, dynamicSmallOrderFee: true, smallOrderThreshold: 40, deliveryTime: 20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
      { platform: "bolt", available: true, deliveryFee: 7.99, serviceFee: 3.19, smallOrderFee: 0.10, smallOrderThreshold: 40, deliveryTime: 25, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
      { platform: "wolt", available: true, deliveryFee: 10.19, serviceFee: 2.79, deliveryTime: 20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
    ],
    menu: [
      // ── MENIURI MARI ─────────────────────────────────────────
      {
        id: "mcdonalds-buc-maxi-big-mac",
        name: "Meniu Maxi Big Mac™",
        description: "Big Mac + cartofi mari + băutură mare la alegere",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 32.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
  ],
  },
      {
        id: "mcdonalds-buc-maxi-big-tasty",
        name: "Meniu Maxi Big Tasty™",
        description: "Big Tasty + cartofi mari + băutură mare la alegere",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 39.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-maxi-dublu-cheeseburger",
        name: "Meniu Maxi Dublu Cheeseburger",
        description: "Dublu Cheeseburger + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 32.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-maxi-mcchicken",
        name: "Meniu Maxi McChicken™",
        description: "McChicken + cartofi mari + băutură mare la alegere",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 31.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 31.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 31.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-maxi-aripioare-7",
        name: "Meniu Maxi Aripioare de pui (7 buc.)",
        description: "7 aripioare picante + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 48.60, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 48.60, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 48.60, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-maxi-nuggets-6",
        name: "Meniu Maxi Chicken McNuggets™ (6 buc.)",
        description: "6 McNuggets + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.80, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.80, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 36.80, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-maxi-filet-o-fish",
        name: "Meniu Maxi Filet-O-Fish™",
        description: "Filet-O-Fish + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.80, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.80, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 32.80, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-mare-nuggets-9",
        name: "Meniu Mare Chicken McNuggets 9 buc.",
        description: "9 McNuggets + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 40.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 40.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 40.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-aripioare-9-mare",
        name: "Meniu Aripioare de pui 9 buc. Mare",
        description: "9 aripioare picante + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 54.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 54.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-aripioare-5-mare",
        name: "Meniu Aripioare de pui 5 buc. Mare",
        description: "5 aripioare picante + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 39.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-mccrispy-mare",
        name: "Meniu McCrispy Mare",
        description: "McCrispy + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 38.40, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 38.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-mccrispy-fresh-mare",
        name: "Meniu McCrispy Fresh Mare",
        description: "McCrispy Fresh + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 38.40, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 38.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-fresh-deluxe-mare",
        name: "Meniu Fresh Deluxe Mare",
        description: "Fresh Deluxe + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 36.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-quarter-pounder-mare",
        name: "Meniu Quarter Pounder with Cheese Mare",
        description: "Quarter Pounder + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.40, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.40, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 36.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-cheesy-jalapeno-mare",
        name: "Meniu Cheesy Jalapeño Bacon Quarter Pounder Mare",
        description: "Cheesy Jalapeño Bacon QP + cartofi mari + băutură",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 42.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 42.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 42.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-mcchicken-bacon-bbq-mare",
        name: "Meniu McChicken Bacon BBQ Mare",
        description: "McChicken Bacon BBQ + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 36.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── EDIȚIE LIMITATĂ ────────────────────────────────────────
      {
        id: "mcdonalds-buc-grande-home-menu",
        name: "Grande Home Menu",
        description: "Meniu mare pentru familie — burgeri, nuggets, cartofi și băuturi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 109.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 109.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 109.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-home-menu",
        name: "Home Menu",
        description: "Meniu pentru acasă — burgeri, cartofi și băuturi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 79.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 79.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 79.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-nuggets-friends",
        name: "Meniu McNuggets Friends",
        description: "Pachet McNuggets pentru grup cu sosuri și cartofi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 47.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 47.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 47.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-meniu-big-mac-friends",
        name: "Meniu Big Mac Friends",
        description: "Pachet Big Mac pentru grup cu cartofi și băuturi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 39.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-cheesy-jalapeno-qp",
        name: "Cheesy Jalapeño Bacon Quarter Pounder",
        description: "Burger Quarter Pounder cu jalapeño, bacon și brânză 180g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 28.80, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 28.80, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 28.80, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-mcchicken-bacon-bbq",
        name: "McChicken Bacon BBQ",
        description: "Burger McChicken cu bacon și sos BBQ 180g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 22.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 22.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-mozza-snacks",
        name: "Mozza Snacks",
        description: "Snacks cu mozzarella crocantă 72g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.00, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.00, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 13.00, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-placinta-capsune-iaurt",
        name: "Plăcintă cu Căpșune și Cremă cu Iaurt",
        description: "Plăcintă crocantă cu căpșune și cremă de iaurt 70g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.10, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 12.10, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-chili-cheese-vita",
        name: "Chili Cheese Vită",
        description: "Burger de vită cu sos chili și brânză 110g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-chili-cheese-pui",
        name: "Chili Cheese Pui",
        description: "Burger de pui cu sos chili și brânză 120g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── BURGERI & SANDVIȘURI ──────────────────────────────────
      {
        id: "mcdonalds-buc-aripioare-9",
        name: "Aripioare de pui 9 buc.",
        description: "9 aripioare de pui picante 300g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 36.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-nuggets-9-2sos",
        name: "9 Chicken McNuggets + 2 sosuri",
        description: "9 bucăți de pui crocant McNuggets cu 2 sosuri 161g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 33.40, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 33.40, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 33.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-aripioare-7",
        name: "Aripioare Picante 7 buc.",
        description: "7 aripioare de pui picante 235g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 30.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 30.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 30.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-big-tasty",
        name: "Big Tasty™",
        description: "Burger de vită cu brânză, legume și sos Big Tasty 321g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 30.40, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 30.40, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 30.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-mccrispy-fresh",
        name: "McCrispy Fresh",
        description: "Burger pui crocant cu sos, roșie și salată 210g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 29.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 29.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-mccrispy",
        name: "McCrispy",
        description: "Burger pui crocant cu cheddar, murături și sos McBacon 185g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 29.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 29.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-aripioare-5",
        name: "Aripioare de pui 5 buc.",
        description: "5 aripioare de pui picante 180g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 27.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 27.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-nuggets-6-1sos",
        name: "6 Chicken McNuggets + 1 sos",
        description: "6 bucăți de pui crocant McNuggets cu 1 sos 107g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 24.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 24.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 24.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-quarter-pounder",
        name: "Quarter Pounder with Cheese",
        description: "Burger de vită 100% cu brânză topită 200g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 23.40, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 23.40, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 23.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-fresh-deluxe",
        name: "Fresh Deluxe",
        description: "Burger de vită cu legume proaspete 239g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 22.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 22.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-big-mac",
        name: "Big Mac™",
        description: "Burger de vită cu castraveți murați și sos Big Mac 204g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 21.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 21.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-mcchicken",
        name: "McChicken™",
        description: "Burger de pui cu salată și sos 181g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 21.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 21.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-dublu-cheeseburger",
        name: "Dublu Cheeseburger",
        description: "Dublu burger de vită cu brânză 165g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 18.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 18.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 18.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-filet-o-fish",
        name: "Filet-O-Fish™",
        description: "Sandviș cu pește, brânză și sos tartar 136g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.00, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 17.00, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-aripioare-3",
        name: "Aripioare de pui 3 buc.",
        description: "3 aripioare de pui picante 100g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.00, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 17.00, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-cheeseburger",
        name: "Cheeseburger",
        description: "Burger clasic de vită cu brânză 113g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-hamburger",
        name: "Hamburger",
        description: "Burger clasic de vită 100g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-mctoast",
        name: "McToast",
        description: "Sandviș cu brânză și șuncă 94g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-mcpuisor",
        name: "McPuișor",
        description: "Burger de pui cu castraveți murați 109g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── CARTOFI & SOSURI ──────────────────────────────────────
      {
        id: "mcdonalds-buc-cartofi-mari",
        name: "Cartofi Prăjiți Porție Mare",
        description: "Porție mare de cartofi prăjiți crocani 150g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-cartofi-criss-cut",
        name: "Cartofi Criss Cut",
        description: "Cartofi tăiați în rețea, crocanti 135g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-cartofi-medii",
        name: "Cartofi Prăjiți Porție Medie",
        description: "Porție medie de cartofi prăjiți crocani 114g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.70, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.70, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 11.70, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-cartofi-mici",
        name: "Cartofi Prăjiți Porție Mică",
        description: "Porție mică de cartofi prăjiți crocani 80g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-vinaigrette",
        name: "Sos Vinaigrette",
        description: "Sos vinaigrette cu ulei și oțet 50ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-iaurt",
        name: "Sos Iaurt",
        description: "Sos de iaurt cremos 50ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-usturoi",
        name: "Sos Usturoi",
        description: "Sos de usturoi 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-smantana",
        name: "Sos Smântână",
        description: "Sos de smântână proaspătă",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-dulce-acrisor",
        name: "Sos Dulce-Acrișor",
        description: "Sos dulce-acrișor 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-ketchup",
        name: "Ketchup",
        description: "Ketchup clasic McDonald's 10ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-maioneza",
        name: "Maioneză",
        description: "Maioneză clasică 20ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-hot-devil",
        name: "Hot Hot Devil Sos Picant",
        description: "Sos picant Hot Devil 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-barbeque",
        name: "Sos Barbeque",
        description: "Sos BBQ afumat 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── HAPPY MEAL ─────────────────────────────────────────────
      {
        id: "mcdonalds-buc-happy-meal-hamburger",
        name: "Happy Meal™ Hamburger",
        description: "Hamburger + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-happy-meal-cheeseburger",
        name: "Happy Meal™ Cheeseburger",
        description: "Cheeseburger + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-happy-meal-mcpuisor",
        name: "Happy Meal™ McPuișor",
        description: "McPuișor + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-happy-meal-nuggets-4",
        name: "Happy Meal™ McNuggets 4",
        description: "4 McNuggets + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-happy-meal-mctoast",
        name: "Happy Meal™ McToast",
        description: "McToast + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-felie-ananas",
        name: "Felie de Ananas",
        description: "Felie proaspătă de ananas 60g",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.00, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.00, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.00, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── SALATE ────────────────────────────────────────────────
      {
        id: "mcdonalds-buc-salatzikos",
        name: "Salatzikos cu Pui",
        description: "Salată cu pui crocant 250g + 1 sos",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.00, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 27.00, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 27.00, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-salata-coleslaw",
        name: "Salată Coleslaw",
        description: "Salată coleslaw cu mix legume și sos cremos cu lămâie 200g",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sos-1000-island",
        name: "Sos 1000 Island Dressing",
        description: "Sos 1000 Island dressing 50ml",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── DESERTURI ─────────────────────────────────────────────
      {
        id: "mcdonalds-buc-placinta-capsune",
        name: "Plăcintă cu Căpșune și Cremă cu Iaurt",
        description: "Plăcintă crocantă cu căpșune și cremă de iaurt 70g",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.10, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 12.10, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-placinta-visine",
        name: "Plăcintă cu Vișine",
        description: "Plăcintă crocantă cu umplutură de vișine 70g",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 10.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 10.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-shake-ciocolata",
        name: "Shake Ciocolată",
        description: "Shake cremos cu aromă de ciocolată 250ml",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-shake-vanilie",
        name: "Shake Vanilie",
        description: "Shake cremos cu aromă de vanilie 250ml",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-shake-capsune",
        name: "Shake Căpșune",
        description: "Shake cremos cu aromă de căpșune 250ml",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── McCAFÉ ────────────────────────────────────────────────
      {
        id: "mcdonalds-buc-cappuccino",
        name: "Cappuccino Regular",
        description: "Cappuccino cremos McCafé 200ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-caffe-latte",
        name: "Caffé Latte Regular",
        description: "Caffé Latte McCafé 200ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-espresso",
        name: "Espresso Regular",
        description: "Espresso intens McCafé 30ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-americano",
        name: "Cafea Americano Regular",
        description: "Cafea Americano McCafé 180ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-ceai-energy",
        name: "Energy — Ceai de Fructe cu Aromă de Cireșe",
        description: "Ceai de fructe cu aromă de cireșe 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-ceai-apple",
        name: "Oriental Apple — Ceai de Fructe cu Aromă de Mere",
        description: "Ceai de fructe cu aromă de mere 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-ceai-jasmine",
        name: "Jasmine — Ceai Verde cu Flori de Iasomie",
        description: "Ceai verde cu flori de iasomie 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-ceai-peppermint",
        name: "Peppermint — Ceai de Plante cu Aromă de Mere",
        description: "Ceai de plante cu aromă de mere 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-ceai-herbs-honey",
        name: "Herbs & Honey — Ceai de Plante cu Aromă de Miere",
        description: "Ceai de plante cu aromă de miere 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-ceai-english",
        name: "English Breakfast — Ceai Negru",
        description: "Ceai negru English Breakfast 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      // ── BĂUTURI ───────────────────────────────────────────────
      {
        id: "mcdonalds-buc-apa-plata",
        name: "Apă Minerală Plată 500ml",
        description: "Apă minerală plată 500ml + garanție sticlă",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 11.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-apa-carbogazoasa",
        name: "Apă Minerală Carbogazoasă 500ml",
        description: "Apă minerală carbogazoasă 500ml + garanție sticlă",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.50, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 11.50, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-suc-mere",
        name: "Suc de Mere 250ml",
        description: "Suc natural de mere 250ml",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.00, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 11.00, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-suc-portocale",
        name: "Suc de Portocale 250ml",
        description: "Suc natural de portocale 250ml",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.00, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 11.00, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-coca-cola",
        name: "Coca-Cola",
        description: "Coca-Cola răcoritoare",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-coca-cola-zero",
        name: "Coca-Cola Zero 250ml",
        description: "Coca-Cola Zero fără zahăr 250ml",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-fanta",
        name: "Fanta",
        description: "Fanta portocale răcoritoare",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-sprite",
        name: "Sprite",
        description: "Sprite lămâie răcoritoare",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
      {
        id: "mcdonalds-buc-lipton",
        name: "Lipton Ice Tea",
        description: "Lipton Ice Tea răcoritor",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
        ],
      },
    ],
  },
  {
    id: "dristor-buc-1",
    name: "Dristor Kebab",
    category: "Shaorma & Kebab",
    city: "București",
    address: "Bulevardul Dristor 3, Sector 3",
    rating: 4.6,
    reviewCount: 3120,
    imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 5.99, serviceFee: 2.0, deliveryTime: 30, deepLink: "https://glovoapp.com/ro/ro/bucuresti/dristor-kebab/" },
      { platform: "bolt", available: true, deliveryFee: 3.99, serviceFee: 1.5, deliveryTime: 35, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
      { platform: "wolt", available: true, deliveryFee: 6.99, serviceFee: 0, deliveryTime: 25, deepLink: "https://wolt.com/ro/rou/bucharest" },
    ],
  },
  {
    id: "pizza-hut-buc-1",
    name: "Pizza Hut",
    category: "Pizza",
    city: "București",
    address: "Piața Unirii 1, Sector 3",
    rating: 4.1,
    reviewCount: 987,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 8.99, serviceFee: 2.5, deliveryTime: 35, deepLink: "https://glovoapp.com/ro/ro/bucuresti/pizza-hut/" },
      { platform: "bolt", available: true, deliveryFee: 7.99, serviceFee: 1.99, deliveryTime: 40, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
      { platform: "wolt", available: true, deliveryFee: 10.99, serviceFee: 0, deliveryTime: 30, deepLink: "https://wolt.com/ro/rou/bucharest" },
    ],
  },
  {
    id: "subway-buc-1",
    name: "Subway",
    category: "Sandwichuri",
    city: "București",
    address: "Calea Floreasca 246B, Sector 1",
    rating: 4.3,
    reviewCount: 654,
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 6.99, serviceFee: 2.0, deliveryTime: 25, deepLink: "https://glovoapp.com/ro/ro/bucuresti/subway/" },
      { platform: "bolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
      { platform: "wolt", available: true, deliveryFee: 8.99, serviceFee: 0, deliveryTime: 20, deepLink: "https://wolt.com/ro/rou/bucharest" },
    ],
  },
  {
    id: "taco-bell-buc-1",
    name: "Taco Bell",
    category: "Mexican",
    city: "București",
    address: "Bulevardul Magheru 22, Sector 1",
    rating: 4.4,
    reviewCount: 1203,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 7.99, serviceFee: 2.5, deliveryTime: 30, deepLink: "https://glovoapp.com/ro/ro/bucuresti/taco-bell/" },
      { platform: "bolt", available: true, deliveryFee: 5.99, serviceFee: 1.99, deliveryTime: 35, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
      { platform: "wolt", available: true, deliveryFee: 9.99, serviceFee: 0, deliveryTime: 25, deepLink: "https://wolt.com/ro/rou/bucharest" },
    ],
  },
  // ===== CLUJ-NAPOCA =====
  {
    id: "kfc-cluj-1",
    name: "KFC",
    category: "Fast Food",
    city: "Cluj-Napoca",
    address: "Calea Turzii 178",
    rating: 4.1,
    reviewCount: 876,
    imageUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 8.99, serviceFee: 2.5, deliveryTime: 30, deepLink: "https://glovoapp.com/ro/ro/cluj-napoca/kfc/" },
      { platform: "bolt", available: true, deliveryFee: 6.99, serviceFee: 1.99, deliveryTime: 35, deepLink: "https://food.bolt.eu/ro-RO/cluj-napoca/" },
      { platform: "wolt", available: true, deliveryFee: 7.99, serviceFee: 0, deliveryTime: 25, deepLink: "https://wolt.com/ro/rou/cluj-napoca" },
    ],
  },
  {
    id: "mcdonalds-cluj-1",
    name: "McDonald's",
    category: "Fast Food",
    city: "Cluj-Napoca",
    address: "Piața Unirii 10",
    rating: 4.0,
    reviewCount: 1120,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 7.99, serviceFee: 2.5, deliveryTime: 25, deepLink: "https://glovoapp.com/ro/ro/cluj-napoca/mcdonalds/" },
      { platform: "bolt", available: true, deliveryFee: 5.99, serviceFee: 1.99, deliveryTime: 30, deepLink: "https://food.bolt.eu/ro-RO/cluj-napoca/" },
      { platform: "wolt", available: true, deliveryFee: 8.99, serviceFee: 0, deliveryTime: 20, deepLink: "https://wolt.com/ro/rou/cluj-napoca" },
    ],
  },
  // ===== TIMIȘOARA =====
  {
    id: "kfc-tm-1",
    name: "KFC",
    category: "Fast Food",
    city: "Timișoara",
    address: "Calea Torontalului 24",
    rating: 4.2,
    reviewCount: 654,
    imageUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 7.99, serviceFee: 2.5, deliveryTime: 28, deepLink: "https://glovoapp.com/ro/ro/timisoara/kfc/" },
      { platform: "bolt", available: true, deliveryFee: 5.49, serviceFee: 1.99, deliveryTime: 32, deepLink: "https://food.bolt.eu/ro-RO/timisoara/" },
      { platform: "wolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://wolt.com/ro/rou/timisoara" },
    ],
  },
  {
    id: "pizza-hut-tm-1",
    name: "Pizza Hut",
    category: "Pizza",
    city: "Timișoara",
    address: "Bulevardul Republicii 12",
    rating: 4.0,
    reviewCount: 432,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 9.99, serviceFee: 2.5, deliveryTime: 40, deepLink: "https://glovoapp.com/ro/ro/timisoara/pizza-hut/" },
      { platform: "bolt", available: true, deliveryFee: 8.99, serviceFee: 1.99, deliveryTime: 45, deepLink: "https://food.bolt.eu/ro-RO/timisoara/" },
      { platform: "wolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://wolt.com/ro/rou/timisoara" },
    ],
  },
  // ===== IAȘI =====
  {
    id: "mcdonalds-is-1",
    name: "McDonald's",
    category: "Fast Food",
    city: "Iași",
    address: "Bulevardul Ștefan cel Mare 4",
    rating: 4.1,
    reviewCount: 789,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 8.99, serviceFee: 2.5, deliveryTime: 30, deepLink: "https://glovoapp.com/ro/ro/iasi/mcdonalds/" },
      { platform: "bolt", available: true, deliveryFee: 6.99, serviceFee: 1.99, deliveryTime: 35, deepLink: "https://food.bolt.eu/ro-RO/iasi/" },
      { platform: "wolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://wolt.com/ro/rou/iasi" },
    ],
  },
  // ===== CONSTANȚA =====
  {
    id: "kfc-ct-1",
    name: "KFC",
    category: "Fast Food",
    city: "Constanța",
    address: "Bulevardul Alexandru Lăpușneanu 116C",
    rating: 4.1,
    reviewCount: 612,
    imageUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 8.99, serviceFee: 2.5, deliveryTime: 30, deepLink: "https://glovoapp.com/ro/ro/constanta/kfc/" },
      { platform: "bolt", available: true, deliveryFee: 6.49, serviceFee: 1.99, deliveryTime: 35, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
      { platform: "wolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://wolt.com/ro/rou/constanta" },
    ],
  },
  {
    id: "mcdonalds-ct-1",
    name: "McDonald's",
    category: "Fast Food",
    city: "Constanța",
    address: "Bulevardul Tomis 391",
    rating: 4.0,
    reviewCount: 834,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 2.99, serviceFee: 3.07, smallOrderFee: 8.29, smallOrderThreshold: 40, deliveryTime: 25, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
      { platform: "bolt", available: true, deliveryFee: 7.53, serviceFee: 3.03, smallOrderFee: 7.10, smallOrderThreshold: 40, deliveryTime: 30, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
      { platform: "wolt", available: true, deliveryFee: 4.99, serviceFee: 2.67, smallOrderFee: 2.10, smallOrderThreshold: 40, deliveryTime: 28, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
    ],
    menu: [
      // ── MENIURI MARI ─────────────────────────────────────────
      {
        id: "mcdonalds-buc-maxi-big-mac",
        name: "Meniu Maxi Big Mac™",
        description: "Big Mac + cartofi mari + băutură mare la alegere",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.90, deepLink: "https://glovoapp.com/ro/ro/bucuresti/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.90, deepLink: "https://food.bolt.eu/ro-RO/bucuresti/" },
          { platform: "wolt", available: true, price: 32.90, deepLink: "https://wolt.com/ro/rou/bucharest/restaurant/mcdonalds-bucuresti" },
  ],
  },
      {
        id: "mcdonalds-ct-maxi-big-tasty",
        name: "Meniu Maxi Big Tasty™",
        description: "Big Tasty + cartofi mari + băutură mare la alegere",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 39.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-maxi-dublu-cheeseburger",
        name: "Meniu Maxi Dublu Cheeseburger",
        description: "Dublu Cheeseburger + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 32.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-maxi-mcchicken",
        name: "Meniu Maxi McChicken™",
        description: "McChicken + cartofi mari + băutură mare la alegere",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 31.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 31.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 31.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-maxi-aripioare-7",
        name: "Meniu Maxi Aripioare de pui (7 buc.)",
        description: "7 aripioare picante + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 48.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 48.60, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 48.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-maxi-nuggets-6",
        name: "Meniu Maxi Chicken McNuggets™ (6 buc.)",
        description: "6 McNuggets + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.80, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.80, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 36.80, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-maxi-filet-o-fish",
        name: "Meniu Maxi Filet-O-Fish™",
        description: "Filet-O-Fish + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.80, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.80, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 32.80, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-mare-nuggets-9",
        name: "Meniu Mare Chicken McNuggets 9 buc.",
        description: "9 McNuggets + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 40.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 40.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 40.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-aripioare-9-mare",
        name: "Meniu Aripioare de pui 9 buc. Mare",
        description: "9 aripioare picante + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 54.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 54.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-aripioare-5-mare",
        name: "Meniu Aripioare de pui 5 buc. Mare",
        description: "5 aripioare picante + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 39.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-mccrispy-mare",
        name: "Meniu McCrispy Mare",
        description: "McCrispy + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 38.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 38.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-mccrispy-fresh-mare",
        name: "Meniu McCrispy Fresh Mare",
        description: "McCrispy Fresh + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 38.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 38.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-fresh-deluxe-mare",
        name: "Meniu Fresh Deluxe Mare",
        description: "Fresh Deluxe + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 36.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-quarter-pounder-mare",
        name: "Meniu Quarter Pounder with Cheese Mare",
        description: "Quarter Pounder + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.40, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 36.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-cheesy-jalapeno-mare",
        name: "Meniu Cheesy Jalapeño Bacon Quarter Pounder Mare",
        description: "Cheesy Jalapeño Bacon QP + cartofi mari + băutură",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 42.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 42.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 42.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-mcchicken-bacon-bbq-mare",
        name: "Meniu McChicken Bacon BBQ Mare",
        description: "McChicken Bacon BBQ + cartofi mari + băutură mare",
        category: "Meniuri Mari",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 36.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── EDIȚIE LIMITATĂ ────────────────────────────────────────
      {
        id: "mcdonalds-ct-grande-home-menu",
        name: "Grande Home Menu",
        description: "Meniu mare pentru familie — burgeri, nuggets, cartofi și băuturi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 109.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 109.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 109.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-home-menu",
        name: "Home Menu",
        description: "Meniu pentru acasă — burgeri, cartofi și băuturi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 79.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 79.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 79.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-nuggets-friends",
        name: "Meniu McNuggets Friends",
        description: "Pachet McNuggets pentru grup cu sosuri și cartofi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 47.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 47.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 47.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-meniu-big-mac-friends",
        name: "Meniu Big Mac Friends",
        description: "Pachet Big Mac pentru grup cu cartofi și băuturi",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 39.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-cheesy-jalapeno-qp",
        name: "Cheesy Jalapeño Bacon Quarter Pounder",
        description: "Burger Quarter Pounder cu jalapeño, bacon și brânză 180g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 28.80, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 28.80, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 28.80, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-mcchicken-bacon-bbq",
        name: "McChicken Bacon BBQ",
        description: "Burger McChicken cu bacon și sos BBQ 180g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 22.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 22.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-mozza-snacks",
        name: "Mozza Snacks",
        description: "Snacks cu mozzarella crocantă 72g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.00, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 13.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-placinta-capsune-iaurt",
        name: "Plăcintă cu Căpșune și Cremă cu Iaurt",
        description: "Plăcintă crocantă cu căpșune și cremă de iaurt 70g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.10, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 12.10, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-chili-cheese-vita",
        name: "Chili Cheese Vită",
        description: "Burger de vită cu sos chili și brânză 110g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-chili-cheese-pui",
        name: "Chili Cheese Pui",
        description: "Burger de pui cu sos chili și brânză 120g",
        category: "Ediție Limitată",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── BURGERI & SANDVIȘURI ──────────────────────────────────
      {
        id: "mcdonalds-ct-aripioare-9",
        name: "Aripioare de pui 9 buc.",
        description: "9 aripioare de pui picante 300g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 36.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-nuggets-9-2sos",
        name: "9 Chicken McNuggets + 2 sosuri",
        description: "9 bucăți de pui crocant McNuggets cu 2 sosuri 161g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 33.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 33.40, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 33.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-aripioare-7",
        name: "Aripioare Picante 7 buc.",
        description: "7 aripioare de pui picante 235g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 30.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 30.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 30.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-big-tasty",
        name: "Big Tasty™",
        description: "Burger de vită cu brânză, legume și sos Big Tasty 321g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 30.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 30.40, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 30.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-mccrispy-fresh",
        name: "McCrispy Fresh",
        description: "Burger pui crocant cu sos, roșie și salată 210g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 29.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 29.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-mccrispy",
        name: "McCrispy",
        description: "Burger pui crocant cu cheddar, murături și sos McBacon 185g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 29.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 29.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-aripioare-5",
        name: "Aripioare de pui 5 buc.",
        description: "5 aripioare de pui picante 180g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 27.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 27.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-nuggets-6-1sos",
        name: "6 Chicken McNuggets + 1 sos",
        description: "6 bucăți de pui crocant McNuggets cu 1 sos 107g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 24.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 24.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 24.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-quarter-pounder",
        name: "Quarter Pounder with Cheese",
        description: "Burger de vită 100% cu brânză topită 200g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 23.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 23.40, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 23.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-fresh-deluxe",
        name: "Fresh Deluxe",
        description: "Burger de vită cu legume proaspete 239g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 22.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 22.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-big-mac",
        name: "Big Mac™",
        description: "Burger de vită cu castraveți murați și sos Big Mac 204g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 21.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 21.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-mcchicken",
        name: "McChicken™",
        description: "Burger de pui cu salată și sos 181g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 21.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 21.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-dublu-cheeseburger",
        name: "Dublu Cheeseburger",
        description: "Dublu burger de vită cu brânză 165g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 18.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 18.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 18.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-filet-o-fish",
        name: "Filet-O-Fish™",
        description: "Sandviș cu pește, brânză și sos tartar 136g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 17.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-aripioare-3",
        name: "Aripioare de pui 3 buc.",
        description: "3 aripioare de pui picante 100g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 17.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-cheeseburger",
        name: "Cheeseburger",
        description: "Burger clasic de vită cu brânză 113g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-hamburger",
        name: "Hamburger",
        description: "Burger clasic de vită 100g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-mctoast",
        name: "McToast",
        description: "Sandviș cu brânză și șuncă 94g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-mcpuisor",
        name: "McPuișor",
        description: "Burger de pui cu castraveți murați 109g",
        category: "Burgeri & Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── CARTOFI & SOSURI ──────────────────────────────────────
      {
        id: "mcdonalds-ct-cartofi-mari",
        name: "Cartofi Prăjiți Porție Mare",
        description: "Porție mare de cartofi prăjiți crocani 150g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-cartofi-criss-cut",
        name: "Cartofi Criss Cut",
        description: "Cartofi tăiați în rețea, crocanti 135g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-cartofi-medii",
        name: "Cartofi Prăjiți Porție Medie",
        description: "Porție medie de cartofi prăjiți crocani 114g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.70, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.70, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 11.70, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-cartofi-mici",
        name: "Cartofi Prăjiți Porție Mică",
        description: "Porție mică de cartofi prăjiți crocani 80g",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-vinaigrette",
        name: "Sos Vinaigrette",
        description: "Sos vinaigrette cu ulei și oțet 50ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-iaurt",
        name: "Sos Iaurt",
        description: "Sos de iaurt cremos 50ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-usturoi",
        name: "Sos Usturoi",
        description: "Sos de usturoi 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-smantana",
        name: "Sos Smântână",
        description: "Sos de smântână proaspătă",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-dulce-acrisor",
        name: "Sos Dulce-Acrișor",
        description: "Sos dulce-acrișor 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-ketchup",
        name: "Ketchup",
        description: "Ketchup clasic McDonald's 10ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-maioneza",
        name: "Maioneză",
        description: "Maioneză clasică 20ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-hot-devil",
        name: "Hot Hot Devil Sos Picant",
        description: "Sos picant Hot Devil 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-barbeque",
        name: "Sos Barbeque",
        description: "Sos BBQ afumat 25ml",
        category: "Cartofi & Sosuri",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── HAPPY MEAL ─────────────────────────────────────────────
      {
        id: "mcdonalds-ct-happy-meal-hamburger",
        name: "Happy Meal™ Hamburger",
        description: "Hamburger + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-happy-meal-cheeseburger",
        name: "Happy Meal™ Cheeseburger",
        description: "Cheeseburger + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-happy-meal-mcpuisor",
        name: "Happy Meal™ McPuișor",
        description: "McPuișor + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-happy-meal-nuggets-4",
        name: "Happy Meal™ McNuggets 4",
        description: "4 McNuggets + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-happy-meal-mctoast",
        name: "Happy Meal™ McToast",
        description: "McToast + cartofi mici + băutură + jucărie surpriză",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 20.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-felie-ananas",
        name: "Felie de Ananas",
        description: "Felie proaspătă de ananas 60g",
        category: "Happy Meal",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.00, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── SALATE ────────────────────────────────────────────────
      {
        id: "mcdonalds-ct-salatzikos",
        name: "Salatzikos cu Pui",
        description: "Salată cu pui crocant 250g + 1 sos",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 27.00, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 27.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-salata-coleslaw",
        name: "Salată Coleslaw",
        description: "Salată coleslaw cu mix legume și sos cremos cu lămâie 200g",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sos-1000-island",
        name: "Sos 1000 Island Dressing",
        description: "Sos 1000 Island dressing 50ml",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── DESERTURI ─────────────────────────────────────────────
      {
        id: "mcdonalds-ct-placinta-capsune",
        name: "Plăcintă cu Căpșune și Cremă cu Iaurt",
        description: "Plăcintă crocantă cu căpșune și cremă de iaurt 70g",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.10, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 12.10, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-placinta-visine",
        name: "Plăcintă cu Vișine",
        description: "Plăcintă crocantă cu umplutură de vișine 70g",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 10.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 10.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-shake-ciocolata",
        name: "Shake Ciocolată",
        description: "Shake cremos cu aromă de ciocolată 250ml",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-shake-vanilie",
        name: "Shake Vanilie",
        description: "Shake cremos cu aromă de vanilie 250ml",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-shake-capsune",
        name: "Shake Căpșune",
        description: "Shake cremos cu aromă de căpșune 250ml",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── McCAFÉ ────────────────────────────────────────────────
      {
        id: "mcdonalds-ct-cappuccino",
        name: "Cappuccino Regular",
        description: "Cappuccino cremos McCafé 200ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-caffe-latte",
        name: "Caffé Latte Regular",
        description: "Caffé Latte McCafé 200ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-espresso",
        name: "Espresso Regular",
        description: "Espresso intens McCafé 30ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-americano",
        name: "Cafea Americano Regular",
        description: "Cafea Americano McCafé 180ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-ceai-energy",
        name: "Energy — Ceai de Fructe cu Aromă de Cireșe",
        description: "Ceai de fructe cu aromă de cireșe 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-ceai-apple",
        name: "Oriental Apple — Ceai de Fructe cu Aromă de Mere",
        description: "Ceai de fructe cu aromă de mere 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-ceai-jasmine",
        name: "Jasmine — Ceai Verde cu Flori de Iasomie",
        description: "Ceai verde cu flori de iasomie 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-ceai-peppermint",
        name: "Peppermint — Ceai de Plante cu Aromă de Mere",
        description: "Ceai de plante cu aromă de mere 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-ceai-herbs-honey",
        name: "Herbs & Honey — Ceai de Plante cu Aromă de Miere",
        description: "Ceai de plante cu aromă de miere 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-ceai-english",
        name: "English Breakfast — Ceai Negru",
        description: "Ceai negru English Breakfast 300ml",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      // ── BĂUTURI ───────────────────────────────────────────────
      {
        id: "mcdonalds-ct-apa-plata",
        name: "Apă Minerală Plată 500ml",
        description: "Apă minerală plată 500ml + garanție sticlă",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 11.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-apa-carbogazoasa",
        name: "Apă Minerală Carbogazoasă 500ml",
        description: "Apă minerală carbogazoasă 500ml + garanție sticlă",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 11.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-suc-mere",
        name: "Suc de Mere 250ml",
        description: "Suc natural de mere 250ml",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 11.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-suc-portocale",
        name: "Suc de Portocale 250ml",
        description: "Suc natural de portocale 250ml",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 11.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-coca-cola",
        name: "Coca-Cola",
        description: "Coca-Cola răcoritoare",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-coca-cola-zero",
        name: "Coca-Cola Zero 250ml",
        description: "Coca-Cola Zero fără zahăr 250ml",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-fanta",
        name: "Fanta",
        description: "Fanta portocale răcoritoare",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-sprite",
        name: "Sprite",
        description: "Sprite lămâie răcoritoare",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
      {
        id: "mcdonalds-ct-lipton",
        name: "Lipton Ice Tea",
        description: "Lipton Ice Tea răcoritor",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds-constanta" },
        ],
      },
    ],
  },
  {
    id: "pizza-hut-ct-1",
    name: "Pizza Hut",
    category: "Pizza",
    city: "Constanța",
    address: "Bulevardul Mamaia 255",
    rating: 4.2,
    reviewCount: 478,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 9.99, serviceFee: 2.5, deliveryTime: 35, deepLink: "https://glovoapp.com/ro/ro/constanta/pizza-hut/" },
      { platform: "bolt", available: true, deliveryFee: 7.99, serviceFee: 1.99, deliveryTime: 40, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
      { platform: "wolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://wolt.com/ro/rou/constanta" },
    ],
  },
  {
    id: "dristor-ct-1",
    name: "Dristor Kebab",
    category: "Shaorma & Kebab",
    city: "Constanța",
    address: "Strada Ștefan cel Mare 15",
    rating: 4.5,
    reviewCount: 923,
    imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 6.99, serviceFee: 2.0, deliveryTime: 28, deepLink: "https://glovoapp.com/ro/ro/constanta/dristor-kebab/" },
      { platform: "bolt", available: true, deliveryFee: 4.99, serviceFee: 1.5, deliveryTime: 32, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
      { platform: "wolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://wolt.com/ro/rou/constanta" },
    ],
  },
  {
    id: "subway-ct-1",
    name: "Subway",
    category: "Sandwichuri",
    city: "Constanța",
    address: "Bulevardul Alexandru Lăpușneanu 163",
    rating: 4.3,
    reviewCount: 341,
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 8.49, serviceFee: 2.0, deliveryTime: 30, deepLink: "https://glovoapp.com/ro/ro/constanta/subway/" },
      { platform: "bolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://food.bolt.eu/ro-RO/constanta/" },
      { platform: "wolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://wolt.com/ro/rou/constanta" },
    ],
  },
  // ===== BRAȘOV =====
  {
    id: "kfc-bv-1",
    name: "KFC",
    category: "Fast Food",
    city: "Brașov",
    address: "Bulevardul 15 Noiembrie 100",
    rating: 4.3,
    reviewCount: 543,
    imageUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 8.49, serviceFee: 2.5, deliveryTime: 30, deepLink: "https://glovoapp.com/ro/ro/brasov/kfc/" },
      { platform: "bolt", available: true, deliveryFee: 6.49, serviceFee: 1.99, deliveryTime: 35, deepLink: "https://food.bolt.eu/ro-RO/brasov/" },
      { platform: "wolt", available: true, deliveryFee: 7.99, serviceFee: 0, deliveryTime: 25, deepLink: "https://wolt.com/ro/rou/brasov" },
    ],
  },
];

// ─── Funcții helper ───────────────────────────────────────────

// Prețul total pentru un produs pe o platformă (preț produs + taxe livrare + taxă comandă mică dacă e cazul)
export function getProductTotal(
  productPrice: number,
  platform: Platform,
  restaurant: Restaurant
): number {
  const p = restaurant.platforms.find((pl) => pl.platform === platform);
  if (!p || !p.available) return Infinity;
  
  const { totalFee } = calculateTotalFees(p, productPrice);
  return productPrice + totalFee;
}

// Platforma cu cel mai mic preț total pentru un produs
export function getCheapestForProduct(
  item: MenuItem,
  restaurant: Restaurant
): Platform | null {
  const available = item.prices.filter((p) => p.available);
  if (available.length === 0) return null;
  return available.reduce((min, p) =>
    getProductTotal(p.price, p.platform, restaurant) <
    getProductTotal(min.price, min.platform, restaurant)
      ? p
      : min
  ).platform;
}

// Platforma cu cel mai mic preț total la nivel de restaurant (fără produs specific)
export function getCheapestPlatform(platforms: PlatformData[]): Platform | null {
  const available = platforms.filter((p) => p.available);
  if (available.length === 0) return null;
  
  // Folosim taxa de livrare + servicii ca indicator general
  return available.reduce((min, p) => {
    const minFees = calculateTotalFees(min, 0);
    const pFees = calculateTotalFees(p, 0);
    return (pFees.deliveryFee + pFees.serviceFee) < (minFees.deliveryFee + minFees.serviceFee) ? p : min;
  }).platform;
}

// Caută restaurante după nume și oraș
export function searchRestaurants(query: string, city: string): Restaurant[] {
  return searchRestaurantsInCollection(query, city, RESTAURANTS);
}

export function searchRestaurantsInCollection(
  query: string,
  city: string,
  restaurants: Restaurant[]
): Restaurant[] {
  const q = query.toLowerCase().trim();
  return restaurants.filter((r) => {
    const matchCity = city === "Toate orașele" || r.city === city;
    const matchName =
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.menu || []).some((item) => item.name.toLowerCase().includes(q));
    return matchCity && (q === "" || matchName);
  });
}

// Caută produse din meniu după query
export function searchMenuItems(
  query: string,
  restaurant: Restaurant
): MenuItem[] {
  if (!restaurant.menu) return [];
  const q = query.toLowerCase().trim();
  if (!q) return restaurant.menu;
  return restaurant.menu.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
}
