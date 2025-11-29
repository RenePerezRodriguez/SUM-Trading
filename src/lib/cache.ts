/**
 * Server-side cache with 15-day TTL
 * Stores search results and vehicle details
 * Also provides localStorage backup for 7 hours
 */

const CACHE_DURATION_MS = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
const LOCAL_CACHE_DURATION_MS = 7 * 60 * 60 * 1000; // 7 hours in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  metadata?: {
    query?: string;
    page?: number;
    count?: number;
  };
}

interface SearchCacheData {
  vehicles: any[];
  pagination: { hasMore: boolean };
}

interface CacheMetadata {
  timestamp: number;
  age: number; // milliseconds since creation
}

class ServerCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private timestamps: Map<string, number> = new Map();

  /**
   * Get item from cache if not expired
   */
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set item in cache with TTL
   */
  set<T = any>(key: string, data: T, ttl: number = CACHE_DURATION_MS): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Set cache timestamp for metadata tracking
   */
  setCacheTimestamp(key: string, timestamp: number): void {
    this.timestamps.set(key, timestamp);
  }

  /**
   * Get cache metadata (age and timestamp)
   */
  getCacheMetadata(key: string): CacheMetadata | null {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) {
      return null;
    }

    return {
      timestamp,
      age: Date.now() - timestamp,
    };
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    this.timestamps.delete(key);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  /**
   * Get cache stats for debugging
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Global instance
export const serverCache = new ServerCache();

/**
 * LocalStorage cache for 7 hours (backup for server cache)
 * Used when cache between browsers needs to sync
 */
export const getLocalSearchCache = (query: string, page: number = 1, count: number = 9): SearchCacheData | null => {
  if (typeof window === 'undefined') return null;
  
  const key = `copart_search:${query.toLowerCase()}:p${page}:c${count}`;
  const cached = localStorage.getItem(key);
  
  if (!cached) return null;
  
  try {
    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;
    
    // Check if expired (7 hours)
    if (age > LOCAL_CACHE_DURATION_MS) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch {
    return null;
  }
};

export const setLocalSearchCache = (query: string, page: number = 1, count: number = 9, data: SearchCacheData): void => {
  if (typeof window === 'undefined') return;
  
  const key = `copart_search:${query.toLowerCase()}:p${page}:c${count}`;
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    // Silently fail if localStorage is full
  }
};

/**
 * Generate cache key for search queries
 */
export const generateSearchCacheKey = (query: string, page: number = 1, count: number = 9): string => {
  return `search:${query.toLowerCase()}:p${page}:c${count}`;
};

/**
 * Generate cache key for vehicle details
 */
export const generateVehicleCacheKey = (lotNumber: string): string => {
  return `vehicle:${lotNumber}`;
};

/**
 * Invalidate all search caches for a query
 */
export const invalidateSearchCache = (query: string): void => {
  const keysToDelete: string[] = [];
  serverCache.getStats().keys.forEach((key) => {
    if (key.startsWith(`search:${query.toLowerCase()}:`)) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach((key) => serverCache.delete(key));
};

// ========================================
// CHATBOT CACHE
// ========================================

const CHATBOT_CACHE_DURATION = 60 * 60 * 1000; // 1 hora

/**
 * Get cached chatbot response
 */
export const getCachedChatResponse = (message: string): string | null => {
  const key = `chatbot:${message.toLowerCase().trim()}`;
  return serverCache.get<string>(key);
};

/**
 * Set cached chatbot response
 */
export const setCachedChatResponse = (message: string, response: string): void => {
  const key = `chatbot:${message.toLowerCase().trim()}`;
  serverCache.set(key, response, CHATBOT_CACHE_DURATION);
};

/**
 * Pre-cached common responses
 */
export const COMMON_CHAT_RESPONSES: Record<string, string> = {
  'hola': '¡Hola! 👋 Bienvenido a **SUM Trading**. ¿En qué puedo ayudarte hoy? Puedo darte información sobre:\n\n• 🚗 **Inventario** de 250,000+ vehículos\n• 💰 **Tarifas** de arrastre y envío\n• ⏱️ **Tiempos** de entrega (4-8 semanas)\n• 📋 **Proceso** completo de importación',
  
  'hello': '¡Hello! 👋 Welcome to **SUM Trading**. How can I help you today? I can provide information about:\n\n• 🚗 **Inventory** of 250,000+ vehicles\n• 💰 **Towing and shipping rates**\n• ⏱️ **Delivery times** (4-8 weeks)\n• 📋 **Complete import process**',
  
  'gracias': '¡De nada! 😊 Estoy aquí para ayudarte. Si necesitas más información, no dudes en preguntar o contáctanos en **info@sumtrading.us** o al **+1 (956) 747-6078**.',
  
  'thank you': 'You\'re welcome! 😊 I\'m here to help. If you need more information, feel free to ask or contact us at **info@sumtrading.us** or **+1 (956) 747-6078**.',
  
  'thanks': 'You\'re welcome! 😊 I\'m here to help. If you need more information, feel free to ask or contact us at **info@sumtrading.us** or **+1 (956) 747-6078**.',
  
  'adiós': '¡Hasta pronto! 👋 Gracias por contactar a **SUM Trading**. Recuerda que puedes escribirnos a **info@sumtrading.us** cuando quieras.',
  
  'bye': 'See you soon! 👋 Thank you for contacting **SUM Trading**. Remember you can email us at **info@sumtrading.us** anytime.',
  
  'goodbye': 'See you soon! 👋 Thank you for contacting **SUM Trading**. Remember you can email us at **info@sumtrading.us** anytime.',
};

