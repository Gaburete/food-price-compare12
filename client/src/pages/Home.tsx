// ============================================================
// FoodRadar — Pagina principală (Home)
// Design: Modern Minimal, Sora font, accent #E8400C (portocaliu-roșu)
// Layout: Hero asimetric stânga-dreapta, search bar proeminentă,
//         carduri de comparație cu animații staggered
// ============================================================

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ChevronDown,
  Star,
  Clock,
  ShoppingBag,
  ArrowRight,
  Trophy,
  Zap,
  TrendingDown,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  CITIES,
  RESTAURANTS,
  PLATFORM_INFO,
  getCheapestPlatform,
  getCheapestForProduct,
  searchRestaurantsInCollection,
  calculateTotalFees,
  type Restaurant,
  type MenuItem,
  type Platform,
  type PlatformData,
} from "@/lib/data";

// ─── Platform Logo Components ────────────────────────────────
function GlovoLogo() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
      <circle cx="20" cy="20" r="20" fill="#FFC244" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1a1a1a">G</text>
    </svg>
  );
}
function BoltLogo() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
      <circle cx="20" cy="20" r="20" fill="#34D186" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">B</text>
    </svg>
  );
}
function WoltLogo() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
      <circle cx="20" cy="20" r="20" fill="#009DE0" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">W</text>
    </svg>
  );
}

const PlatformLogos: Record<Platform, React.FC> = {
  glovo: GlovoLogo,
  bolt: BoltLogo,
  wolt: WoltLogo,
};

// ─── PlatformCard Component ───────────────────────────────────
interface PlatformCardProps {
  platform: Platform;
  data: PlatformData;
  productPrice?: number;  // prețul produsului specific (dacă există)
  isCheapest: boolean;
  index: number;
}

function PlatformCard({ platform, data, productPrice, isCheapest, index }: PlatformCardProps) {
  const info = PLATFORM_INFO[platform];
  const Logo = PlatformLogos[platform];
  
  const { totalFee, deliveryFee, serviceFee, smallOrderFee } = calculateTotalFees(data, productPrice ?? 0);
  const total = data.available ? (productPrice ?? 0) + totalFee : Infinity;

  const platformColors: Record<Platform, { ring: string; badge: string; btn: string; btnHover: string; glow: string }> = {
    glovo: {
      ring: "ring-amber-400",
      badge: "bg-amber-400 text-amber-900",
      btn: "bg-amber-400 hover:bg-amber-500 text-amber-900",
      btnHover: "hover:bg-amber-500",
      glow: "shadow-amber-200",
    },
    bolt: {
      ring: "ring-emerald-400",
      badge: "bg-emerald-500 text-white",
      btn: "bg-emerald-500 hover:bg-emerald-600 text-white",
      btnHover: "hover:bg-emerald-600",
      glow: "shadow-emerald-200",
    },
    wolt: {
      ring: "ring-sky-400",
      badge: "bg-sky-500 text-white",
      btn: "bg-sky-500 hover:bg-sky-600 text-white",
      btnHover: "hover:bg-sky-600",
      glow: "shadow-sky-200",
    },
  };

  const colors = platformColors[platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12, ease: "easeOut" }}
      className={`relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${isCheapest
          ? `border-emerald-400 ring-4 ${colors.ring} shadow-xl ${colors.glow}`
          : "border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-1"
        }
        ${!data.available ? "opacity-50" : ""}
      `}
    >
      {/* Best Price Badge */}
      {isCheapest && data.available && (
        <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-xs font-bold py-1.5 text-center tracking-wider flex items-center justify-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" />
          CEL MAI IEFTIN
        </div>
      )}

      <div className={`p-5 ${isCheapest && data.available ? "pt-9" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="font-bold text-gray-900 text-base">{info.name}</p>
              {data.available ? (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {data.deliveryTime} min
                </p>
              ) : (
                <p className="text-xs text-red-500 font-medium">Indisponibil</p>
              )}
            </div>
          </div>
          {data.available && (
            <div className="text-right">
              <p className="text-2xl font-extrabold text-gray-900">{total.toFixed(2)}</p>
              <p className="text-xs text-gray-400 font-medium">RON total</p>
            </div>
          )}
        </div>

        {data.available ? (
          <>
            {/* Price Breakdown */}
              <div className="space-y-2 mb-5 bg-gray-50 rounded-xl p-3">
              {productPrice !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Preț produs</span>
                  <span className="font-semibold text-gray-800">{productPrice.toFixed(2)} RON</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Taxă livrare</span>
                <span className="font-semibold text-gray-800">{data.deliveryFee.toFixed(2)} RON</span>
              </div>
              {serviceFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taxă servicii</span>
                  <span className="font-semibold text-gray-800">{serviceFee.toFixed(2)} RON</span>
                </div>
              )}
              {smallOrderFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                    ⚠️ Taxă comandă mică
                  </span>
                  <span className="font-semibold text-amber-700">{smallOrderFee.toFixed(2)} RON</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold">
                <span className="text-gray-700">Total estimat</span>
                <span className="text-gray-900">{total.toFixed(2)} RON</span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={data.deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${colors.btn}`}
            >
              <ShoppingBag className="w-4 h-4" />
              Comandă pe {info.name}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">Restaurantul nu este disponibil pe această platformă</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── RestaurantCard Component ─────────────────────────────────
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  index: number;
}

