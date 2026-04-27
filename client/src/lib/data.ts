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
    id: "dabo-doner-constanta",
    name: "DAbo Doner",
    category: "Doner & Kebab",
    city: "Constanța",
    address: "Strada Mircea cel Bătrân, Constanța",
    rating: 4.5,
    reviewCount: 850,
    imageUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&q=80",
    platforms: [
      {
        platform: "glovo",
        available: true,
        deliveryFee: 6.99,
        serviceFeePercent: 0.05,
        serviceFeeMin: 2.0,
        serviceFeeMax: 5.0,
        smallOrderFee: 5.99,
        smallOrderThreshold: 45.0,
        dynamicSmallOrderFee: true,
        deliveryTime: 25,
        deepLink: "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
      },
      {
        platform: "bolt",
        available: true,
        deliveryFee: 5.99,
        serviceFee: 1.50,
        deliveryTime: 30,
        deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
      },
      {
        platform: "wolt",
        available: true,
        deliveryFee: 7.49,
        serviceFee: 2.00,
        deliveryTime: 20,
        deepLink: "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
      }
    ],
    menu: [
      {
            "id": "dabo-gogoși-cu-gem",
            "name": "Gogoși cu gem",
            "description": "Aluat 95g, gem 50g-145g",
            "category": "Promoții",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 12.74,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 12.74,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 12.74,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-dulce-cu-banane",
            "name": "DAbo Dulce cu banane",
            "description": "Chiflă 85g, Nutella 50g, banane 35g - 170g",
            "category": "Promoții",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10.49,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10.49,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10.49,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-cartofi-chilli-cheese",
            "name": "Cartofi chilli cheese",
            "description": "Cartofi prajiti 150g, carne kebab de pui 50g, sos cheddar 80g, sos crispy dulce 20g, rosii 20g, salata iceberg 15g, jalapenos 20g, nachos 20g- 365g",
            "category": "Promoții",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 28.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 28.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 28.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-de-pui-xxl",
            "name": "Meniu DAbo de pui XXL",
            "description": "DAbo de pui XXL 300g, Cartofi prajiti 150g, Bautura 500ml",
            "category": "Cele mai vândute",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 45.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 45.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 45.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-de-pui",
            "name": "Meniu DAbo de pui",
            "description": "DAbo de pui 230g, Cartofi prajiti 120g, Bautura 500ml",
            "category": "Cele mai vândute",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 40.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 40.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 40.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-crispy",
            "name": "Meniu Dabo crispy",
            "description": "DAbo crispy 250g, Cartofi prajiti 120g, Bautura 500ml",
            "category": "Cele mai vândute",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 41.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 41.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 41.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-durum-de-vită--curcan",
            "name": "Meniu Durum de vită & curcan",
            "description": "Durum de vită & curcan 300g, Cartofi prajiti 150g, Bautura 500ml",
            "category": "NOUTĂȚI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 55.85,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 55.85,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 55.85,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-durum-de-pui-românia",
            "name": "Meniu Durum de pui România",
            "description": "Durum de pui 300g, Cartofi prajiti 150g, Bautura 500ml",
            "category": "NOUTĂȚI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-durum-de-vită--curcan-românia",
            "name": "Durum de vită & curcan România",
            "description": "Lipie, carne kebab vită & curcan, sosuri, salată",
            "category": "NOUTĂȚI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 38.85,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 38.85,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 38.85,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-crispy-românia",
            "name": "DAbo crispy România",
            "description": "Chiflă, pui crispy, sosuri, salată",
            "category": "NOUTĂȚI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 35.2,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 35.2,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 35.2,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-durum-pui-românia",
            "name": "Durum pui România",
            "description": "Lipie, carne kebab pui, sosuri, salată",
            "category": "NOUTĂȚI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 33.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 33.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 33.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-mix-xxl",
            "name": "Meniu DAbo mix XXL",
            "description": "DAbo mix XXL, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-de-vită--curcan-xxl",
            "name": "Meniu DAbo de vită & curcan XXL",
            "description": "DAbo de vită & curcan XXL, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-chilly-cheese",
            "name": "Meniu DAbo chilly cheese",
            "description": "DAbo chilly cheese, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-mixt-dabo",
            "name": "Meniu MIXT DAbo",
            "description": "Sandwich MIXT, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-durum-crispy",
            "name": "Meniu Durum crispy",
            "description": "Durum crispy, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 52.2,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 52.2,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 52.2,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-durum-de-pui",
            "name": "Meniu Durum de pui",
            "description": "Durum de pui, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-box-pui",
            "name": "Meniu Box pui",
            "description": "Box pui, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 42.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 42.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 42.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-box-vită--curcan",
            "name": "Meniu Box vită & curcan",
            "description": "Box vită & curcan, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 47.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 47.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 47.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-mini-pui",
            "name": "Meniu DAbo mini pui",
            "description": "DAbo mini pui, Cartofi prajiti, Bautura",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 37.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 37.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 37.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-box-pui",
            "name": "DAbo box pui",
            "description": "Carne kebab pui, cartofi prajiti, sosuri",
            "category": "BOX-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 31.56,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 31.56,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 31.56,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-box-vită--curcan",
            "name": "DAbo box vită & curcan",
            "description": "Carne kebab vită & curcan, cartofi prajiti, sosuri",
            "category": "BOX-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 36.44,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 36.44,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 36.44,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-mix-la-farfurie",
            "name": "DAbo mix la farfurie",
            "description": "Carne mix, cartofi, salata, chifla, sosuri",
            "category": "LA FARFURIE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 47.35,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 47.35,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 47.35,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-șnițel-crispy-la-farfurie-cu-cartofi",
            "name": "Șnițel crispy la farfurie cu cartofi",
            "description": "Snitel crispy, cartofi, salata, chifla, sosuri",
            "category": "LA FARFURIE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 44.91,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 44.91,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 44.91,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-cripsy-fingers-la-farfurie",
            "name": "Cripsy fingers la farfurie",
            "description": "Crispy fingers, cartofi, salata, chifla, sosuri",
            "category": "LA FARFURIE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 44.91,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 44.91,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 44.91,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-pui-la-farfurie",
            "name": "DAbo de pui la farfurie",
            "description": "Carne pui, cartofi, salata, chifla, sosuri",
            "category": "LA FARFURIE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 43.7,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 43.7,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 43.7,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-pui-la-farfurie-mare",
            "name": "DAbo de pui la farfurie mare",
            "description": "Carne pui (portie mare), cartofi, salata, chifla, sosuri",
            "category": "LA FARFURIE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 51.56,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 51.56,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 51.56,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-vită--curcan-la-farfurie",
            "name": "DAbo vită & curcan la farfurie",
            "description": "Carne vită & curcan, cartofi, salata, chifla, sosuri",
            "category": "LA FARFURIE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 48.22,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 48.22,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 48.22,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-pui",
            "name": "DAbo de pui",
            "description": "Chiflă, carne kebab pui, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 28.15,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 28.15,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 28.15,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-vită--curcan",
            "name": "DAbo de vită & curcan",
            "description": "Chiflă, carne kebab vită & curcan, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 33.02,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 33.02,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 33.02,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-pui-xxl",
            "name": "DAbo de pui XXL",
            "description": "Chiflă XXL, carne kebab pui, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-vită--curcan-xxl",
            "name": "DAbo de vită & curcan XXL",
            "description": "Chiflă XXL, carne kebab vită & curcan, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 38.02,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 38.02,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 38.02,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-durum-de-pui",
            "name": "Durum de pui",
            "description": "Lipie, carne kebab pui, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 32.15,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 32.15,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 32.15,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-durum-de-vită--curcan",
            "name": "Durum de vită & curcan",
            "description": "Lipie, carne kebab vită & curcan, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 37.02,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 37.02,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 37.02,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-burger-de-pui",
            "name": "DAbo burger de pui",
            "description": "Chiflă burger, carne pui, cașcaval, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 34.27,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 34.27,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 34.27,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-crispy",
            "name": "DAbo crispy",
            "description": "Chiflă, pui crispy, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-durum-crispy",
            "name": "Durum crispy",
            "description": "Lipie, pui crispy, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 33.15,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-mini-pui",
            "name": "DAbo mini pui",
            "description": "Chiflă mică, carne pui, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 26.7,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 26.7,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 26.7,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-vegetarian",
            "name": "DAbo vegetarian",
            "description": "Chiflă, cașcaval, sosuri, salată, roșii",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 29.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 29.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 29.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-veggies-de-post",
            "name": "DAbo veggies de post",
            "description": "Chiflă de post, cartofi, salată, roșii, ketchup",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 27.13,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 27.13,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 27.13,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-cu-șuncă-și-cașcaval",
            "name": "DAbo cu șuncă și cașcaval",
            "description": "Chiflă, șuncă, cașcaval, sosuri, salată",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 21.41,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 21.41,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 21.41,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pide-cu-pui-și-cașcaval",
            "name": "Pide cu pui și cașcaval",
            "description": "Aluat pide, carne pui, cașcaval",
            "category": "PIDE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 32,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 32,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 32,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pide-cu-vită--curcan-și-cașcaval",
            "name": "Pide cu vită & curcan și cașcaval",
            "description": "Aluat pide, carne vită & curcan, cașcaval",
            "category": "PIDE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 35,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 35,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 35,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pide-cu-șuncă-și-cașcaval",
            "name": "Pide cu șuncă și cașcaval",
            "description": "Aluat pide, șuncă, cașcaval",
            "category": "PIDE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pide-vegetariană",
            "name": "Pide vegetariană",
            "description": "Aluat pide, cașcaval, legume",
            "category": "PIDE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 26,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 26,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 26,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-cartofi-prăjiți-(150g)",
            "name": "Cartofi prăjiți (150g)",
            "description": "Portie medie de cartofi",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-cartofi-prăjiți-xxl-(250g)",
            "name": "Cartofi prăjiți XXL (250g)",
            "description": "Portie mare de cartofi",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 15,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 15,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 15,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-chiflă-dabo",
            "name": "Chiflă DAbo",
            "description": "Chiflă proaspăt coaptă",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-carne-kebab-pui-extra-(100g)",
            "name": "Carne kebab pui extra (100g)",
            "description": "Portie suplimentară de carne pui",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 12,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 12,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 12,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-carne-kebab-vită-extra-(100g)",
            "name": "Carne kebab vită extra (100g)",
            "description": "Portie suplimentară de carne vită",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 15,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 15,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 15,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-gogoși-cu-nutella",
            "name": "Gogoși cu nutella",
            "description": "Aluat gogoși, nutella",
            "category": "DESERT",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 17.49,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 17.49,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 17.49,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-gogoși-cu-gem",
            "name": "Gogoși cu gem",
            "description": "Aluat gogoși, gem de fructe",
            "category": "DESERT",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 21.24,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 21.24,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 21.24,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-gogoși-cu-nutella-și-banane",
            "name": "Gogoși cu nutella și banane",
            "description": "Aluat gogoși, nutella, banane",
            "category": "DESERT",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 21.24,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 21.24,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 21.24,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-dulce-cu-banane",
            "name": "DAbo Dulce cu banane",
            "description": "Chiflă dulce, nutella, banane",
            "category": "DESERT",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 17.49,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 17.49,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 17.49,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-crispy-dulce",
            "name": "Sos crispy dulce",
            "description": "Sos special DAbo dulce",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-crispy-picant",
            "name": "Sos crispy picant",
            "description": "Sos special DAbo picant",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-de-usturoi",
            "name": "Sos de usturoi",
            "description": "Sos aromat cu usturoi",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-curry",
            "name": "Sos curry",
            "description": "Sos cu arome de curry",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-bbq",
            "name": "Sos BBQ",
            "description": "Sos barbecue fumuriu",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-maioneză",
            "name": "Maioneză",
            "description": "Sos de maioneză clasic",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-ketchup",
            "name": "Ketchup",
            "description": "Sos de roșii",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pepsi-cola,-500ml",
            "name": "Pepsi Cola, 500ML",
            "description": "Bautura racoritoare carbonatata",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pepsi-max,-500ml",
            "name": "Pepsi Max, 500ML",
            "description": "Bautura racoritoare carbonatata fara zahar",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-mirinda-portocale,-500ml",
            "name": "Mirinda Portocale, 500ML",
            "description": "Bautura racoritoare carbonatata cu gust de portocale",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-7up,-500ml",
            "name": "7UP, 500ML",
            "description": "Bautura racoritoare carbonatata cu gust de lamaie si lamaie verde",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-mountain-dew,-500ml",
            "name": "Mountain Dew, 500ML",
            "description": "Bautura racoritoare carbonatata",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-lipton-ice-tea-piersici,-500ml",
            "name": "Lipton Ice Tea Piersici, 500ML",
            "description": "Ceai rece cu gust de piersici",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-lipton-ice-tea-lamaie,-500ml",
            "name": "Lipton Ice Tea Lamaie, 500ML",
            "description": "Ceai rece cu gust de lamaie",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-apa-plata",
            "name": "Apa plata",
            "description": "Apa plata 500ml",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-apa-minerala",
            "name": "Apa minerala",
            "description": "Apa minerala carbonatata 500ml",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-iaurt",
            "name": "Sos iaurt",
            "description": "Sos fin cu iaurt și ierburi",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-chilli",
            "name": "Sos chilli",
            "description": "Sos foarte iute",
            "category": "SOSURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pepsi-twist,-500ml",
            "name": "Pepsi Twist, 500ML",
            "description": "Bautura racoritoare carbonatata cu gust de lamaie",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-apa-bucovina-plata,-500ml",
            "name": "Apa Bucovina plata, 500ML",
            "description": "Apa plata naturala",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-sos-iaurt-(portie-extra)",
            "name": "Sos iaurt (portie extra)",
            "description": "Supliment sos iaurt",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-jalapenos-extra",
            "name": "Jalapenos extra",
            "description": "Portie suplimentară de ardei iute jalapeno",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-nachos-extra",
            "name": "Nachos extra",
            "description": "Portie suplimentară de nachos crocanti",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 5,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-cheesburger-de-pui",
            "name": "DAbo cheesburger de pui",
            "description": "Chiflă 130g, carne hamburger pui 130g, cașcaval 40g, sos crispy dulce/picant 30g, salată iceberg 30g, castraveți murați 40g, optional ceapă 10g - 450g",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 30.35,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 30.35,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 30.35,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-vită--curcan-mini",
            "name": "DAbo de vită & curcan mini",
            "description": "Chiflă, carne kebab de vită&curcan, sos iaurt, salată iceberg, roşii, optional ceapă/chilli - 230g",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 30.35,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 30.35,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 30.35,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      }
    },
      {
            "id": "dabo-mixt-dabo",
            "name": "MIXT DAbo",
            "description": "Caşcaval pané 70g, carne kebab de pui 90g, sos special 40g, carne kebab de vită & curcan 70g, sos de iaurt 40g, salată creata 15 g, salata varza 150g, rosie 20g, cartofi prăjiţi 120g, chiflă 130g,optional ceapă 15g - 760g",
            "category": "Promoții",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-de-vită-și-curcan-xxl",
            "name": "Meniu DAbo de vită și curcan XXL",
            "description": "DAbo de vită și curcan 480g, cartofi prajiti 120g,băutură răcoritoare gama Pepsi 330ml/ayran 300g/apă 500ml",
            "category": "Promoții",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 58.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-cartofi-chilli-cheese",
            "name": "Cartofi chilli cheese",
            "description": "Cartofi prajiti 150g, carne kebab de pui 50g, sos cheddar 80g, sos crispy dulce 20g, rosii 20g, salata iceberg 15g, jalapenos 20g, nachos 20g- 365g",
            "category": "Cele mai vândute",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 28.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 28.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 28.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-de-pui-xxl",
            "name": "Meniu DAbo de pui XXL",
            "description": "DAbo de pui XXL 480g, cartofi prajiti 120g,băutura răcoritoare gama Pepsi 330ml/ayran 300g/apă 500ml",
            "category": "Cele mai vândute",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 45.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 45.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 45.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-durum-de-pui-românia",
            "name": "Meniu Durum de pui România",
            "description": "Durum de pui România 380g, cartofi prajiti 120g, băutură răcoritoare gama Pepsi 330ml/ayran 300g/apă 500ml",
            "category": "NOUTĂȚI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 50.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-meniu-dabo-crispy",
            "name": "Meniu Dabo crispy",
            "description": "DAbo crispy 350g, cartofi prajiti 120g, băutură răcoritoare gama Pepsi 330ml/ayran 300g/apă 500ml",
            "category": "MENIURI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 41.99,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 41.99,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 41.99,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-box-vită-&-curcan",
            "name": "DAbo box vită & curcan",
            "description": "Cartofi prăjiți 120g, carne kebab de vită & curcan 100g, sos de iaurt 40g - 260g",
            "category": "BOX-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 36.41,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 36.41,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 36.41,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-pui-la-farfurie-mare",
            "name": "DAbo de pui la farfurie mare",
            "description": "Carne kebab de pui 180g, cartofi prăjiţi 120g, sos special 40g, salată varză 150g, roşii 20g, optional ceapă 15g, chiflă 130g - 655g",
            "category": "LA FARFURIE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 51.56,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 51.56,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 51.56,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-dabo-de-vită-&-curcan-xxl",
            "name": "DABO de vită & curcan XXL",
            "description": "Chiflă 160 g, carne kebab de vită&curcan 140g, sos iaurt 70g, salată iceberg 40g, roşii 60g, ceapă 10g - 470g",
            "category": "SANDWICH-URI",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 41.28,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 41.28,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 41.28,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-cartofi-prăjiți",
            "name": "Cartofi prăjiți",
            "description": "120g",
            "category": "EXTRA",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 15.2,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 15.2,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 15.2,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      },
      {
            "id": "dabo-pepsi-cola,-500ml",
            "name": "Pepsi Cola, 500ML",
            "description": "Pepsi 500ml",
            "category": "BAUTURI RACORITOARE",
            "imageUrl": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
            "prices": [
                  {
                        "platform": "glovo",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/dabo-doner-cta"
                  },
                  {
                        "platform": "bolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/200293-dabo-doner-mircea-constanta/"
                  },
                  {
                        "platform": "wolt",
                        "available": true,
                        "price": 10,
                        "deepLink": "https://wolt.com/en/rou/constanta/restaurant/dabo-doner-mircea-constana-00a224"
                  }
            ]
      }
]
  },
  {
    id: "mcdonalds-constanta",
    name: "McDonald's",
    category: "Burger",
    city: "Constanța",
    address: "Bulevardul Tomis 391 (VIVO Mall), Constanța",
    rating: 4.6,
    reviewCount: 1200,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    platforms: [
      {
        platform: "glovo",
        available: true,
        deliveryFee: 5.99,
        serviceFeePercent: 0.05,
        serviceFeeMin: 2.0,
        serviceFeeMax: 5.0,
        smallOrderFee: 5.99,
        smallOrderThreshold: 45.0,
        dynamicSmallOrderFee: true,
        deliveryTime: 25,
        deepLink: "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
      },
      {
        platform: "bolt",
        available: true,
        deliveryFee: 6.99,
        serviceFee: 1.99,
        deliveryTime: 30,
        deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
      },
      {
        platform: "wolt",
        available: true,
        deliveryFee: 7.99,
        serviceFee: 2.49,
        deliveryTime: 20,
        deepLink: "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
      }
    ],
    menu: [
      {
              "id": "mcd-meniu-maxi-big-mac",
              "name": "Meniu Maxi Big Mac™",
              "description": "Big Mac™, porție mare cartofi prăjiți, băutură răcoritoare mare",
              "category": "Meniuri",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 32.9,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 32.9,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 32.9,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-meniu-maxi-mcchicken",
              "name": "Meniu Maxi McChicken™",
              "description": "McChicken™, porție mare cartofi prăjiți, băutură răcoritoare mare",
              "category": "Meniuri",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 31.9,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 31.9,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 31.9,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-meniu-maxi-big-tasty",
              "name": "Meniu Maxi Big Tasty™",
              "description": "Big Tasty™, porție mare cartofi prăjiți, băutură răcoritoare mare",
              "category": "Meniuri",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 39.9,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 39.9,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 39.9,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-grande-home-menu",
              "name": "GRANDE HOME MENU",
              "description": "3 burgeri mari la alegere, 3 porții mari cartofi, 9 McNuggets cu 2 sosuri și 3 plăcinte cu vișine",
              "category": "Meniuri de familie",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 109.9,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 109.9,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 109.9,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-home-menu",
              "name": "HOME MENU",
              "description": "2 burgeri la alegere, 2 porții mari cartofi, 6 McNuggets (1 sos inclus) și 2 plăcinte cu vișine",
              "category": "Meniuri de familie",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79.9,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79.9,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79.9,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-meniu-mcnuggets-friends",
              "name": "MENIU MCNUGGETS FRIENDS",
              "description": "9 McNuggets, 2 sosuri incluse, o porție mare de cartofi, băutură răcoritoare și o jucărie",
              "category": "Meniuri",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47.9,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47.9,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47.9,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-meniu-cheesy-jalapeno-bacon-quarter-pounder-mare",
              "name": "MENIU CHEESY JALAPENO BACON QUARTER POUNDER MARE",
              "description": "Cheesy Jalapeno Bacon Quarter Pounder, porție mare cartofi prăjiți, băutură răcoritoare mare",
              "category": "Meniuri",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-meniu-big-mac-friends",
              "name": "MENIU BIG MAC FRIENDS",
              "description": "Big Mac™, porție mare cartofi prăjiți, băutură răcoritoare mare și o jucărie",
              "category": "Meniuri",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 39.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 39.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 39.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-meniu-mcchicken-bacon-bbq-mare",
              "name": "MENIU McCHICKEN BACON BBQ MARE",
              "description": "McChicken™ Bacon BBQ, porție mare cartofi prăjiți, băutură răcoritoare mare",
              "category": "Meniuri",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 36.2,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 36.2,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 36.2,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      },
      {
              "id": "mcd-cheesy-jalapeno-bacon-quarter-pounder",
              "name": "CHEESY JALAPENO BACON QUARTER POUNDER 180G",
              "description": "Burgeri cu vită, brânză Cheddar, bacon și jalapeno",
              "category": "Burger",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 28.8,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/mcdonald-s-cta"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 28.8,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/99435-mcdonalds-vivo-mall/"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 28.8,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/mcdonalds-tomis-67ed2703c86a467a0cecf401"
                      }
              ]
      }
    ]
  },
  {
    id: "kfc-buc-1",
    name: "KFC City Park",
    category: "Fast Food",
    city: "Constanța",
    address: "Bulevardul Alexandru Lăpușneanu 116C",
    rating: 4.4,
    reviewCount: 500,
    imageUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 7.99, serviceFee: 2.5, deliveryTime: 25, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
      { platform: "bolt", available: true, deliveryFee: 5.99, serviceFee: 1.99, deliveryTime: 30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
      { platform: "wolt", available: true, deliveryFee: 9.99, serviceFee: 0, deliveryTime: 20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
    ],
    menu: [
      {
        id: "kfc-meniu-5-crispy",
        name: "Meniu 5 Crispy Strips® Picanti",
        description: "5 Crispy Strips® 150g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L, 1 sos la alegere 54g/25g",
        category: "Cele mai vândute",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 54.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 54.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-8-crispy",
        name: "Meniu 8 Crispy Strips®",
        description: "8 Crispy Strips® 240g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L, 1 sos la alegere 54g/25g",
        category: "Cele mai vândute",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 64.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 64.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 64.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-so-good-bucket",
        name: "So Good Bucket",
        description: "10 Fillet Bites® 170g, 10 Hot Wings® 250g, 2 porții medii de cartofi prăjiți 2x90g",
        category: "Cele mai vândute",
        imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 76.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 76.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 76.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-bucket-for-two",
        name: "Bucket for Two",
        description: "6 Hot Wings® 150g, 4 Crispy Strips® 120g, 4 Fillet Bites® 70g, 2 porții mari de cartofi prăjiți 2x120g, 2 băuturi 2x0,5L",
        category: "NOUTĂȚI",
        imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 74.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 74.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 74.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-box-for-one",
        name: "Box for one",
        description: "3 Crispy Strips® 90g, 4 Hot Wings® 100g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "NOUTĂȚI",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 51.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 51.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 51.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-hot-booster-box",
        name: "Hot Booster Box",
        description: "2 boosteri picanți 2x110g + 3 Crispy Strips®(90g), 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "NOUTĂȚI",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 51.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 51.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 51.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-booster-box",
        name: "Booster Box",
        description: "2 boosteri nepicanți 2x110g + 3 Crispy Strips®(90g), 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "NOUTĂȚI",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 51.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 51.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 51.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-muffin-nutella",
        name: "Muffin Nutella",
        description: "Brioșă cu cremă Nutella 85g",
        category: "NOUTĂȚI",
        imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 13.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 13.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sharing-box",
        name: "Sharing Box",
        description: "8 Crispy Strips® / 8 Strips Nepicanți 240g, 2x Dublu Booster/Dublu Hot Booster, 2 porții de cartofi prăjiți, 2 sosuri",
        category: "PROMOȚII",
        imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 96.30, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 96.30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 96.30, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-crispy-box",
        name: "Crispy Box",
        description: "5 Crispy Strips® / Strips Nepicanți 150g, Dublu Booster/Dublu Hot Booster, 1 porție de cartofi prăjiți, 1 băutură",
        category: "PROMOȚII",
        imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 68.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 68.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 68.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-mozzarella-hearts",
        name: "Mozzarella Hearts",
        description: "4 inimioare crocante cu mozzarella",
        category: "NOUTĂȚI",
        imageUrl: "https://images.unsplash.com/photo-1528796940112-4979b4a98424?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 12.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 12.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-bacon-twister-picant",
        name: "Meniu Bacon Twister® Picant",
        description: "Bacon Twister® Picant 200g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 45.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 45.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 45.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-bacon-twister-nepicant",
        name: "Meniu Bacon Twister® Nepicant",
        description: "Bacon Twister® Nepicant 200g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 45.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 45.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 45.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-meltz-picant",
        name: "Meniu Meltz Picant",
        description: "Meltz Picant 190g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 44.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 44.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 44.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-meltz-nepicant",
        name: "Meniu Meltz Nepicant",
        description: "Meltz Nepicant 190g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 44.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 44.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 44.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-real-burger-picant",
        name: "Meniu Real Burger Picant",
        description: "Real Burger 210g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 43.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 43.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 43.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-real-burger-nepicant",
        name: "Meniu Real Burger Nepicant",
        description: "Real Burger nepicant 210g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 43.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 43.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 43.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-twister-picant",
        name: "Meniu Twister® Picant",
        description: "Twister® Picant 180g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 42.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 42.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 42.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-twister-nepicant",
        name: "Meniu Twister® Nepicant",
        description: "Twister® Nepicant 180g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 42.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 42.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 42.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-dublu-crispy-burger",
        name: "Meniu Dublu Crispy Burger",
        description: "Dublu Crispy Burger 150g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-dublu-hot-booster",
        name: "Meniu Dublu Hot Booster",
        description: "Dublu Hot Booster 165g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-dublu-crispy-burger-nepicant",
        name: "Meniu Dublu Crispy Burger Nepicant",
        description: "Dublu Burger cu Strips Nepicanți 150g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-dublu-booster",
        name: "Meniu Dublu Booster",
        description: "Dublu Booster 165g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-zinger-burger",
        name: "Meniu Zinger® Burger",
        description: "Zinger® Burger 150g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-fillet-burger",
        name: "Meniu Fillet® Burger",
        description: "Fillet® Burger 150g, 1 porție mare de cartofi prăjiți 120g, 1 băutură răcoritoare 0,5L",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-bacon-twister-picant",
        name: "Bacon Twister® Picant",
        description: "2 Crispy Strips®, salată iceberg, roșii, bacon, brânză Cheddar, sos burger - 200g",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 27.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 27.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-bacon-twister-nepicant",
        name: "Bacon Twister® Nepicant",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 27.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 27.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meltz-nepicant",
        name: "Meltz Nepicant",
        description: "",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 27.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 27.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meltz-picant",
        name: "Meltz Picant",
        description: "",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 27.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 27.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-real-burger-picant",
        name: "Real Burger Picant",
        description: "",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 26.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 26.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 26.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-real-burger-nepicant",
        name: "Real Burger Nepicant",
        description: "",
        category: "MENIURI CU BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 26.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 26.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 26.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-twister-nepicant",
        name: "Twister® Nepicant",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 24.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 24.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 24.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-classic-twister-picant",
        name: "Classic Twister® Picant",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 24.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 24.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 24.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-dublu-crispy-burger",
        name: "Dublu Crispy Burger",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-dublu-hot-booster",
        name: "Dublu Hot Booster",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-dublu-crispy-burger-nepicant",
        name: "Dublu Crispy Burger Nepicant",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-dublu-booster",
        name: "Dublu Booster",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-fillet-burger",
        name: "Fillet® Burger",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 19.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 19.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-zinger-burger",
        name: "Zinger® Burger",
        description: "",
        category: "BURGERS & WRAPS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 19.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 19.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-giant-bucket",
        name: "Giant Bucket",
        description: "",
        category: "BUCKETS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 127.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 127.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 127.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-variety-bucket",
        name: "Variety Bucket",
        description: "",
        category: "BUCKETS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 84.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 84.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 84.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-american-bucket",
        name: "American Bucket",
        description: "",
        category: "BUCKETS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 83.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 83.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 83.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-so-good-bucket",
        name: "So Good Bucket",
        description: "",
        category: "BUCKETS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 76.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 76.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 76.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-non-spicy-bucket",
        name: "Non Spicy Bucket",
        description: "",
        category: "BUCKETS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 73.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 73.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 73.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-hot-bucket",
        name: "Hot Bucket",
        description: "",
        category: "BUCKETS",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 65.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 65.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 65.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-box-cu-twister-picant",
        name: "Box cu Twister® Picant",
        description: "",
        category: "BOXES",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 54.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 54.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-box-cu-twister-nepicant",
        name: "Box cu Twister® Nepicant",
        description: "",
        category: "BOXES",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 54.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 54.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-real-burger-box",
        name: "Real Burger Box",
        description: "",
        category: "BOXES",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 53.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 53.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 53.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-8-crispy-strips",
        name: "Meniu 8 Crispy Strips®",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 64.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 64.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 64.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-8-strips-nepicanti",
        name: "Meniu 8 Strips Nepicanți",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 64.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 64.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 64.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-5-crispy-strips-picanti",
        name: "Meniu 5 Crispy Strips® Picanti",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 54.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 54.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-5-strips-nepicanti",
        name: "Meniu 5 Strips Nepicanți",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 54.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 54.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-m-8hotwings",
        name: "M.8HotWings",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 53.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 53.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 53.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-9-fillet-bites",
        name: "Meniu 9 Fillet Bites®",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 53.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 53.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 53.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-5-hot-wings",
        name: "Meniu 5 Hot Wings®",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 46.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 46.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 46.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-6-fillet-bites",
        name: "Meniu 6 Fillet Bites®",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 46.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 46.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 46.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-kentucky",
        name: "Meniu Kentucky®",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 40.30, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 40.30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 40.30, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-pentru-copii-cu-fillet-bites",
        name: "Meniu pentru copii cu Fillet Bites®",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 26.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 26.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 26.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-meniu-pentru-copii-cu-booster-junior",
        name: "Meniu pentru copii cu Booster Junior",
        description: "",
        category: "MENIURI PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 26.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 26.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 26.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-8-crispy-strips",
        name: "8 Crispy Strips®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 46.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 46.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 46.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-8-strips-nepicanti",
        name: "8 Strips Nepicanți",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 46.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 46.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 46.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-5-crispy-strips",
        name: "5 Crispy Strips",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-5-strips-nepicanti",
        name: "5 Strips Nepicanți",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 37.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 37.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 37.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-8-hot-wings",
        name: "8 Hot Wings®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 35.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 35.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 35.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-9-fillet-bites",
        name: "9 Fillet Bites®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 35.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 35.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 35.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-3-buc-pui-kentucky",
        name: "3 buc. pui Kentucky®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 30.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 30.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 30.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-5-hot-wings",
        name: "5 Hot Wings",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 28.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 28.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 28.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-6-fillet-bites",
        name: "6 Fillet Bites®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 28.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 28.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 28.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-2-buc-pui-kentucky",
        name: "2 buc. pui Kentucky®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 22.40, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 22.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 22.40, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-3-crispy-strips",
        name: "3 Crispy Strips®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-3-strips-nepicanti",
        name: "3 Strips Nepicanți",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-3-hot-wings",
        name: "3 Hot Wings®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 18.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 18.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 18.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-1-bucata-pui-kentucky",
        name: "1 bucată pui Kentucky®",
        description: "",
        category: "PUI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 14.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 14.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 14.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-greek-salad",
        name: "Greek Salad",
        description: "",
        category: "SALATE",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 28.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 28.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 28.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-salata-cu-fillet-bites",
        name: "Salată cu Fillet Bites®",
        description: "",
        category: "SALATE",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 28.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 28.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 28.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-cartofi-prajiti-portie-mare",
        name: "Cartofi prăjiți porție mare",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-chili-cheese-nuggets",
        name: "Chili Cheese Nuggets",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 12.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 12.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-gouda-cheese-pillows",
        name: "Gouda Cheese Pillows",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 12.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 12.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-cheddar-bites",
        name: "Cheddar Bites",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 12.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 12.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-cartofi-prajiti-portie-medie",
        name: "Cartofi prăjiți porție medie",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.70, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 11.70, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 11.70, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-cartofi-prajiti-portie-mica",
        name: "Cartofi prăjiți porție mică",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-mini-porumb",
        name: "Mini-porumb",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 6.20, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 6.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 6.20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-chifla-imperiala",
        name: "Chiflă imperiala",
        description: "",
        category: "GARNITURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 4.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 4.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 4.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-ketchup",
        name: "Sos Ketchup",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.60, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.60, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-glen",
        name: "Sos Glen",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.60, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.60, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-rosii-si-usturoi",
        name: "Sos Roșii și usturoi",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.60, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.60, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-sweet-sour-heinz",
        name: "Sos Sweet & Sour Heinz",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-curry-mango",
        name: "Sos Curry Mango",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-maioneza-heinz",
        name: "Sos Maioneză Heinz",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-barbeque-heinz",
        name: "Sos Barbeque Heinz",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-honey-mustard-heinz",
        name: "Sos Honey Mustard Heinz",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sos-chilli-heinz",
        name: "Sos Chilli Heinz",
        description: "",
        category: "SOSURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-trio-mousse-ciocolata",
        name: "Trio Mousse Ciocolată (100g)",
        description: "",
        category: "DESERTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-mousse-mascarpone-capsuni",
        name: "Mousse Mascarpone și Căpșuni (100g)",
        description: "",
        category: "DESERTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 20.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 20.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-tarta-cu-ciocolata",
        name: "Tartă cu ciocolată",
        description: "",
        category: "DESERTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 15.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 15.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 15.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-placinta-cu-visine",
        name: "Plăcintă cu Vișine",
        description: "",
        category: "DESERTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 10.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 10.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-schweppes-bitter-lemon",
        name: "Schweppes Bitter Lemon 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 14.30, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 14.30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 14.30, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-fuzetea-lamaie",
        name: "FUZETEA Lămâie și Lemongrass 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 14.30, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 14.30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 14.30, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-fuzetea-piersica",
        name: "FUZETEA Piersică și Hibiscus 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 14.30, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 14.30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 14.30, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-coca-cola-05",
        name: "Coca-Cola 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.80, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 13.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 13.80, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-fanta-05",
        name: "Fanta 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.80, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 13.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 13.80, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-coca-cola-zero-05",
        name: "Cola-Cola Zero 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.80, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 13.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 13.80, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sprite-05",
        name: "Sprite 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.80, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 13.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 13.80, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-apa-plata-izvorul-alb",
        name: "Apă plată Izvorul Alb 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 12.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 12.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-apa-minerala-dorna",
        name: "Apă minerală Dorna 0,5L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 12.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 12.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-fanta-033",
        name: "Fanta 0,33L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 10.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 10.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-coca-cola-033",
        name: "Coca-Cola 0,33L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 10.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 10.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-sprite-033",
        name: "Sprite 0,33L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 10.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 10.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-coca-cola-zero-033",
        name: "Cola-Cola Zero 0,33L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.00, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 10.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 10.00, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-cappy-pulpy-piersici",
        name: "Cappy Pulpy Piersici 0,33L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 9.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 9.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      },
      {
        id: "kfc-cappy-pulpy-portocale",
        name: "Cappy Pulpy Portocale 0,33L",
        description: "",
        category: "BĂUTURI",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.50, deepLink: "https://glovoapp.com/ro/ro/constanta/stores/kfc-cta" },
          { platform: "bolt", available: true, price: 9.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
          { platform: "wolt", available: true, price: 9.50, deepLink: "https://wolt.com/en/rou/constanta/restaurant/kfc-city-park-67ee912b0231e21086424409" },
        ],
      }
    ]
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
      { platform: "bolt", available: true, deliveryFee: 6.49, serviceFee: 1.99, deliveryTime: 35, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
      { platform: "bolt", available: true, deliveryFee: 7.53, serviceFee: 3.03, smallOrderFee: 7.10, smallOrderThreshold: 40, deliveryTime: 30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 32.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 31.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 48.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 36.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 32.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 40.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 54.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 36.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 36.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 42.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 109.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 79.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 47.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 39.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 28.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 13.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 33.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 30.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 30.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 27.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 24.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 23.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 18.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 11.70, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 27.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 10.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
      { platform: "bolt", available: true, deliveryFee: 7.99, serviceFee: 1.99, deliveryTime: 40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
      { platform: "bolt", available: true, deliveryFee: 4.99, serviceFee: 1.5, deliveryTime: 32, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
      { platform: "bolt", available: false, deliveryFee: 0, serviceFee: 0, deliveryTime: 0, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/" },
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
  // ===== MCDONALD'S CONSTANTA =====
  {
    id: "mcdonalds-constanta",
    name: "McDonald's",
    category: "Fast Food",
    city: "Constanța",
    address: "Bulevardul Tomis 47",
    rating: 4.6,
    reviewCount: 300,
    imageUrl: "https://images.unsplash.com/photo-1552895638-f7fe08d2f7d5?w=400&q=80",
    platforms: [
      { platform: "glovo", available: true, deliveryFee: 5.99, serviceFee: 2.5, deliveryTime: 25, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
      { platform: "bolt", available: true, deliveryFee: 4.99, serviceFee: 1.99, deliveryTime: 30, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
      { platform: "wolt", available: true, deliveryFee: 8.99, serviceFee: 0, deliveryTime: 20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
    ],
    menu: [
      {
        id: "mc-maxi-big-mac",
        name: "Meniu Maxi Big Mac™",
        description: "Meniu Maxi Big Mac. Conține cartofi și băutură mare.",
        category: "Cele mai vândute",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 32.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-maxi-mcchicken",
        name: "Meniu Maxi McChicken™",
        description: "Meniu Maxi McChicken. Conține cartofi și băutură mare.",
        category: "Cele mai vândute",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 31.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 31.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 31.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-maxi-big-tasty",
        name: "Meniu Maxi Big Tasty™",
        description: "Meniu Maxi Big Tasty. Conține cartofi și băutură mare.",
        category: "Cele mai vândute",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 39.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-grande-home-menu",
        name: "GRANDE HOME MENU",
        description: "Ideal pentru grupuri, cu 3 burgeri mari la alegere, porții mari de cartofi, McNuggets etc.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 109.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 109.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 109.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-home-menu",
        name: "HOME MENU",
        description: "Ai 2 burgeri la alegere, Big Mac și McChicken, porții de cartofi, McNuggets.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 79.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 79.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 79.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-mcnuggets-friends",
        name: "MENIU MCNUGGETS FRIENDS",
        description: "Meniul conține Chicken McNuggets 9 buc, două sosuri, cartofi mari, băutură.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 47.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 47.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 47.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cheesy-jalapeno-bacon-quarter-pounder-mare",
        name: "MENIU CHEESY JALAPENO BACON QUARTER POUNDER MARE",
        description: "Meniu mare.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 42.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 42.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 42.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-big-mac-friends",
        name: "MENIU BIG MAC FRIENDS",
        description: "Meniu Big Mac Friends.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 39.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-mcchicken-bacon-bbq-mare",
        name: "MENIU McCHICKEN BACON BBQ MARE",
        description: "Meniu mare McChicken Bacon BBQ.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 36.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cheesy-jalapeno-bacon-quarter-pounder",
        name: "CHEESY JALAPENO BACON QUARTER POUNDER 180G",
        description: "Burger Cheesy Jalapeno.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 28.80, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 28.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 28.80, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcchicken-bacon-bbq",
        name: "McCHICKEN BACON BBQ 180G",
        description: "Burger McChicken Bacon BBQ.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 22.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 22.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mozza-snacks",
        name: "MOZZA SNACKS 72G",
        description: "Mozza Snacks 72g.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1528796940112-4979b4a98424?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 13.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-placinta-capsune",
        name: "PLACINTA CU CAPSUNE SI CREMA CU IAURT 70G",
        description: "Plăcintă cu căpșune și cremă cu iaurt.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.10, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.10, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-chili-cheese-vita",
        name: "CHILI CHEESE VITA 110G",
        description: "Burger Chili Cheese Vită.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-chili-cheese-pui",
        name: "CHILI CHEESE PUI 120G",
        description: "Burger Chili Cheese Pui.",
        category: "Ediție limitată și Noutăți",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-aripioare-9-bucati-mare",
        name: "MENIU ARIPIOARE DE PUI 9 BUCATI MARE",
        description: "Meniu mare cu 9 aripioare picante.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 54.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 54.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 54.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-aripioare-7-bucati-maxi",
        name: "Meniu Maxi Aripioare de pui (7 buc.)",
        description: "Meniu Maxi cu 7 aripioare picante.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 48.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 48.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 48.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-mcnuggets-9-mare",
        name: "MENIU MARE CHICKEN MCNUGGETS 9 BUCATI",
        description: "Meniu mare McNuggets.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 40.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 40.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 40.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-aripioare-5-bucati-mare",
        name: "MENIU ARIPIOARE DE PUI 5 BUCATI MARE",
        description: "Meniu mare cu 5 aripioare picante.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 39.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 39.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 39.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-mccrispy-fresh-mare",
        name: "MENIU MCCRISPY FRESH MARE",
        description: "Meniu mare McCrispy Fresh.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 38.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 38.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-mccrispy-mare",
        name: "MENIU MCCRISPY MARE",
        description: "Meniu mare McCrispy.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 38.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 38.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 38.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-fresh-deluxe-mare",
        name: "MENIU FRESH DELUXE MARE",
        description: "Meniu mare Fresh Deluxe.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 36.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-mcnuggets-6-maxi",
        name: "Meniu Maxi Chicken McNuggets™ (6 buc.)",
        description: "Meniu Maxi McNuggets 6 buc.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.80, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 36.80, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-quarter-pounder-mare",
        name: "MENIU QUARTER POUNDER WITH CHEESE MARE",
        description: "Meniu mare Quarter Pounder.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 36.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-dublu-cheeseburger-maxi",
        name: "Meniu Maxi Dublu Cheeseburger",
        description: "Meniu Maxi Dublu Cheeseburger.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 32.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-meniu-filet-o-fish-maxi",
        name: "Meniu Maxi Filet-O-Fish™",
        description: "Meniu Maxi Filet-O-Fish.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 32.80, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 32.80, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 32.80, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-happy-meal-hamburger",
        name: "Happy Meal™ Hamburger",
        description: "Meniu copii Happy Meal cu Hamburger.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 19.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-happy-meal-mcpuisor",
        name: "Happy Meal™ McPuisor",
        description: "Meniu copii Happy Meal cu McPuisor.",
        category: "Burgeri și pui",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 19.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-aripioare-9-bucati",
        name: "ARIPIOARE DE PUI 9 BUC PRODUS PICANT 300G",
        description: "9 aripioare picante.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 36.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 36.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 36.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcnuggets-9-bucati",
        name: "9 CHICKEN MCNUGGETS BUCATI DE PUI, 2 SOSURI 161G",
        description: "9 McNuggets cu 2 sosuri.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 33.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 33.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 33.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-aripioare-7-bucati",
        name: "ARIPIOARE PICANTE 7 BUCATI 235G",
        description: "7 aripioare picante.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 30.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 30.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 30.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-big-tasty-burger",
        name: "BIG TASTY BURGER VITA, BRANZA, LEGUME, SOS 321G",
        description: "Burger Big Tasty.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 30.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 30.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 30.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mccrispy-fresh",
        name: "MCCRISPY FRESH 210G PUI, SOS, ROSIE, SALATA",
        description: "Sandviș McCrispy Fresh.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 29.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 29.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mccrispy-sendvis-mcbacon",
        name: "MCCRISPY SENDVIS PUI, CHEDDAR, MURATURI, SOS MCBACON 185GR",
        description: "Sandviș McCrispy cu Cheddar și McBacon.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 29.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 29.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 29.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-aripioare-5-bucati",
        name: "ARIPIOARE DE PUI 5 BUC PRODUS PICANT 180G",
        description: "5 aripioare picante.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 27.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 27.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcnuggets-6-bucati",
        name: "6 CHICKEN MCNUGGETS BUCATI DE PUI, 1 SOS 107G",
        description: "6 McNuggets cu un sos.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 24.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 24.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 24.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-quarter-pounder",
        name: "QUARTER POUNDER WITH CHEESE BURGER VITA 200G",
        description: "Burger Quarter Pounder.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 23.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 23.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 23.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-fresh-deluxe",
        name: "FRESH DELUXE BURGER DE VITA CU LEGUME 239G",
        description: "Burger Fresh Deluxe.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 22.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 22.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 22.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-big-mac",
        name: "BIG MAC BURGER VITA, CASTRAVETI MURATI, SOS 204G",
        description: "Burger Big Mac.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 21.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 21.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcchicken",
        name: "MCCHICKEN BURGER CARNE PUI, SALATA, SOS 181G",
        description: "Burger McChicken.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 21.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 21.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 21.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-dublu-cheeseburger",
        name: "DUBLU CHEESEBURGER 165G",
        description: "Dublu Cheeseburger.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 18.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 18.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 18.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-filet-o-fish",
        name: "FILET O FISH SENDVIS CU PESTE, BRANZA, SOS 136G",
        description: "Sandviș Filet-O-Fish.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 17.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-aripioare-3-bucati",
        name: "ARIPIOARE DE PUI 3 BUC PRODUS PICANT 100G",
        description: "3 aripioare picante.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 17.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cheeseburger",
        name: "CHEESEBURGER 113G",
        description: "Cheeseburger clasic.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-hamburger",
        name: "HAMBURGER 100G",
        description: "Hamburger clasic.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mctoast",
        name: "MCTOAST SENDVIS CU BRANZA SI SUNCA 94G",
        description: "McToast cu brânză și șuncă.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcpuisor",
        name: "MCPUISOR BURGER CARNE PUI, CASTRAVETI MURATI 109G",
        description: "Burger McPuișor.",
        category: "Sandvișuri",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41609ea004bc?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cartofi-mari",
        name: "CARTOFI PRAJITI PORTIE MARE 150G",
        description: "Cartofi prăjiți porție mare.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496597-1a3634cb4e8b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cartofi-criss-cut",
        name: "CARTOFI CRISS CUT 135G",
        description: "Cartofi Criss Cut.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496597-1a3634cb4e8b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cartofi-medii",
        name: "CARTOFI PRAJITI PORTIE MEDIE 114G",
        description: "Cartofi prăjiți porție medie.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496597-1a3634cb4e8b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.70, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.70, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 11.70, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cartofi-mici",
        name: "CARTOFI PRAJITI PORTIE MICA 80G",
        description: "Cartofi prăjiți porție mică.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1573080496597-1a3634cb4e8b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sos-vinaigrette",
        name: "SOS VINAIGRETTE CU ULEI SI OTET 50 ML",
        description: "Sos vinaigrette.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sos-iaurt",
        name: "SOS IAURT 50 ML",
        description: "Sos iaurt.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sos-usturoi",
        name: "SOS USTUROI 25ML",
        description: "Sos usturoi.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sos-smantana",
        name: "SOS SMANTANA",
        description: "Sos smântână.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sos-dulce-acrisor",
        name: "SOS DULCE ACRISOR 25ML",
        description: "Sos dulce-acrișor.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ketchup",
        name: "KETCHUP 10ML",
        description: "Ketchup.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-maioneza",
        name: "MAIONEZA 20ML",
        description: "Maioneză.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-hot-hot-devil",
        name: "HOT HOT DEVIL SOS PICANT 25ML",
        description: "Sos picant Hot Hot Devil.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sos-barbeque",
        name: "SOS BARBEQUE 25ML",
        description: "Sos Barbeque.",
        category: "Cartofi și sosuri",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-happy-meal-cheeseburger",
        name: "Happy Meal™ Cheeseburger",
        description: "Meniu copii Happy Meal cu Cheeseburger.",
        category: "Happy Meal™",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 19.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-happy-meal-mcnuggets-4",
        name: "Happy Meal™ McNuggets 4",
        description: "Meniu copii Happy Meal cu 4 McNuggets.",
        category: "Happy Meal™",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 19.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-happy-meal-mctoast",
        name: "Happy Meal™ McToast",
        description: "Meniu copii Happy Meal cu McToast.",
        category: "Happy Meal™",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 19.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-felii-mar",
        name: "FELII DE MAR 80G",
        description: "Felii de măr proaspăt.",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-salatzikos-pui",
        name: "SALATZIKOS CU PUI: SALATA CU PUI CROCANT 250G+1SOS",
        description: "Salată cu pui crocant.",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 27.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 27.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 27.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-salata-coleslaw",
        name: "SALATA COLESLAW CU MIX LEGUME, SOS CREMOS CU LAMAIE 200G",
        description: "Salată Coleslaw cu sos cremos.",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sos-1000-island",
        name: "SOS 1000 ISLAND DRESSING 50 ML",
        description: "Dressing 1000 Island pentru salată.",
        category: "Salate",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-placinta-capsune",
        name: "PLACINTA CU CAPSUNE SI CREMA CU IAURT 70G",
        description: "Plăcintă cu căpșune și cremă de iaurt.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.10, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.10, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.10, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-placinta-visine",
        name: "PLACINTA CU VISINE 70G",
        description: "Plăcintă cu vișine.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 10.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 10.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-shake-ciocolata",
        name: "SHAKE CU AROMA CIOCOLATA 250 ML",
        description: "Shake delicios cu ciocolată.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-shake-vanilie",
        name: "SHAKE CU AROMA VANILIE 250 ML",
        description: "Shake fin cu vanilie.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-shake-capsune",
        name: "SHAKE CU AROMA CAPSUNE 250 ML",
        description: "Shake cu gust de căpșune.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ciocolata-calda",
        name: "Ciocolată caldă cu lapte și frișcă,300 ml",
        description: "Ciocolată caldă cu frișcă.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 20.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 20.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-frappe-migdale",
        name: "FRAPPE AROMA MIGDALE 300ML",
        description: "Frappe delicios cu aromă de migdale.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 20.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 20.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 20.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-iced-latte-migdale",
        name: "ICED LATTE AROMA MIGDALE 300ML",
        description: "Iced Latte cu aromă de migdale.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 19.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 19.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 19.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-fresh-portocale",
        name: "FRESH PORTOCALE 300ML",
        description: "Fresh din portocale proaspete.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 18.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 18.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 18.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-fresh-grapefruit",
        name: "FRESH GRAPEFRUIT 300ML",
        description: "Fresh din grapefruit proaspăt.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1595981267035-7b04d84b4f10?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 18.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 18.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 18.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-latte-migdale",
        name: "LATTE AROMA MIGDALE 300ML",
        description: "Latte cremos cu aromă de migdale.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 18.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 18.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 18.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-blueberry-cheesecake",
        name: "BLUEBERRY CHEESECAKE TARTA CU AFINE, BRANZA 120G",
        description: "Cheesecake cu afine.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 17.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-carrot-cake",
        name: "CARROT CAKE: PRAJITURA CU MORCOVI 153G",
        description: "Prăjitură cu morcovi.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 17.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-briosa-ciocolata",
        name: "Brioșă cu bucăți de ciocolată albă și neagră, 120 g",
        description: "Brioșă cu ciocolată.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 17.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-briosa-caramel",
        name: "Brioșă cu aromă de caramel și nuci, 120 g",
        description: "Brioșă cu caramel și nuci.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.20, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.20, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 17.20, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mocha-frappe",
        name: "MOCHA FRAPPÉ TALL 300ML",
        description: "Mocha Frappé.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 17.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 17.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 17.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-caramel-macchiato",
        name: "CARAMEL MACCHIATO TALL 300ML",
        description: "Caramel Macchiato.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-vanilla-latte",
        name: "VANILLA LATTE TALL 300ML",
        description: "Vanilla Latte.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-caffe-frappe",
        name: "CAFFÉ FRAPPÉ TALL 300ML",
        description: "Caffé Frappé.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cocoa-frappe",
        name: "COCOA FRAPPÉ TALL 300ML",
        description: "Cocoa Frappé.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-caramel-caffe-frappe",
        name: "Caramel Caffé Frappé Tall",
        description: "Caramel Caffé Frappé.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-caramel-macchiato",
        name: "DECAF CARAMEL MACCHIATO TALL 320ML",
        description: "Decaf Caramel Macchiato.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-vanilla-latte",
        name: "DECAF VANILLA LATTE TALL 300ML",
        description: "Decaf Vanilla Latte.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cocoa-cherry-cake",
        name: "COCOA & CHERRY CAKE: PRAJITURA CU CACAO, CIRESE 153G",
        description: "Prăjitură cu cacao și cireșe.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-strawberry-cake",
        name: "STRAWBERRY CAKE: PRAJITURA CU CAPSUNE 146G",
        description: "Prăjitură cu căpșune.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 16.40, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 16.40, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 16.40, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cafea-rece-lapte",
        name: "Cafea rece cu lapte",
        description: "Cafea rece cu lapte.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 14.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 14.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 14.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-latte-macchiato",
        name: "DECAF LATTE MACCHIATO TALL 320ML",
        description: "Decaf Latte Macchiato.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 14.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 14.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 14.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-profiterol-alb",
        name: "PROFITEROL ALB 90G",
        description: "Profiterol alb.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 14.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 14.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 14.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-banana-bread",
        name: "BANANA BREAD PRAJITURA CU BANANE SI ALUNE 65G",
        description: "Banana bread.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1589255675860-2e06180173e6?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 13.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-limonada",
        name: "LIMONADA 400ML",
        description: "Limonadă proaspătă.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 13.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 13.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 13.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cappuccino-regular",
        name: "CAPPUCCINO REGULAR 200ML",
        description: "Cappuccino clasic.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-caffe-latte-regular",
        name: "CAFFÉ LATTE REGULAR 200ML",
        description: "Caffé Latte.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-flat-white-regular",
        name: "FLAT WHITE REGULAR 200ML",
        description: "Flat White.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-cappuccino",
        name: "DECAF CAPPUCCINO REGULAR 200ML",
        description: "Decaf Cappuccino.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-caffe-latte",
        name: "DECAF CAFÉ LATTE REGULAR 270ML",
        description: "Decaf Caffé Latte.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-flat-white",
        name: "DECAF FLAT WHITE REGULAR 200ML",
        description: "Decaf Flat White.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcpops-mix",
        name: "MCPOPS MIX 66GR",
        description: "McPops Mix.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 12.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 12.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 12.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-croissant-fistic",
        name: "CROISSANT CU UMPLUTURA DE FISTIC 76G",
        description: "Croissant cu fistic.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 10.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 10.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 10.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-chocolate-fudge",
        name: "CHOCOLATE FUDGE : PRAJITURA DE CIOCOLATA 81G",
        description: "Prăjitură de ciocolată Chocolate Fudge.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-gogoasa-vanilie",
        name: "GOGOASA CU GLAZURA DIN CREMA DE VANILIE 71G",
        description: "Gogoașă cu cremă de vanilie.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-espresso-macchiato",
        name: "ESPRESSO MACCHIATO 30ML",
        description: "Espresso Macchiato.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-espresso-macchiato",
        name: "DECAF ESPRESSO MACCHIATO 30ML",
        description: "Decaf Espresso Macchiato.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 9.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 9.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 9.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-croissant-cacao-alune",
        name: "CROISSANT CU CREMA DE CACAO SI ALUNE DE PADURE 75G",
        description: "Croissant cu cacao și alune.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-espresso-regular",
        name: "ESPRESSO REGULAR 30ML",
        description: "Espresso clasic.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-cafea-americano",
        name: "CAFEA AMERICANO REGULAR 180ML",
        description: "Cafea Americano.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-espresso-regular",
        name: "DECAF ESPRESSO REGULAR 30ML",
        description: "Decaf Espresso.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-decaf-cafea-americano",
        name: "DECAF CAFEA AMERICANO REGULAR 180ML",
        description: "Decaf Cafea Americano.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ceai-energy",
        name: "ENERGY - CEAI DE FRUCTE CU AROMA DE CIRESE 300ML",
        description: "Ceai de fructe cu cireșe.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ceai-oriental-apple",
        name: "ORIENTAL APPLE - CEAI DE FRUCTE CU AROMA DE MERE 300ML",
        description: "Ceai de fructe cu mere.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ceai-jasmine",
        name: "JASMINE - CEAI VERDE CU FLORI DE IASOMIE 300ML",
        description: "Ceai verde de iasomie.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1606775677462-2435df178a99?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ceai-peppermint",
        name: "PEPPERMINT - CEAI DE PLANTE CU AROMA DE MERE 300ML",
        description: "Ceai de mentă cu mere.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ceai-herbs-honey",
        name: "HERBS & HONEY - CEAI DE PLANTE CU AROMA DE MIERE 300ML",
        description: "Ceai de plante cu miere.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-ceai-english-breakfast",
        name: "ENGLISH BREAKFAST - CEAI NEGRU 300ML",
        description: "Ceai negru English Breakfast.",
        category: "McCafé",
        imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-trile-choco-cookie",
        name: "TRILE CHOCO CHOOKIE: FURSEC CACAO 71G",
        description: "Fursec cu ciocolată.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 8.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 8.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 8.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-croissant-unt",
        name: "CROISSANT CU UNT 70G",
        description: "Croissant clasic cu unt.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.90, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.90, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.90, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcpops-ciocolata-alba",
        name: "MCPOPS: GOGOASA AROMA DE CIOCOLATA SI ALBA 22G",
        description: "McPops cu ciocolată albă.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcpops-caise",
        name: "MCPOPS: GOGOASA AROMA DE CAISE 22G",
        description: "McPops cu aromă de caise.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-mcpops-ciocolata-alune",
        name: "MCPOPS: GOGOASA AROMA DE CIOCOLATA SI ALUNE 22G",
        description: "McPops cu ciocolată și alune.",
        category: "Deserturi",
        imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 5.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 5.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 5.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-apa-plata",
        name: "APA MINERALA PLATA 500ML - Plus Garantie Sticla",
        description: "Apă minerală plată.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1559839914-11aae4f09d28?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 11.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-apa-carbogazoasa",
        name: "APA MINERALA CARBOGAZOASA 500ML - Plus Garantie Sticla",
        description: "Apă minerală carbogazoasă.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1559839914-11aae4f09d28?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.50, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.50, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 11.50, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-suc-mere",
        name: "SUC DE MERE 250ML",
        description: "Suc de mere proaspăt.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 11.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-suc-portocale",
        name: "Suc de portocale",
        description: "Suc de portocale proaspăt.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 11.00, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 11.00, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 11.00, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-coca-cola",
        name: "COCA-COLA",
        description: "Coca-Cola.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-coca-cola-zero",
        name: "Coca-Cola Zero 250 ML",
        description: "Coca-Cola Zero.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-fanta",
        name: "Fanta",
        description: "Fanta.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-sprite",
        name: "Sprite",
        description: "Sprite.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      },
      {
        id: "mc-lipton",
        name: "Lipton",
        description: "Lipton Ice Tea.",
        category: "Băuturi",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
        prices: [
          { platform: "glovo", available: true, price: 7.60, deepLink: "https://glovoapp.com/ro/ro/constanta/mcdonalds/" },
          { platform: "bolt", available: true, price: 7.60, deepLink: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/mcdonalds" },
          { platform: "wolt", available: true, price: 7.60, deepLink: "https://wolt.com/ro/rou/constanta/restaurant/mcdonalds" },
        ],
      }
    ]
  },
  {
    id: "pizzahut-constanta"
    name: "Pizza Hut Constanța",
    category: "Pizza",
    deliveryTime: "30-50",
    city: "Constanța",
    address: "Bulevardul Tomis 401, Constanța",
    rating: 4.5,
    reviewCount: 300,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    platforms: [
      {
        platform: "glovo",
        available: true,
        deliveryFee: 5.99,
        serviceFeePercent: 0,
        serviceFeeMin: 0,
        serviceFeeMax: 0,
        smallOrderFee: 5.99,
        smallOrderThreshold: 40.0,
        dynamicSmallOrderFee: true,
        link: "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
      },
      {
        platform: "bolt",
        available: true,
        deliveryFee: 6.99,
        serviceFeePercent: 0,
        serviceFeeMin: 0,
        serviceFeeMax: 0,
        smallOrderFee: 0,
        smallOrderThreshold: 40.0,
        dynamicSmallOrderFee: false,
        link: "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
      },
      {
        platform: "wolt",
        available: true,
        deliveryFee: 7.99,
        serviceFeePercent: 0,
        serviceFeeMin: 0,
        serviceFeeMax: 0,
        smallOrderFee: 0,
        smallOrderThreshold: 40.0,
        dynamicSmallOrderFee: false,
        link: "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
      }
    ],
    menu: [
      {
              "id": "ph-pepperoni-cheesy-bites-30",
              "name": "Pizza Pepperoni Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, dublu salam Pepperoni",
              "category": "Cele mai vândute",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-medie",
              "name": "Pizza Pepperoni medie",
              "description": "Sos de roșii, brânză Mozzarella, dublu salam Pepperoni - 610g",
              "category": "Cele mai vândute",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-cheesy-bites-30",
              "name": "Pizza Margherita Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, brânză Mozzarella",
              "category": "Cele mai vândute",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-cc-mica",
              "name": "Pizza Super Suprema",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-cc-mica",
              "name": "Pizza Quattro Formaggi",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-cc-mica",
              "name": "Pizza Meat Lovers",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă - 414g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-cc-mica",
              "name": "Pizza Chicken&Pesto",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă - 396g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-cc-mica",
              "name": "Pizza Prosciutto & Rucola",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă - 396g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 54.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-cc-mica",
              "name": "Pizza Ham&Bacon",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-cc-mica",
              "name": "Pizza Chicken&Corn",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, salam Pepperoni, roșii, ardei, ceapă...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-cc-mica",
              "name": "Pizza Nevada",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-cc-mica",
              "name": "Pizza Suprema",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, Feta, salam Pepperoni, ardei, ceapă - 400g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-cc-mica",
              "name": "Pizza American Spicy",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, Branza Feta, șuncă, cubulețe cu carne de...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-cc-mica",
              "name": "Pizza Quattro Stagioni",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, ton, porumb, ceapă, măsline",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-cc-mica",
              "name": "Pizza Pepperoni&Feta",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-cc-mica",
              "name": "Pizza Pork & Feta",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-cc-mica",
              "name": "Pizza Tuna",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, brânză Mozzarella, Cheddar, Emmentaler, brânză cu mucegai si oregano...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-cc-mica",
              "name": "Pizza Fresh Mozzarella",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, piept de pui, cubulețe cu carne de vită...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 50,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-cheeseburger-cc-mica",
              "name": "Pizza Cheeseburger",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos burger, brânză Mozzarella, cubulețe cu carne de vită, castraveți în oțet...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-cc-mica",
              "name": "Pizza Veggie&Mozzarella",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, piept de pui, porumb, ardei. - 368g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-cc-mica",
              "name": "Pizza Roma",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, dublu salam Pepperoni. - 393g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-cc-mica",
              "name": "Pizza California",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas - 400g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-europeana-cc-mica",
              "name": "Pizza Europeana",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-cc-mica",
              "name": "Pizza Pepperoni",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-cc-mica",
              "name": "Pizza Hawaiana",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, roșii, porumb - 406g",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-cc-mica",
              "name": "Pizza Carbonara",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, piept de pui, ciuperci, ardei, porumb, roșii...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-millenium-cc-mica",
              "name": "Pizza Millenium",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, bacon,șuncă, ciuperci, ardei, măsline...",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-cc-mica",
              "name": "Pizza Margherita",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella.",
              "category": "PIZZA CHEESEBURGER CROWN (mică)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-cc-medie",
              "name": "Pizza Super Suprema",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-cc-medie",
              "name": "Pizza Quattro Formaggi",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-cc-medie",
              "name": "Pizza Meat Lovers",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă - 850g",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-cc-medie",
              "name": "Pizza Chicken & Pesto",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă - 810g",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-cc-medie",
              "name": "Pizza Prosciutto & Rucola",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă - 800g",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 84.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-cc-medie",
              "name": "Pizza Ham & Bacon",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-cc-medie",
              "name": "Pizza Chicken & Corn",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, salam Pepperoni, roșii, ardei, ceapă...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-cc-medie",
              "name": "Pizza Nevada",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-cc-medie",
              "name": "Pizza Suprema",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, Feta, salam Pepperoni, ardei, ceapă - 812g",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-cc-medie",
              "name": "Pizza American Spicy",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, Branza Feta, șuncă, cubulețe cu carne de...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-cc-medie",
              "name": "Pizza Quattro Stragioni",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, ton, porumb, ceapă ,măsline...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-cc-medie",
              "name": "Pizza Pepperoni & Feta",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-cc-medie",
              "name": "Pizza Pork & Feta",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-cc-medie",
              "name": "Pizza Tuna",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, brânză Mozzarella, Cheddar, Emmentaler, brânză cu mucegai si Oregano...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-cc-medie",
              "name": "Pizza Fresh Mozzarella",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, piept de pui, cubulețe cu carne de vită...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 79,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-cheeseburger-cc-medie",
              "name": "Pizza Cheeseburger",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, șuncă, ciuperci, măsline",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-cc-medie",
              "name": "Pizza Veggie & Mozzarella",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-cc-medie",
              "name": "Pizza Roma",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, dublu salam Pepperoni - 794g",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-cc-medie",
              "name": "Pizza California",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas. - 815g",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-europeana-cc-medie",
              "name": "Pizza Europeana",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-cc-medie",
              "name": "Pizza Pepperoni",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-cc-medie",
              "name": "Pizza Hawaiana",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, roșii, porumb - 800g",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-cc-medie",
              "name": "Pizza Carbonara",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, piept de pui, ciuperci, ardei, porumb, roșii...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-millenium-cc-medie",
              "name": "Pizza Millenium",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella, bacon,șuncă, ciuperci, ardei, măsline...",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 74,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-cc-medie",
              "name": "Pizza Margherita",
              "description": "Margine umplută cu mini burgeri cu carne de vită și sos burger, asezonați cu brânză Cheddar rasă, sos de roșii, brânză Mozzarella.",
              "category": "PIZZA CHEESEBURGER CROWN (medie)",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 57,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 57,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 57,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-xxxl-meal-box",
              "name": "XXXL MEAL BOX",
              "description": "În cadrul ofertei se pot comanda 2 pizza de dimensiune medie pe blat Classic la alegere + 4 antreuri la alegere",
              "category": "NEW! MEAL BOX",
              "imageUrl": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 138,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 138,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 138,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-xxl-meal-box",
              "name": "XXL MEAL BOX",
              "description": "În cadrul ofertei se pot comanda 1 pizza de dimensiune medie pe blat Classic la alegere + 4 antreuri la alegere",
              "category": "NEW! MEAL BOX",
              "imageUrl": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 104,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 104,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 104,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-strips-8",
              "name": "Chicken Strips 8 buc",
              "description": "Bucăți de piept de pui în crustă crocantă și condimentată.",
              "category": "ADD-ONS",
              "imageUrl": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-strips-5",
              "name": "Chicken Strips 5 buc",
              "description": "Bucăți de piept de pui în crustă crocantă și condimentată.",
              "category": "ADD-ONS",
              "imageUrl": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 29,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 29,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 29,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-popcorn-chicken",
              "name": "Popcorn chicken",
              "description": "Bucățele de piept de pui în crustă crocantă și condimentată.",
              "category": "ADD-ONS",
              "imageUrl": "https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 20,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 20,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 20,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-garlic-parmesan-fries",
              "name": "Garlic & Parmesan fries",
              "description": "Cartofi prăjiți aromatizati cu unt și usturoi, asezonați cu Parmezan și pătrunjel.",
              "category": "ADD-ONS",
              "imageUrl": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 17.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 17.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 17.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-cheese-pillows",
              "name": "Cheese pillows",
              "description": "Pernițe de brânză Gouda crocante (5 buc).",
              "category": "ADD-ONS",
              "imageUrl": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 17.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 17.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 17.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-french-fries",
              "name": "French fries",
              "description": "Cartofi prăjiți.",
              "category": "ADD-ONS",
              "imageUrl": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-barbeque-wingstreet",
              "name": "Barbeque WingStreet",
              "description": "Aripioare de pui condimentate trecute prin cuptor și glazurate cu sos Barbeque.",
              "category": "WINGSTREET",
              "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sweet-chili-wingstreet",
              "name": "Sweet Chili WingStreet",
              "description": "Aripioare de pui condimentate trecute prin cuptor și glazurate cu sos Sweet Chili.",
              "category": "WINGSTREET",
              "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-piri-piri-wingstreet",
              "name": "Piri Piri WingStreet",
              "description": "Aripioare de pui condimentate trecute prin cuptor și glazurate cu sos Piri Piri și presărate cu fulgi de ardei.",
              "category": "WINGSTREET",
              "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sriracha-wingstreet",
              "name": "Sriracha WingStreet",
              "description": "Aripioare de pui condimentate trecute prin cuptor și glazurate cu sos Sriracha și presărate cu ardei jalapenos.",
              "category": "WINGSTREET",
              "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-garlic-parmesan-wingstreet",
              "name": "Garlic Parmesan WingStreet",
              "description": "Aripioare de pui condimentate trecute prin cuptor și glazurate cu sos Garlic Parmesan și presărate cu ceapă verde.",
              "category": "WINGSTREET",
              "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 31,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-wingstreet-simplu",
              "name": "WingStreet",
              "description": "Aripioare de pui condimentate trecute prin cuptor.",
              "category": "WINGSTREET",
              "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 25,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 25,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 25,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-cheesy-stuffed-crust-38",
              "name": "Pizza Carbonara Cheesy Stuffed Crust Ø38cm",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline.",
              "category": "PIZZA CARBONARA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-cheesy-bites-30",
              "name": "Pizza Carbonara Cheesy Bites Ø30.5cm",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline.",
              "category": "PIZZA CARBONARA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-mare",
              "name": "Pizza Carbonara mare",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline.",
              "category": "PIZZA CARBONARA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-pan-large",
              "name": "Pizza Carbonara Pan large",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline.",
              "category": "PIZZA CARBONARA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-carbonara-medie",
              "name": "Pizza Carbonara medie",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline.",
              "category": "PIZZA CARBONARA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-mica",
              "name": "Pizza Carbonara mica",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline.",
              "category": "PIZZA CARBONARA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carbonara-pan-small",
              "name": "Pizza Carbonara Pan small",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, ciuperci, măsline.",
              "category": "PIZZA CARBONARA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-milenium-cheesy-stuffed-crust-38",
              "name": "Pizza Milenium Cheesy Stuffed Crust Ø38cm",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză Parmezan, oregano.",
              "category": "PIZZA MILENIUM",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-milenium-cheesy-bites-30",
              "name": "Pizza Milenium Cheesy Bites Ø30.5cm",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză Parmezan, oregano.",
              "category": "PIZZA MILENIUM",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-milenium-mare",
              "name": "Pizza Milenium mare",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză Parmezan, oregano.",
              "category": "PIZZA MILENIUM",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-milenium-pan-large",
              "name": "Pizza Milenium Pan large",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză Parmezan, oregano.",
              "category": "PIZZA MILENIUM",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-milenium-medie",
              "name": "Pizza Milenium medie",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză Parmezan, oregano.",
              "category": "PIZZA MILENIUM",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-milenium-mica",
              "name": "Pizza Milenium mica",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză Parmezan, oregano.",
              "category": "PIZZA MILENIUM",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-milenium-pan-small",
              "name": "Pizza Milenium Pan small",
              "description": "Sos alb cu usturoi, brânză Mozzarella, bacon, șuncă, ciuperci, brânză Parmezan, oregano.",
              "category": "PIZZA MILENIUM",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-cheesy-stuffed-crust-38",
              "name": "Pizza Chicken & Pesto Cheesy Stuffed Crust Ø38cm",
              "description": "Sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate, Parmezan și oregano.",
              "category": "PIZZA CHICKEN & PESTO",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-cheesy-bites-30",
              "name": "Pizza Chicken & Pesto Cheesy Bites Ø30.5cm",
              "description": "Sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate, Parmezan și oregano.",
              "category": "PIZZA CHICKEN & PESTO",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-mare",
              "name": "Pizza Chicken & Pesto mare",
              "description": "Sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate, Parmezan și oregano.",
              "category": "PIZZA CHICKEN & PESTO",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-pan-large",
              "name": "Pizza Chicken & Pesto Pan large",
              "description": "Sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate, Parmezan și oregano.",
              "category": "PIZZA CHICKEN & PESTO",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-medie",
              "name": "Pizza Chicken & Pesto medie",
              "description": "Sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate, Parmezan și oregano.",
              "category": "PIZZA CHICKEN & PESTO",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-mica",
              "name": "Pizza Chicken & Pesto mica",
              "description": "Sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate, Parmezan și oregano.",
              "category": "PIZZA CHICKEN & PESTO",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pesto-pan-small",
              "name": "Pizza Chicken & Pesto Pan small",
              "description": "Sos Pesto, brânză Mozzarella, piept de pui, brânză Feta, roșii uscate, Parmezan și oregano.",
              "category": "PIZZA CHICKEN & PESTO",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-cheesy-stuffed-crust-38",
              "name": "Pizza Prosciutto & Rucola Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan, Prosciutto crudo.",
              "category": "PIZZA PROSCIUTTO & RUCOLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-cheesy-bites-30",
              "name": "Pizza Prosciutto & Rucola Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan, Prosciutto crudo.",
              "category": "PIZZA PROSCIUTTO & RUCOLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-mare",
              "name": "Pizza Prosciutto & Rucola mare",
              "description": "Sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan, Prosciutto crudo.",
              "category": "PIZZA PROSCIUTTO & RUCOLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-pan-large",
              "name": "Pizza Prosciutto & Rucola Pan large",
              "description": "Sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan, Prosciutto crudo.",
              "category": "PIZZA PROSCIUTTO & RUCOLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-medie",
              "name": "Pizza Prosciutto & Rucola medie",
              "description": "Sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan, Prosciutto crudo.",
              "category": "PIZZA PROSCIUTTO & RUCOLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-mica",
              "name": "Pizza Prosciutto & Rucola mica",
              "description": "Sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan, Prosciutto crudo.",
              "category": "PIZZA PROSCIUTTO & RUCOLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-prosciutto-rucola-pan-small",
              "name": "Pizza Prosciutto & Rucola Pan small",
              "description": "Sos de roșii, Brânză Mozzarella, roșii cherry, rucola, brânză Parmezan, Prosciutto crudo.",
              "category": "PIZZA PROSCIUTTO & RUCOLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-cheesy-stuffed-crust-38",
              "name": "Pizza Margherita Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, brânză Mozzarella.",
              "category": "PIZZA MARGHERITA",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-margherita-cheesy-bites-30",
              "name": "Pizza Margherita Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, brânză Mozzarella.",
              "category": "PIZZA MARGHERITA",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-mare",
              "name": "Pizza Margherita mare",
              "description": "Sos de roșii, brânză Mozzarella - 840g",
              "category": "PIZZA MARGHERITA",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 52.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 52.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 52.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-pan-large",
              "name": "Pizza Margherita Pan large",
              "description": "Sos de roșii, brânză Mozzarella.",
              "category": "PIZZA MARGHERITA",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 52.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 52.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 52.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-medie",
              "name": "Pizza Margherita medie",
              "description": "Sos de roșii, brânză Mozzarella - 540g",
              "category": "PIZZA MARGHERITA",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-mica",
              "name": "Pizza Margherita mica",
              "description": "Sos de roșii, brânză Mozzarella - 360g",
              "category": "PIZZA MARGHERITA",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 28,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 28,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 28,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-margherita-pan-small",
              "name": "Pizza Margherita Pan small",
              "description": "Sos de roșii, brânză Mozzarella.",
              "category": "PIZZA MARGHERITA",
              "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 28,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 28,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 28,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-cheesy-stuffed-crust-38",
              "name": "Pizza Veggie & Mozzarella Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA VEGGIE & MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-cheesy-bites-30",
              "name": "Pizza Veggie & Mozzarella Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA VEGGIE & MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-mare",
              "name": "Pizza Veggie & Mozzarella mare",
              "description": "Sos de roșii, brânză Mozzarella, ciuperci, măsline, ardei, porumb, roșii - 990g...",
              "category": "PIZZA VEGGIE & MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-pan-large",
              "name": "Pizza Veggie & Mozzarella Pan large",
              "description": "Sos de roșii, brânză Mozzarella, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA VEGGIE & MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-medie",
              "name": "Pizza Veggie & Mozzarella medie",
              "description": "Sos de roșii, brânză Mozzarella, ciuperci, măsline, ardei, porumb, roșii - 680g...",
              "category": "PIZZA VEGGIE & MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-mica",
              "name": "Pizza Veggie & Mozzarella mica",
              "description": "Sos de roșii, brânză Mozzarella, ciuperci, măsline, ardei, porumb, roșii - 430g...",
              "category": "PIZZA VEGGIE & MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-veggie-mozzarella-pan-small",
              "name": "Pizza Veggie & Mozzarella Pan small",
              "description": "Sos de roșii, brânză Mozzarella, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA VEGGIE & MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-cheesy-stuffed-crust-38",
              "name": "Pizza Roma Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, șuncă, ciuperci, măsline...",
              "category": "PIZZA ROMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-cheesy-bites-30",
              "name": "Pizza Roma Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, șuncă, ciuperci, măsline...",
              "category": "PIZZA ROMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-mare",
              "name": "Pizza Roma mare",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, ciuperci, măsline - 900g...",
              "category": "PIZZA ROMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-pan-large",
              "name": "Pizza Roma Pan large",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, ciuperci, măsline...",
              "category": "PIZZA ROMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-medie",
              "name": "Pizza Roma medie",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, ciuperci, măsline - 600g...",
              "category": "PIZZA ROMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-mica",
              "name": "Pizza Roma mica",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, ciuperci, măsline - 400g...",
              "category": "PIZZA ROMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-roma-pan-small",
              "name": "Pizza Roma Pan small",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, ciuperci, măsline...",
              "category": "PIZZA ROMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-cheesy-stuffed-crust-38",
              "name": "Pizza California Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, piept de pui, porumb, ardei",
              "category": "PIZZA CALIFORNIA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-cheesy-bites-30",
              "name": "Pizza California Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, piept de pui, porumb, ardei",
              "category": "PIZZA CALIFORNIA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-mare",
              "name": "Pizza California mare",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, porumb, ardei - 930g",
              "category": "PIZZA CALIFORNIA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-pan-large",
              "name": "Pizza California Pan large",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, porumb, ardei",
              "category": "PIZZA CALIFORNIA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-medie",
              "name": "Pizza California medie",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, porumb, ardei - 600g",
              "category": "PIZZA CALIFORNIA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-mica",
              "name": "Pizza California mica",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, porumb, ardei - 450g",
              "category": "PIZZA CALIFORNIA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-california-pan-small",
              "name": "Pizza California Pan small",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, porumb, ardei",
              "category": "PIZZA CALIFORNIA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-hawaiana-cheesy-stuffed-crust-38",
              "name": "Pizza Hawaiiana Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas",
              "category": "PIZZA HAWAIIANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-cheesy-bites-30",
              "name": "Pizza Hawaiiana Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas",
              "category": "PIZZA HAWAIIANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-mare",
              "name": "Pizza Hawaiiana mare",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas",
              "category": "PIZZA HAWAIIANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-pan-large",
              "name": "Pizza Hawaiiana Pan large",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas",
              "category": "PIZZA HAWAIIANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-medie",
              "name": "Pizza Hawaiiana medie",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas",
              "category": "PIZZA HAWAIIANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-mica",
              "name": "Pizza Hawaiiana mica",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas",
              "category": "PIZZA HAWAIIANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-hawaiana-pan-small",
              "name": "Pizza Hawaiiana Pan small",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe de ananas",
              "category": "PIZZA HAWAIIANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-europeana-cheesy-stuffed-crust-38",
              "name": "Pizza Europeană Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci",
              "category": "PIZZA EUROPEANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-europeana-cheesy-bites-30",
              "name": "Pizza Europeană Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci",
              "category": "PIZZA EUROPEANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-europeana-mare",
              "name": "Pizza Europeana mare",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci - 990g",
              "category": "PIZZA EUROPEANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-europeana-pan-large",
              "name": "Pizza Europeana Pan large",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci",
              "category": "PIZZA EUROPEANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-europeana-medie",
              "name": "Pizza Europeana medie",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci - 500g",
              "category": "PIZZA EUROPEANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-europeana-mica",
              "name": "Pizza Europeana mica",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci - 450g",
              "category": "PIZZA EUROPEANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-europeana-pan-small",
              "name": "Pizza Europeana Pan small",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, cubulețe cu carne de vită, ciuperci",
              "category": "PIZZA EUROPEANA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-cheesy-stuffed-crust-38",
              "name": "Pizza Supremă Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, salam Pepperoni, cubulețe cu carne de vită, ceapă, ciuperci, ardei",
              "category": "PIZZA SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-cheesy-bites-30",
              "name": "Pizza Supremă Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, salam Pepperoni, cubulețe cu carne de vită, ceapă, ciuperci, ardei",
              "category": "PIZZA SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-mare",
              "name": "Pizza Suprema mare",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, ceapă, ciuperci, ardei - 900g",
              "category": "PIZZA SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-pan-large",
              "name": "Pizza Supremă Pan large",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, ceapă, ciuperci, ardei",
              "category": "PIZZA SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-medie",
              "name": "Pizza Suprema medie",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, ceapă, ciuperci, ardei - 560g",
              "category": "PIZZA SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-mica",
              "name": "Pizza Suprema mica",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, ceapă, ciuperci, ardei - 410g",
              "category": "PIZZA SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-suprema-pan-small",
              "name": "Pizza Supremă Pan small",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, ceapă, ciuperci, ardei",
              "category": "PIZZA SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-cheesy-stuffed-crust-38",
              "name": "Pizza Quattro Stagioni Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei",
              "category": "PIZZA QUATTRO STAGIONI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-cheesy-bites-30",
              "name": "Pizza Quattro Stagioni Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei",
              "category": "PIZZA QUATTRO STAGIONI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-mare",
              "name": "Pizza Quattro Stagioni mare",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei - 970g",
              "category": "PIZZA QUATTRO STAGIONI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-pan-large",
              "name": "Pizza Quattro Stagioni Pan large",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei",
              "category": "PIZZA QUATTRO STAGIONI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-quattro-stagioni-medie",
              "name": "Pizza Quattro Stagioni medie",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei - 620g",
              "category": "PIZZA QUATTRO STAGIONI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-mica",
              "name": "Pizza Quattro Stagioni mica",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei - 430g",
              "category": "PIZZA QUATTRO STAGIONI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-stagioni-pan-small",
              "name": "Pizza Quattro Stagioni Pan small",
              "description": "Sos de roșii, brânză Mozzarella, șuncă, salam Pepperoni, ciuperci, ardei",
              "category": "PIZZA QUATTRO STAGIONI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-cheesy-stuffed-crust-38",
              "name": "Pizza Pepperoni Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, dublu salam Pepperoni",
              "category": "PIZZA PEPPERONI",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-cheesy-bites-30",
              "name": "Pizza Pepperoni Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, dublu salam Pepperoni",
              "category": "PIZZA PEPPERONI",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 77,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-mare",
              "name": "Pizza Pepperoni mare",
              "description": "Sos de roșii, brânză Mozzarella, dublu salam Pepperoni - 920g",
              "category": "PIZZA PEPPERONI",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-pan-large",
              "name": "Pizza Pepperoni Pan large",
              "description": "Sos de roșii, brânză Mozzarella, dublu salam Pepperoni",
              "category": "PIZZA PEPPERONI",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 71,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-medie",
              "name": "Pizza Pepperoni medie",
              "description": "Sos de roșii, brânză Mozzarella, dublu salam Pepperoni - 610g",
              "category": "PIZZA PEPPERONI",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 59.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-mica",
              "name": "Pizza Pepperoni mica",
              "description": "Sos de roșii, brânză Mozzarella, dublu salam Pepperoni - 400g",
              "category": "PIZZA PEPPERONI",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-pan-small",
              "name": "Pizza Pepperoni Pan small",
              "description": "Sos de roșii, brânză Mozzarella, dublu salam Pepperoni",
              "category": "PIZZA PEPPERONI",
              "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 42,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-cheesy-stuffed-crust-38",
              "name": "Pizza Fresh Mozzarella Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola, roșii cherry",
              "category": "PIZZA FRESH MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-cheesy-bites-30",
              "name": "Pizza Fresh Mozzarella Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola, roșii cherry",
              "category": "PIZZA FRESH MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-mare",
              "name": "Pizza Fresh Mozzarella mare",
              "description": "Sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola, roșii cherry",
              "category": "PIZZA FRESH MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-pan-large",
              "name": "Pizza Fresh Mozzarella Pan large",
              "description": "Sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola, roșii cherry",
              "category": "PIZZA FRESH MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-medie",
              "name": "Pizza Fresh Mozzarella medie",
              "description": "Sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola, roșii cherry",
              "category": "PIZZA FRESH MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-mica",
              "name": "Pizza Fresh Mozzarella mica",
              "description": "Sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola, roșii cherry",
              "category": "PIZZA FRESH MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fresh-mozzarella-pan-small",
              "name": "Pizza Fresh Mozzarella Pan small",
              "description": "Sos de roșii, brânză Mozzarella, brânză Mozzarella proaspătă, salată rucola, roșii cherry",
              "category": "PIZZA FRESH MOZZARELLA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-cheesy-stuffed-crust-38",
              "name": "Pizza American Spicy Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, salam Pepperoni, roșii, ardei, ceapă, jalapeños, sos Samourai",
              "category": "PIZZA AMERICAN SPICY",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-cheesy-bites-30",
              "name": "Pizza American Spicy Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, salam Pepperoni, roșii, ardei, ceapă, jalapeños, sos Samourai",
              "category": "PIZZA AMERICAN SPICY",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-mare",
              "name": "Pizza American Spicy mare",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, roșii, ardei, ceapă, jalapeños, sos Samourai - 980g",
              "category": "PIZZA AMERICAN SPICY",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-pan-large",
              "name": "Pizza American Spicy Pan large",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, roșii, ardei, ceapă, jalapeños, sos Samourai",
              "category": "PIZZA AMERICAN SPICY",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-medie",
              "name": "Pizza American Spicy medie",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, roșii, ardei, ceapă, jalapeños, sos Samourai - 680g",
              "category": "PIZZA AMERICAN SPICY",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-mica",
              "name": "Pizza American Spicy mica",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, roșii, ardei, ceapă, jalapeños, sos Samourai - 450g",
              "category": "PIZZA AMERICAN SPICY",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-american-spicy-pan-small",
              "name": "Pizza American Spicy Pan small",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, roșii, ardei, ceapă, jalapeños, sos Samourai",
              "category": "PIZZA AMERICAN SPICY",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-cheesy-stuffed-crust-38",
              "name": "Pizza Nevada Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, bacon, șuncă, ciuperci, ardei, măsline...",
              "category": "PIZZA NEVADA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-nevada-cheesy-bites-30",
              "name": "Pizza Nevada Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, bacon, șuncă, ciuperci, ardei, măsline...",
              "category": "PIZZA NEVADA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-mare",
              "name": "Pizza Nevada mare",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, ardei, măsline - 865g...",
              "category": "PIZZA NEVADA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-pan-large",
              "name": "Pizza Nevada Pan large",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, ardei, măsline...",
              "category": "PIZZA NEVADA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-medie",
              "name": "Pizza Nevada medie",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, ardei, măsline - 600g...",
              "category": "PIZZA NEVADA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-mica",
              "name": "Pizza Nevada mica",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, ardei, măsline - 440g...",
              "category": "PIZZA NEVADA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-nevada-pan-small",
              "name": "Pizza Nevada Pan small",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, ardei, măsline...",
              "category": "PIZZA NEVADA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-cheesy-stuffed-crust-38",
              "name": "Pizza Chicken & Corn Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, piept de pui, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA CHICKEN & CORN",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-cheesy-bites-30",
              "name": "Pizza Chicken & Corn Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, piept de pui, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA CHICKEN & CORN",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-mare",
              "name": "Pizza Chicken & Corn mare",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, ciuperci, măsline, ardei, porumb, roșii - 920g...",
              "category": "PIZZA CHICKEN & CORN",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-pan-large",
              "name": "Pizza Chicken & Corn Pan large",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA CHICKEN & CORN",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-medie",
              "name": "Pizza Chicken & Corn medie",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, ciuperci, măsline, ardei, porumb, roșii - 590g...",
              "category": "PIZZA CHICKEN & CORN",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-mica",
              "name": "Pizza Chicken & Corn mica",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, ciuperci, măsline, ardei, porumb, roșii - 405g...",
              "category": "PIZZA CHICKEN & CORN",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-corn-pan-small",
              "name": "Pizza Chicken & Corn Pan small",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, ciuperci, măsline, ardei, porumb, roșii...",
              "category": "PIZZA CHICKEN & CORN",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-cheesy-stuffed-crust-38",
              "name": "Pizza Ham & Bacon Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, bacon, șuncă, ciuperci, roșii, porumb",
              "category": "PIZZA HAM & BACON",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-cheesy-bites-30",
              "name": "Pizza Ham & Bacon Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, bacon, șuncă, ciuperci, roșii, porumb",
              "category": "PIZZA HAM & BACON",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-mare",
              "name": "Pizza Ham & Bacon mare",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, roșii, porumb - 910g",
              "category": "PIZZA HAM & BACON",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-pan-large",
              "name": "Pizza Ham & Bacon Pan large",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, roșii, porumb",
              "category": "PIZZA HAM & BACON",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-medie",
              "name": "Pizza Ham & Bacon medie",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, roșii, porumb - 606g",
              "category": "PIZZA HAM & BACON",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-mica",
              "name": "Pizza Ham & Bacon mica",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, roșii, porumb - 400g",
              "category": "PIZZA HAM & BACON",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ham-bacon-pan-small",
              "name": "Pizza Ham & Bacon Pan small",
              "description": "Sos de roșii, brânză Mozzarella, bacon, șuncă, ciuperci, roșii, porumb",
              "category": "PIZZA HAM & BACON",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-cheesy-stuffed-crust-38",
              "name": "Pepperoni & Feta Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, Feta, salam Pepperoni, ardei, ceapă",
              "category": "PIZZA PEPPERONI & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-cheesy-bites-30",
              "name": "Pepperoni & Feta Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, Feta, salam Pepperoni, ardei, ceapă",
              "category": "PIZZA PEPPERONI & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-mare",
              "name": "Pizza Pepperoni & Feta mare",
              "description": "Sos de roșii, brânză Mozzarella, Feta, salam Pepperoni, ardei, ceapă - 890g",
              "category": "PIZZA PEPPERONI & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-pan-large",
              "name": "Pizza Pepperoni & Feta Pan large",
              "description": "Sos de roșii, brânză Mozzarella, Feta, salam Pepperoni, ardei, ceapă",
              "category": "PIZZA PEPPERONI & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-medie",
              "name": "Pizza Pepperoni & Feta medie",
              "description": "Sos de roșii, brânză Mozzarella, Feta, salam Pepperoni, ardei, ceapă - 570g",
              "category": "PIZZA PEPPERONI & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-pepperoni-feta-mica",
              "name": "Pizza Pepperoni & Feta mica",
              "description": "Sos de roșii, brânză Mozzarella, Feta, salam Pepperoni, ardei, ceapă - 380g",
              "category": "PIZZA PEPPERONI & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-feta-pan-small",
              "name": "Pizza Pepperoni & Feta Pan small",
              "description": "Sos de roșii, brânză Mozzarella, Feta, salam Pepperoni, ardei, ceapă",
              "category": "PIZZA PEPPERONI & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-cheesy-stuffed-crust-38",
              "name": "Pizza Pork & Feta Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, Feta, șuncă, cubulețe cu carne de porc, ceapă",
              "category": "PIZZA PORK & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-cheesy-bites-30",
              "name": "Pizza Pork & Feta Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, Feta, șuncă, cubulețe cu carne de porc, ceapă",
              "category": "PIZZA PORK & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-mare",
              "name": "Pizza Pork & Feta mare",
              "description": "Sos de roșii, brânză Mozzarella, Feta, șuncă, cubulețe cu carne de porc, ceapă",
              "category": "PIZZA PORK & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-pan-large",
              "name": "Pizza Pork & Feta Pan large",
              "description": "Sos de roșii, brânză Mozzarella, Feta, șuncă, cubulețe cu carne de porc, ceapă",
              "category": "PIZZA PORK & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-medie",
              "name": "Pizza Pork & Feta medie",
              "description": "Sos de roșii, brânză Mozzarella, Feta, șuncă, cubulețe cu carne de porc, ceapă",
              "category": "PIZZA PORK & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-mica",
              "name": "Pizza Pork & Feta mica",
              "description": "Sos de roșii, brânză Mozzarella, Feta, șuncă, cubulețe cu carne de porc, ceapă",
              "category": "PIZZA PORK & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pork-feta-pan-small",
              "name": "Pizza Pork & Feta Pan small",
              "description": "Sos de roșii, brânză Mozzarella, Feta, șuncă, cubulețe cu carne de porc, ceapă",
              "category": "PIZZA PORK & FETA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-cheesy-stuffed-crust-38",
              "name": "Pizza Tuna Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, ton, porumb, măsline, ceapă...",
              "category": "PIZZA TUNA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 86.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-cheesy-bites-30",
              "name": "Pizza Tuna Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, ton, porumb, măsline, ceapă...",
              "category": "PIZZA TUNA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-mare",
              "name": "Pizza Tuna mare",
              "description": "Sos de roșii, brânză Mozzarella, ton, porumb, măsline, ceapă...",
              "category": "PIZZA TUNA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-pan-large",
              "name": "Pizza Tuna Pan large",
              "description": "Sos de roșii, brânză Mozzarella, ton, porumb, măsline, ceapă...",
              "category": "PIZZA TUNA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 75,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-medie",
              "name": "Pizza Tuna medie",
              "description": "Sos de roșii, brânză Mozzarella, ton, porumb, măsline, ceapă...",
              "category": "PIZZA TUNA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 64.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-mica",
              "name": "Pizza Tuna mica",
              "description": "Sos de roșii, brânză Mozzarella, ton, porumb, măsline, ceapă...",
              "category": "PIZZA TUNA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuna-pan-small",
              "name": "Pizza Tuna Pan small",
              "description": "Sos de roșii, brânză Mozzarella, ton, porumb, măsline, ceapă...",
              "category": "PIZZA TUNA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-cheesy-stuffed-crust-38",
              "name": "Pizza Quattro Formaggi Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, Cheddar, Emmentaler, branza cu mucegai, oregano",
              "category": "PIZZA QUATTRO FORMAGGI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-cheesy-bites-30",
              "name": "Pizza Quattro Formaggi Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, Cheddar, Emmentaler, branza cu mucegai, oregano",
              "category": "PIZZA QUATTRO FORMAGGI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-mare",
              "name": "Pizza Quattro Formaggi mare",
              "description": "Brânză Mozzarella, Cheddar, Emmentaler, brânză cu mucegai - 989g",
              "category": "PIZZA QUATTRO FORMAGGI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-pan-large",
              "name": "Pizza Quattro Formaggi Pan large",
              "description": "Brânză Mozzarella, Cheddar, Emmentaler, brânză cu mucegai",
              "category": "PIZZA QUATTRO FORMAGGI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-medie",
              "name": "Pizza Quattro Formaggi medie",
              "description": "Brânză Mozzarella, Cheddar, Emmentaler, brânză cu mucegai - 650g",
              "category": "PIZZA QUATTRO FORMAGGI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-mica",
              "name": "Pizza Quattro Formaggi mica",
              "description": "Brânză Mozzarella, Cheddar, Emmentaler, brânză cu mucegai - 435g",
              "category": "PIZZA QUATTRO FORMAGGI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-quattro-formaggi-pan-small",
              "name": "Pizza Quattro Formaggi Pan small",
              "description": "Brânză Mozzarella, Cheddar, Emmentaler, brânză cu mucegai",
              "category": "PIZZA QUATTRO FORMAGGI",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-cheesy-stuffed-crust-38",
              "name": "Pizza Super Supremă Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, șuncă, ceapă, ciuperci, ardei, măsline...",
              "category": "PIZZA SUPER SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-cheesy-bites-30",
              "name": "Pizza Super Supremă Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, șuncă, ceapă, ciuperci, ardei, măsline...",
              "category": "PIZZA SUPER SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-super-suprema-mare",
              "name": "Pizza Super Suprema mare",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, șuncă, ceapă, ciuperci, ardei, măsline - 1025g...",
              "category": "PIZZA SUPER SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-pan-large",
              "name": "Pizza Super Supremă Pan large",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, șuncă, ceapă, ciuperci, ardei, măsline...",
              "category": "PIZZA SUPER SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-medie",
              "name": "Pizza Super Suprema medie",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, șuncă, ceapă, ciuperci, ardei, măsline - 680g...",
              "category": "PIZZA SUPER SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-mica",
              "name": "Pizza Super Suprema mica",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, șuncă, ceapă, ciuperci, ardei, măsline - 480g...",
              "category": "PIZZA SUPER SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-super-suprema-pan-small",
              "name": "Pizza Super Supremă Pan small",
              "description": "Sos de roșii, brânză Mozzarella, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, șuncă, ceapă, ciuperci, ardei, măsline...",
              "category": "PIZZA SUPER SUPREMA",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-cheesy-stuffed-crust-38",
              "name": "Pizza Meat Lovers Cheesy Stuffed Crust Ø38cm",
              "description": "Sos de roșii, Mozzarella, piept de pui, cubulețe cu carne de vită, salam Pepperoni, bacon",
              "category": "PIZZA MEAT LOVERS",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 93.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-cheesy-bites-30",
              "name": "Pizza Meat Lovers Cheesy Bites Ø30.5cm",
              "description": "Sos de roșii, Mozzarella, piept de pui, cubulețe cu carne de vită, salam Pepperoni, bacon",
              "category": "PIZZA MEAT LOVERS",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 87.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-mare",
              "name": "Pizza Meat Lovers mare",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, cubulețe cu carne de vită, salam Pepperoni, bacon - 980g",
              "category": "PIZZA MEAT LOVERS",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-pan-large",
              "name": "Pizza Meat Lovers Pan large",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, cubulețe cu carne de vită, salam Pepperoni, bacon",
              "category": "PIZZA MEAT LOVERS",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 82,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-medie",
              "name": "Pizza Meat Lovers medie",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, cubulețe cu carne de vită, salam Pepperoni, bacon - 670g",
              "category": "PIZZA MEAT LOVERS",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 70,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-mica",
              "name": "Pizza Meat Lovers mica",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, cubulețe cu carne de vită, salam Pepperoni, bacon - 450g",
              "category": "PIZZA MEAT LOVERS",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-meat-lovers-pan-small",
              "name": "Pizza Meat Lovers Pan small",
              "description": "Sos de roșii, brânză Mozzarella, piept de pui, cubulețe cu carne de vită, salam Pepperoni, bacon",
              "category": "PIZZA MEAT LOVERS",
              "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 49.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-bacon-cheeseburger",
              "name": "Bacon cheeseburger",
              "description": "Carne de vită, sos Chili Mayo, brânză Cheddar, bacon, mix salată, roșii felii, ceapă, chiflă pufoașă cu unt aromatizat. Se servește cu o porție de French Fries.",
              "category": "BURGER",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 47,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-cheeseburger",
              "name": "Cheeseburger",
              "description": "Carne de vită, sos Chili Mayo, brânză Cheddar, mix salată, roșii felii, ceapă, chiflă pufoașă cu unt aromatizat. Se servește cu o porție de French Fries.",
              "category": "BURGER",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-spicy-burger",
              "name": "Spicy burger",
              "description": "Carne de vită, sos Samourai, brânză Cheddar, jalapeños, mix salată, roșii felii, ceapă, chiflă pufoașă cu unt aromatizat. Se servește cu o porție de French Fries.",
              "category": "BURGER",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 45,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-classic-burger",
              "name": "Classic burger",
              "description": "Carne de vită, sos Chili Mayo, mix salată, roșii felii, ceapă, chiflă pufoașă cu unt aromatizat. Se servește cu o porție de French Fries.",
              "category": "BURGER",
              "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pasta-forno",
              "name": "Chicken Pasta (al forno)",
              "description": "Penne în sos alb de smântână, pesto verde, piept de pui, brânză Mozzarella, trecute prin cuptor - 380g",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-farmer-forno",
              "name": "Penne Farmer (al forno)",
              "description": "Penne în sos de roșii și smântână, piept de pui, ceapă, ciuperci, ardei, brânză mozzarella, trecute prin cuptor.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-super-supreme-forno",
              "name": "Penne Super Supreme (al forno)",
              "description": "Penne în sos de roșii și smântână, șuncă, salam Pepperoni, cubulețe cu carne de vită, cubulețe cu carne de porc, ceapă, ciuperci, ardei, măsline, brânză mozzarella, trecute prin...",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 43,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-chicken-pasta-sauted",
              "name": "Chicken Pasta (sauted)",
              "description": "Penne în sos alb de smântână și pesto verde, piept de pui, Parmezan.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 41,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 41,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 41,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-pepperoni-forno",
              "name": "Penne Pepperoni (al forno)",
              "description": "Penne în sos de roșii și smântână, salam Pepperoni, brânză mozzarella, trecute prin cuptor.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 41,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 41,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 41,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-carbonara-forno",
              "name": "Penne Carbonara (al forno)",
              "description": "Penne în sos alb cu smântână și usturoi, bacon, brânză Mozzarella, trecute prin cuptor.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 40,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 40,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 40,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-bolognese-forno",
              "name": "Penne Bolognese (al forno)",
              "description": "Penne în sos ragù, cubulețe cu carne de vită, brânză Mozzarella, trecute prin cuptor.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 40,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 40,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 40,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-carbonara-sauted",
              "name": "Penne Carbonara (sauted)",
              "description": "Penne în sos alb cu smântână și usturoi, bacon, Parmezan.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 38,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 38,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 38,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-bolognese-sauted",
              "name": "Penne Bolognese (sauted)",
              "description": "Penne în sos ragù, cubulețe cu carne de vită, ceapă, Parmezan.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 38,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 38,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 38,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-penne-tomato-veggie-forno",
              "name": "Penne Tomato Veggie (al forno)",
              "description": "Penne în sos de roșii, ciuperci, roșii, brânză Mozzarella, trecute prin cuptor.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 35,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 35,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 35,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-penne-tomato-veggie-sauted",
              "name": "Penne Tomato Veggie (sauted)",
              "description": "Penne în sos de roșii, ceapă roșie, ciuperci, rosii, Parmezan.",
              "category": "PASTE",
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 33,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-pepperoni-pocket",
              "name": "Pepperoni Pocket",
              "description": "Un aluat fin umplut cu brânză Mozzarella și aromă de usturoi, acoperit cu felii delicioase de salam Pepperoni.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 22.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 22.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 22.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-cheddar-jalapenos-pocket",
              "name": "Cheddar & Jalapenos Pocket",
              "description": "Un aluat fin umplut cu brânză Mozzarella, presărat cu mix de brânzeturi: Cheddar și Mozzarella și asezonat Jalapeños și usturoi.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 22.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 22.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 22.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-mozzarella-garlic-pocket",
              "name": "Mozzarella & Garlic Pocket",
              "description": "Un aluat fin umplut cu brânză Mozzarella, asezonat cu usturoi și presărat cu un extra topping de Mozzarella",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 21.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 21.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 21.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-garlic-bread-mix",
              "name": "Garlic bread mix",
              "description": "Trei felii de baghetă cu brânză Mozzarella și aromă de usturoi, asezonate cu Pepperoni, bacon și roșii, rumenite în cuptor.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 20.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 20.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 20.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-rulou-sunca",
              "name": "Rulou cu sunca",
              "description": "Tortilla cu brânză Mozzarella și Cheddar, șuncă și parmezan. Se servește cu un sos la alegere.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 19.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 19.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 19.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-garlic-bread-mozzarella",
              "name": "Garlic Bread cu Mozzarella",
              "description": "Trei felii de pâine rumenite în cuptor, acoperite cu brânză Mozzarella, unt și aromă de usturoi - 120g",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 15.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 15.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 15.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-mozzarella-wedges",
              "name": "Mozzarella wedges",
              "description": "Cartofi la cuptor cu brânză Mozzarella, serviți cu unul dintre sosurile noastre.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 15.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 15.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 15.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-cajun-fries",
              "name": "Cajun fries",
              "description": "Cartofi prăjiți aromatizați cu un mix de condimente savuroase.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 14.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 14.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 14.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-garlic-bread",
              "name": "Garlic Bread",
              "description": "Trei felii de baghetă cu aromă de usturoi, rumenite în cuptor.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-wedges",
              "name": "Wedges",
              "description": "Cartofi la cuptor, serviți cu unul dintre sosurile noastre.",
              "category": "STARTERS",
              "imageUrl": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 13.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-salata-caesar",
              "name": "Salata Caesar",
              "description": "Mix de salată endivia, frisée, sfeclă roșie, rucola, piept de pui, roșii cherry, fâșii de bacon crocant, Parmezan, sos Caesar. Se servește cu o felie de Garlic Bread...",
              "category": "SALATE",
              "imageUrl": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 38.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 38.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 38.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-salata-greek",
              "name": "Salata Greek",
              "description": "Brânză Feta, măsline verzi, roșii cherry, castraveți, ceapă roșie, ardei capia, busuioc uscat, ulei de măsline. Se servește cu o felie de Garlic Bread...",
              "category": "SALATE",
              "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 36.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 36.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 36.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-salata-tuna",
              "name": "Salata Tuna",
              "description": "Mix de salată endivia, frisée, sfeclă roșie, ton, măsline verzi, porumb, ardei, ceapă. Se servește cu un dressing la alegere.",
              "category": "SALATE",
              "imageUrl": "https://images.unsplash.com/photo-1546793665-c74683c3f38d?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 34.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 34.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 34.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-salata-caprese",
              "name": "Salata Caprese",
              "description": "Felii proaspete de roșii, brânză Mozzarella proaspătă, salată rucola, sos Pesto și ulei de măsline.",
              "category": "SALATE",
              "imageUrl": "https://images.unsplash.com/photo-1592417817098-8fd3d9ebc4a5?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 29.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 29.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 29.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-bj-chocolate-fudge-brownie-465",
              "name": "Ben & Jerry's Chocolate Fudge Brownie 465ml",
              "description": "465ml înghețată cu ciocolată și bucăți de negresă.",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 52,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 52,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 52,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-bj-chocolate-cookie-dough-465",
              "name": "Ben & Jerry s Chocolate Cookie Dough 465ml",
              "description": "465ml înghețată cu vanilie și bucăți de aluat de biscuiți.",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 52,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 52,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 52,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-lava-cake",
              "name": "Lava Cake",
              "description": "Prajitură de ciocolată cu sos de ciocolată.",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1624353365286-3f8d62adda51?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 26,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 26,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 26,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-strawberry-cake",
              "name": "Strawberry Cake",
              "description": "Tort cu căpșuni și cremă de smântână pe blat pufost și ornat cu alune.",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 26,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 26,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 26,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-bj-chocolate-fudge-brownie-100",
              "name": "Ben & Jerry's Chocolate Fudge Brownie 100ml",
              "description": "100ml înghețată cu ciocolată și bucăți de negresă.",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 24,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 24,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 24,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-bj-cookie-dough-100",
              "name": "Ben & Jerry's Cookie Dough 100ml",
              "description": "100ml înghețată cu vanilie și bucăți de aluat de biscuiți.",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 24,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 24,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 24,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-cheesecake",
              "name": "Cheesecake",
              "description": "Prajitură cu bază de biscuit, brânză Ricotta și brânză Mascarpone - 75g",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 22,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 22,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 22,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-waffle",
              "name": "Waffle",
              "description": "Gofra cu sos de ciocolata.",
              "category": "DESERT",
              "imageUrl": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 21,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 21,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 21,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ketchup-dulce",
              "name": "Ketchup dulce 55g",
              "description": "55g",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ketchup-iute",
              "name": "Ketchup iute 55g",
              "description": "55g",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ,
      {
              "id": "ph-sos-salsa",
              "name": "Sos Salsa 55g",
              "description": "55g",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sos-usturoi",
              "name": "Sos Usturoi 55g",
              "description": "55g",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sos-samourai",
              "name": "Samourai (sos picant de maioneză) 55g",
              "description": "55g",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sos-sweet-chili",
              "name": "Sweet Chili 55g",
              "description": "55g",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sos-barbeque",
              "name": "Sos Barbeque 55g",
              "description": "55g",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sos-piri-piri",
              "name": "Sos Piri Piri",
              "description": "Sos picant și dulce acrișor.",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sos-sriracha",
              "name": "Sos Sriracha",
              "description": "Sos picant de ardei chili.",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sos-garlic-parmesan",
              "name": "Sos Garlic Parmesan",
              "description": "Sos cremos cu iaurt și maioneză, aromatizat cu parmezan și usturoi.",
              "category": "SOSURI",
              "imageUrl": "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 6.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-carlsberg-500",
              "name": "Carlsberg 500ml",
              "description": "500ml",
              "category": "BEERS",
              "imageUrl": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 14,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 14,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 14,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-ursus-500",
              "name": "Ursus 500ml",
              "description": "500ml",
              "category": "BEERS",
              "imageUrl": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 13,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 13,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 13,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-tuborg-500",
              "name": "Tuborg 500ml",
              "description": "500ml",
              "category": "BEERS",
              "imageUrl": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 12,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 12,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 12,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-coca-cola-2l",
              "name": "Coca-Cola PET 2lt",
              "description": "2l",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-coca-cola-zero-2l",
              "name": "Coca-Cola Zero PET 2lt",
              "description": "2l",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sprite-2l",
              "name": "Sprite 2l",
              "description": "2l",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fanta-portocale-2l",
              "name": "Fanta Portocale 2l",
              "description": "2l",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fanta-struguri-2l",
              "name": "Fanta Struguri 2l",
              "description": "2l",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 16.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-coca-cola-500",
              "name": "Coca-Cola PET 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-coca-cola-zero-500",
              "name": "Coca-Cola Zero PET 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-sprite-500",
              "name": "Sprite PET 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fanta-portocale-500",
              "name": "Fanta Portocale PET 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fuzetee-lamaie-500",
              "name": "FuzeTea Lamaie 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fuzetee-piersici-500",
              "name": "Fuze Tea Piersici PET 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-fanta-struguri-500",
              "name": "Fanta Struguri PET 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-schweppes-mandarin-500",
              "name": "Schweppes Mandarin 500 ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11.5,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-schweppes-kinley-500",
              "name": "Schweppes Kinley 500 ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 11,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 11,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 11,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-apa-minerala-500",
              "name": "Apa Minerala 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 8,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 8,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 8,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      },
      {
              "id": "ph-apa-plata-500",
              "name": "Apa Plata 500ml",
              "description": "500ml",
              "category": "COLD DRINKS",
              "imageUrl": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
              "prices": [
                      {
                              "platform": "glovo",
                              "available": true,
                              "price": 8,
                              "deepLink": "https://glovoapp.com/ro/ro/constanta/stores/pizza-hut-ct"
                      },
                      {
                              "platform": "bolt",
                              "available": true,
                              "price": 8,
                              "deepLink": "https://food.bolt.eu/ro-ro/462-constanta/p/135512-kfc-city-park-constanta/pizzahut"
                      },
                      {
                              "platform": "wolt",
                              "available": true,
                              "price": 8,
                              "deepLink": "https://wolt.com/en/rou/constanta/restaurant/pizza-hut-constanta-67dc2390b93a5300e8efd498"
                      }
              ]
      }
    ]
  }
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
