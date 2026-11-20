import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getProduct } from "../data/products";
import type { CategoryId } from "../data/categories";
import { scrollToId } from "../lib/gsap";

export type CartLine = { id: string; qty: number };
export type SortKey = "featured" | "price-asc" | "price-desc" | "name";
export type DrawerTab = "bag" | "wishlist";

interface StoreValue {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;

  quickViewId: string | null;
  openQuickView: (id: string | null) => void;

  drawer: DrawerTab | null;
  openDrawer: (tab: DrawerTab) => void;
  closeDrawer: () => void;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  category: CategoryId | "all";
  setCategory: (c: CategoryId | "all") => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  goToCategory: (c: CategoryId | "all") => void;
  showInShop: (q: string) => void;

  policy: string | null;
  setPolicy: (p: string | null) => void;

  toast: { message: string; action?: DrawerTab; key: number } | null;
  notify: (message: string, action?: DrawerTab) => void;
}

const Ctx = createContext<StoreValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() =>
    load<CartLine[]>("karigar-cart", []).filter((l) => getProduct(l.id)),
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    load<string[]>("karigar-wish", []).filter((id) => getProduct(id)),
  );
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<DrawerTab | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [policy, setPolicy] = useState<string | null>(null);
  const [toast, setToast] = useState<StoreValue["toast"]>(null);
  const toastTimer = useRef<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem("karigar-cart", JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem("karigar-wish", JSON.stringify(wishlist));
    } catch {
      /* storage unavailable */
    }
  }, [wishlist]);

  const notify = useCallback((message: string, action?: DrawerTab) => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, action, key: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      setCart((prev) => {
        const found = prev.find((l) => l.id === id);
        if (found)
          return prev.map((l) =>
            l.id === id ? { ...l, qty: Math.min(10, l.qty + qty) } : l,
          );
        return [...prev, { id, qty }];
      });
      const p = getProduct(id);
      notify(`${p?.name ?? "Item"} added to your bag`, "bag");
    },
    [notify],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: Math.min(10, qty) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeFromCart = useCallback(
    (id: string) => setCart((prev) => prev.filter((l) => l.id !== id)),
    [],
  );

  const toggleWish = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        notify(
          has ? "Removed from wishlist" : "Saved to your wishlist",
          has ? undefined : "wishlist",
        );
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [notify],
  );

  const goToCategory = useCallback((c: CategoryId | "all") => {
    setCategory(c);
    setQuery("");
    window.setTimeout(() => scrollToId("shop"), 60);
  }, []);

  const showInShop = useCallback((q: string) => {
    setQuery(q);
    setCategory("all");
    setSearchOpen(false);
    window.setTimeout(() => scrollToId("shop"), 320);
  }, []);

  const value = useMemo<StoreValue>(() => {
    const cartCount = cart.reduce((n, l) => n + l.qty, 0);
    const cartTotal = cart.reduce(
      (sum, l) => sum + (getProduct(l.id)?.price ?? 0) * l.qty,
      0,
    );
    return {
      cart,
      wishlist,
      cartCount,
      cartTotal,
      addToCart,
      setQty,
      removeFromCart,
      toggleWish,
      isWished: (id) => wishlist.includes(id),
      quickViewId,
      openQuickView: setQuickViewId,
      drawer,
      openDrawer: setDrawer,
      closeDrawer: () => setDrawer(null),
      searchOpen,
      setSearchOpen,
      query,
      setQuery,
      category,
      setCategory,
      sort,
      setSort,
      goToCategory,
      showInShop,
      policy,
      setPolicy,
      toast,
      notify,
    };
  }, [
    cart,
    wishlist,
    addToCart,
    setQty,
    removeFromCart,
    toggleWish,
    quickViewId,
    drawer,
    searchOpen,
    query,
    category,
    sort,
    goToCategory,
    showInShop,
    policy,
    toast,
    notify,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