function RestaurantCard({ restaurant, onClick, index }: RestaurantCardProps) {
  const cheapest = getCheapestPlatform(restaurant.platforms);
  const availableCount = restaurant.platforms.filter((p) => p.available).length;
  const cheapestData = cheapest ? restaurant.platforms.find((p) => p.platform === cheapest) : null;
  const minTotal = cheapestData && cheapestData.available ? (cheapestData.deliveryFee + cheapestData.serviceFee) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">{restaurant.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{restaurant.category} · {restaurant.city}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-semibold text-gray-700">{restaurant.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {restaurant.platforms.map((p) => (
                p.available ? (
                  <div
                    key={p.platform}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ backgroundColor: PLATFORM_INFO[p.platform].color }}
                    title={PLATFORM_INFO[p.platform].name}
                  >
                    {PLATFORM_INFO[p.platform].name[0]}
                  </div>
                ) : null
              ))}
              <span className="text-xs text-gray-400 ml-1">{availableCount} platforme</span>
            </div>
            {minTotal && (
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600">livrare de la {minTotal.toFixed(2)} RON</span>
              </div>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
      </div>
    </motion.div>
  );
}

// ─── MenuSection Component ────────────────────────────────
interface MenuSectionProps {
  menu: MenuItem[];
  selectedMenuItem: MenuItem | null;
  onSelectItem: (item: MenuItem | null) => void;
}

function MenuSection({ menu, selectedMenuItem, onSelectItem }: MenuSectionProps) {
  const categories = Array.from(new Set(menu.map((i) => i.category)));
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const filteredItems = menu.filter((i) => i.category === activeCategory);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Alege produsul</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Categorii */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); onSelectItem(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border-2 transition-all duration-200 flex-shrink-0 ${
              activeCategory === cat
                ? "bg-gray-900 border-gray-900 text-white"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Produse din categoria activă */}
      <div className="flex flex-wrap gap-2">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
              selectedMenuItem?.id === item.id
                ? "bg-[#E8400C] border-[#E8400C] text-white shadow-md"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#E8400C] hover:text-[#E8400C]"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Preview produs selectat */}
      {selectedMenuItem && (
        <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
          <img src={selectedMenuItem.imageUrl} alt={selectedMenuItem.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">{selectedMenuItem.name}</p>
            <p className="text-xs text-gray-500">{selectedMenuItem.description}</p>
          </div>
          <button
            onClick={() => onSelectItem(null)}
            className="text-xs text-gray-400 hover:text-gray-600 font-medium flex-shrink-0"
          >
            × Deselect
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Home Component ──────────────────────────────────────
export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("București");
  const [cityOpen, setCityOpen] = useState(false);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRestaurants() {
      try {
        const response = await fetch("/api/restaurants");
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as {
          restaurants?: Restaurant[];
        };

        if (isMounted && Array.isArray(payload.restaurants)) {
          setRestaurants(payload.restaurants);
        }
      } catch (error) {
        console.warn("Falling back to bundled restaurant data.", error);
      }
    }

    void loadRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim() && city === "Toate orașele") return;
    setIsSearching(true);
    setSelectedRestaurant(null);
    setTimeout(() => {
      const found = searchRestaurantsInCollection(query, city, restaurants);
      setResults(found);
      setHasSearched(true);
      setIsSearching(false);
    }, 600);
  }, [query, city, restaurants]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Dacă avem un produs selectat, folosim getCheapestForProduct; altfel, comparare generală după taxe
  const cheapest = selectedRestaurant
    ? selectedMenuItem
      ? getCheapestForProduct(selectedMenuItem, selectedRestaurant)
      : getCheapestPlatform(selectedRestaurant.platforms)
    : null;

  const popularRestaurants = restaurants.filter((r) => r.city === city).slice(0, 4);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663566751364/mByXX3zcCkfKV5Cn4Pwgc3/food-pattern-bg-UJF4eQuLcfx2PcMaanTXc2.webp)`,
        backgroundSize: "400px 400px",
        backgroundColor: "#F5F5F0",
      }}
    >
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedRestaurant(null);
              setHasSearched(false);
              setResults([]);
              setQuery("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E8400C] flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="font-extrabold text-xl text-gray-900 tracking-tight">Food<span className="text-[#E8400C]">Radar</span></span>
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#cum-functioneaza" className="hover:text-[#E8400C] transition-colors">Cum funcționează</a>
            <a href="#despre" className="hover:text-[#E8400C] transition-colors">Despre</a>
          </nav>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text + Search */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-[#E8400C] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Economisește la fiecare comandă
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                  Găsește cel mai<br />
                  <span className="text-[#E8400C]">ieftin delivery</span><br />
                  din România
                </h1>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                  Compară prețurile de pe Glovo, Bolt Food și Wolt într-o singură căutare. Comandă mai inteligent.
                </p>
              </motion.div>

              {/* Search Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 space-y-3"
              >
                {/* City Selector */}
                <div className="relative">
                  <button
                    onClick={() => setCityOpen(!cityOpen)}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-[#E8400C] flex-shrink-0" />
                    <span className="flex-1 text-sm font-semibold text-gray-800">{city}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                      >
                        <div
                          className="overflow-y-auto"
                          style={{ maxHeight: "220px" }}
                        >
                          {["Toate oraşele", ...CITIES].map((c) => (
                            <button
                              key={c}
                              onClick={() => { setCity(c); setCityOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-[#E8400C] transition-colors font-medium flex items-center gap-2
                                ${city === c ? "bg-orange-50 text-[#E8400C]" : "text-gray-700"}`}
                            >
                              {city === c && <span className="w-1.5 h-1.5 rounded-full bg-[#E8400C] flex-shrink-0" />}
                              {city !== c && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                              {c}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Caută restaurant (ex: KFC, Pizza Hut...)"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8400C]/30 focus:border-[#E8400C] transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-[#E8400C] hover:bg-[#d03508] text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-orange-200"
                  >
                    {isSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      >
                        <Search className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Compară</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Platform Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mt-4"
              >
                <span className="text-xs text-gray-400 font-medium">Compară pe:</span>
                {(["glovo", "bolt", "wolt"] as Platform[]).map((p) => (
                  <div key={p} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: PLATFORM_INFO[p].color }} />
                    <span className="text-xs font-semibold text-gray-600">{PLATFORM_INFO[p].name}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl transform rotate-3 scale-105" />
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663566751364/mByXX3zcCkfKV5Cn4Pwgc3/hero-food-delivery-CdbejuHNKHxee5zTZXBzUV.webp"
                  alt="Food Delivery Comparison"
                  className="relative rounded-3xl shadow-2xl w-full object-cover h-80"
                />
                {/* Floating stats */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-gray-100"
                >
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Economii medii</p>
                    <p className="text-sm font-extrabold text-gray-900">8-15 RON / comandă</p>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-gray-100"
                >
                  <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-4.5 h-4.5 text-[#E8400C]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Platforme comparate</p>
                    <p className="text-sm font-extrabold text-gray-900">3 simultan</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {hasSearched && !selectedRestaurant && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {results.length > 0
                    ? `${results.length} rezultat${results.length !== 1 ? "e" : ""} pentru "${query || city}"`
                    : "Niciun rezultat găsit"}
                </h2>
                <button
                  onClick={() => { setHasSearched(false); setResults([]); setQuery(""); }}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Șterge căutarea
                </button>
              </div>

              {results.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-2">Niciun restaurant găsit</h3>
                  <p className="text-gray-400 text-sm">Încearcă un alt termen de căutare sau selectează un alt oraș.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((r, i) => (
                    <RestaurantCard
                      key={r.id}
                      restaurant={r}
                      onClick={() => setSelectedRestaurant(r)}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* Comparison View */}
          {selectedRestaurant && (
            <motion.section
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10"
            >
              {/* Back button + Restaurant Header */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E8400C] transition-colors mb-4 group"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Înapoi la rezultate
                </button>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                  <img
                    src={selectedRestaurant.imageUrl}
                    alt={selectedRestaurant.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-gray-900">{selectedRestaurant.name}</h2>
                    <p className="text-sm text-gray-500">{selectedRestaurant.category} · {selectedRestaurant.address}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-bold text-gray-700">{selectedRestaurant.rating}</span>
                        <span className="text-xs text-gray-400">({selectedRestaurant.reviewCount} recenzii)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meniu produse cu filtrare pe categorii */}
              {selectedRestaurant.menu && selectedRestaurant.menu.length > 0 && (
                <MenuSection
                  menu={selectedRestaurant.menu}
                  selectedMenuItem={selectedMenuItem}
                  onSelectItem={setSelectedMenuItem}
                />
              )}

              {/* Comparison Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {selectedMenuItem ? `Prețuri pentru ${selectedMenuItem.name}` : "Comparație taxe livrare"}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Platform Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                {selectedRestaurant.platforms.map((platformData, i) => {
                  // Dacă avem produs selectat, luăm prețul produsului de pe platforma respectivă
                  const productPriceData = selectedMenuItem
                    ? selectedMenuItem.prices.find((p) => p.platform === platformData.platform)
                    : undefined;
                  const effectiveAvailable = selectedMenuItem
                    ? (productPriceData?.available ?? false) && platformData.available
                    : platformData.available;
                  return (
                    <PlatformCard
                      key={platformData.platform}
                      platform={platformData.platform}
                      data={{ ...platformData, available: effectiveAvailable }}
                      productPrice={productPriceData?.price}
                      isCheapest={cheapest === platformData.platform && effectiveAvailable}
                      index={i}
                    />
                  );
                })}
              </div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-gray-400 text-center mt-4"
              >
                {selectedMenuItem
                  ? "* Prețul produsului este real. Taxa de livrare este estimativă — verifică prețul final pe platformă."
                  : "* Prețurile sunt estimative și pot varia. Verifică prețul final pe platforma selectată."}
              </motion.p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Popular Restaurants (shown when no search) */}
        {!hasSearched && !selectedRestaurant && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Populare în <span className="text-[#E8400C]">{city === "Toate orașele" ? "România" : city}</span>
              </h2>
              <span className="text-xs text-gray-400 font-medium">{popularRestaurants.length} restaurante</span>
            </div>
            <div className="space-y-3">
              {popularRestaurants.map((r, i) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onClick={() => {
                    setSelectedRestaurant(r);
                    setHasSearched(false);
                  }}
                  index={i}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* How It Works */}
        <motion.section
          id="cum-functioneaza"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
        >
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Cum funcționează?</h2>
          <p className="text-gray-400 text-center text-sm mb-8">3 pași simpli pentru a economisi la fiecare comandă</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, step: "1", title: "Caută restaurantul", desc: "Introdu numele restaurantului dorit și selectează orașul tău.", color: "bg-orange-100 text-[#E8400C]" },
              { icon: TrendingDown, step: "2", title: "Compară prețurile", desc: "Vezi instant prețul total pe Glovo, Bolt Food și Wolt, inclusiv taxele.", color: "bg-emerald-100 text-emerald-600" },
              { icon: ShoppingBag, step: "3", title: "Comandă mai ieftin", desc: "Apasă pe buton și ești redirecționat direct pe platforma câștigătoare.", color: "bg-sky-100 text-sky-600" },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div key={step} className="text-center">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-gray-400 mb-1">PAS {step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* About / Disclaimer */}
        <motion.section
          id="despre"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-orange-50 rounded-2xl border border-orange-100 p-6"
        >
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#E8400C]" />
            Despre FoodRadar
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            FoodRadar este un comparator independent de prețuri pentru aplicațiile de food delivery din România.
            Prețurile afișate sunt estimative și bazate pe date colectate manual — pot exista diferențe față de prețurile reale
            de pe platforme. Verifică întotdeauna prețul final înainte de a plasa comanda. FoodRadar nu este afiliat
            oficial cu Glovo, Bolt Food sau Wolt.
          </p>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#E8400C] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span className="font-extrabold text-gray-800">Food<span className="text-[#E8400C]">Radar</span></span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              © 2024 FoodRadar · Compară prețurile food delivery în România · Datele sunt estimative
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Termeni</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Confidențialitate</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
