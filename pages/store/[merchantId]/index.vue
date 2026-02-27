<template>
  <div class="store-page">
    <!-- Loading -->
    <div v-if="loading" class="store-loading">
      <div class="store-loading__pulse">
        <div class="store-loading__dot"></div>
        <div class="store-loading__dot"></div>
        <div class="store-loading__dot"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="store-error">
      <div class="store-error__card">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01"/></svg>
        <h2>Store Not Found</h2>
        <p>This store doesn't exist or is currently unavailable.</p>
      </div>
    </div>

    <!-- ============ STORE CONTENT ============ -->
    <template v-else-if="store">

      <!-- HERO -->
      <section class="store-hero">
        <div class="store-hero__bg">
          <div class="store-hero__pattern"></div>
          <div class="store-hero__glow-1"></div>
          <div class="store-hero__glow-2"></div>
        </div>
        <div class="store-hero__inner container">
          <div class="store-hero__avatar">
            <img v-if="store.image" :src="imgUrl(store.image)" :alt="store.name" />
            <span v-else class="store-hero__avatar-letter">{{ store.name?.charAt(0)?.toUpperCase() }}</span>
          </div>
          <div>
            <div class="store-hero__name-row">
              <h1>{{ store.name }}</h1>
              <span v-if="store.is_verified" class="store-hero__verified" title="Verified Store">
                <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </div>
            <p v-if="store.caption" class="store-hero__caption">{{ store.caption }}</p>
            <div class="store-hero__chips">
              <span v-if="store.location" class="store-hero__chip">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ store.location }}
              </span>
              <span v-if="store.rating > 0" class="store-hero__chip">
                <svg width="11" height="11" viewBox="0 0 18 18" fill="#F5C518"><path d="M9 1.5L11.3 6.2L16.5 6.9L12.75 10.5L13.6 15.7L9 13.3L4.4 15.7L5.25 10.5L1.5 6.9L6.7 6.2L9 1.5Z"/></svg>
                {{ store.rating.toFixed(1) }}
              </span>
              <span class="store-hero__chip">🛍️ {{ totalProducts }} products</span>
              <span v-if="store.total_sales" class="store-hero__chip">🔥 {{ store.total_sales }} sold</span>
            </div>
          </div>
        </div>
      </section>

      <div class="container">

        <!-- CATEGORIES -->
        <section v-if="categories.length > 1" class="categories">
          <h3 class="categories__title">Explore Categories</h3>
          <div class="categories__scroll">
            <button
              v-for="cat in categories" :key="cat"
              class="cat-pill" :class="{ 'cat-pill--active': activeCategory === cat }"
              @click="activeCategory = cat"
            >
              <div class="cat-pill__circle"><span>{{ getCategoryEmoji(cat) }}</span></div>
              <span class="cat-pill__label">{{ cat }}</span>
            </button>
          </div>
        </section>

        <!-- TOOLBAR -->
        <div class="toolbar">
          <div class="toolbar__left">
            <h2 class="toolbar__heading">{{ activeCategory === 'All' ? 'All Products' : activeCategory }}</h2>
            <span class="toolbar__count">{{ filteredProducts.length }}</span>
          </div>
          <div class="toolbar__right">
            <div class="toolbar__search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input v-model="searchQuery" type="text" placeholder="Search products..." />
              <button v-if="searchQuery" @click="searchQuery = ''" class="toolbar__clear">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <select v-model="sortBy" class="toolbar__select">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="popular">Most Sold</option>
            </select>
          </div>
        </div>

        <!-- PRODUCT GRID -->
        <div v-if="filteredProducts.length" class="products-grid">
          <NuxtLink
            v-for="product in filteredProducts" :key="product.id"
            :to="`/store/${merchantId}/product/${product.id}`"
            class="p-card"
          >
            <button class="p-card__fav" @click.prevent>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <span v-if="product.discount_percent > 0" class="p-card__tag">-{{ product.discount_percent }}%</span>

            <div class="p-card__visual">
              <img v-if="product.image" :src="imgUrl(product.image)" :alt="product.name" loading="lazy" />
              <div v-else class="p-card__visual-ph">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
              <div v-if="!product.in_stock" class="p-card__oos-overlay">Sold Out</div>
            </div>

            <div class="p-card__body">
              <div class="p-card__category">{{ product.category_name || 'Product' }}</div>
              <h3 class="p-card__name">{{ product.name }}</h3>

              <div v-if="product.rating > 0 || product.total_sold > 0" class="p-card__rating-row">
                <div class="p-card__stars">
                  <svg v-for="s in 5" :key="s" width="11" height="11" viewBox="0 0 18 18"
                    :fill="s <= Math.round(product.rating || 0) ? '#F5C518' : '#E0E0E0'">
                    <path d="M9 1.5L11.3 6.2L16.5 6.9L12.75 10.5L13.6 15.7L9 13.3L4.4 15.7L5.25 10.5L1.5 6.9L6.7 6.2L9 1.5Z"/>
                  </svg>
                </div>
                <span v-if="product.total_sold" class="p-card__review-count">({{ product.total_sold }})</span>
              </div>

              <div class="p-card__price-row">
                <span class="p-card__price">₦{{ formatPrice(product.price) }}</span>
                <span v-if="product.discount_percent > 0" class="p-card__old-price">₦{{ formatPrice(product.compare_price) }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- EMPTY STATE -->
        <div v-else class="products-empty">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <p v-if="searchQuery">No products match "<strong>{{ searchQuery }}</strong>"</p>
          <p v-else>No products in this category.</p>
          <button v-if="searchQuery || activeCategory !== 'All'" class="products-empty__reset" @click="searchQuery = ''; activeCategory = 'All'">
            Show All Products
          </button>
        </div>

        <!-- FOOTER -->
        <div class="store-footer">
          <span>Powered by</span>
          <span class="store-footer__brand">helparr<span>.sell</span></span>
        </div>

      </div>
    </template>

    <!-- FLOATING CART -->
    <StoreCartFloatingButton v-if="cartCount > 0" :merchant-id="merchantId" />
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const merchantId = route.params.merchantId;

const store = ref(null);
const products = ref([]);
const totalProducts = ref(0);
const loading = ref(true);
const error = ref(false);
const searchQuery = ref('');
const activeCategory = ref('All');
const sortBy = ref('newest');
const { cartCount } = useCart();

const imgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${config.public.apiBase}${path}`;
};

const formatPrice = (price) => Number(price).toLocaleString('en-NG', { minimumFractionDigits: 0 });

const categories = computed(() => {
  const cats = [...new Set(products.value.map((p) => p.category_name).filter(Boolean))];
  return ['All', ...cats];
});

const getCategoryEmoji = (cat) => {
  const map = { 'All': '🛍️', 'Electronics': '📱', 'Clothing': '👕', 'Food Items': '🍎', 'Beverages': '☕', 'Jewelry': '💎', 'Bags & Accessories': '👜', 'Home & Living': '🏠', 'Art & Collectibles': '🎨', 'Beauty Products': '💄', 'Handmade Items': '🧶', 'Books & Stationery': '📚', 'Sports & Fitness': '⚽', 'Other': '📦' };
  return map[cat] || '📦';
};

const filteredProducts = computed(() => {
  let result = [...products.value];
  if (activeCategory.value !== 'All') result = result.filter((p) => p.category_name === activeCategory.value);
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }
  switch (sortBy.value) {
    case 'price-low': result.sort((a, b) => a.price - b.price); break;
    case 'price-high': result.sort((a, b) => b.price - a.price); break;
    case 'popular': result.sort((a, b) => (b.total_sold || 0) - (a.total_sold || 0)); break;
    default: result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  return result;
});

const fetchStore = async () => {
  try {
    loading.value = true;
    const res = await $fetch(`${config.public.apiBase}/api/public/store/${merchantId}`);
    if (res.success) { store.value = res.data.store; products.value = res.data.products; totalProducts.value = res.data.total_products; }
    else { error.value = true; }
  } catch (e) { error.value = true; }
  finally { loading.value = false; }
};

useHead(() => ({ title: store.value ? `${store.value.name} — Helparr Sell` : 'Store — Helparr Sell' }));
onMounted(fetchStore);
</script>

<style scoped>
/* ============ LOADING ============ */
.store-loading { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
.store-loading__pulse { display: flex; gap: 8px; }
.store-loading__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--color-helparr-primary); animation: pdot 1.2s ease-in-out infinite; }
.store-loading__dot:nth-child(2) { animation-delay: 0.15s; }
.store-loading__dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes pdot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

/* ============ ERROR ============ */
.store-error { display: flex; align-items: center; justify-content: center; min-height: 70vh; }
.store-error__card { text-align: center; max-width: 340px; }
.store-error__card h2 { font-family: var(--font-heading); margin: 16px 0 8px; }
.store-error__card p { color: var(--color-text-muted); font-size: 0.9rem; }

/* ============ HERO ============ */
.store-hero { position: relative; padding: calc(var(--nav-height, 72px) + 36px) 0 30px; overflow: hidden; }
.store-hero__bg { position: absolute; inset: 0; background: linear-gradient(160deg, #edfaf2 0%, #f7fdf9 35%, var(--color-off-white) 70%, #fff9f0 100%); }
.store-hero__pattern { position: absolute; inset: 0; opacity: 0.35; background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0); background-size: 24px 24px; }
.store-hero__glow-1 { position: absolute; top: -60px; right: -40px; width: 280px; height: 280px; background: radial-gradient(circle, rgba(29,185,84,0.08) 0%, transparent 70%); border-radius: 50%; }
.store-hero__glow-2 { position: absolute; bottom: -40px; left: 10%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%); border-radius: 50%; }
.store-hero__inner { position: relative; z-index: 2; display: flex; align-items: center; gap: 20px; }
.store-hero__avatar { width: 68px; height: 68px; border-radius: 16px; overflow: hidden; flex-shrink: 0; border: 3px solid white; box-shadow: 0 4px 20px rgba(0,0,0,0.08); background: var(--color-helparr-primary); }
.store-hero__avatar img { width: 100%; height: 100%; object-fit: cover; }
.store-hero__avatar-letter { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white; }
.store-hero__name-row { display: flex; align-items: center; gap: 6px; }
.store-hero__name-row h1 { font-family: var(--font-heading); font-size: 1.45rem; line-height: 1.15; }
.store-hero__verified { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: var(--color-helparr-primary); }
.store-hero__verified svg { width: 12px; height: 12px; }
.store-hero__caption { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 3px; }
.store-hero__chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; }
.store-hero__chip { display: inline-flex; align-items: center; gap: 4px; font-size: 0.73rem; font-weight: 500; color: var(--color-text-muted); background: rgba(255,255,255,0.7); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid rgba(0,0,0,0.04); }
.store-hero__chip svg { flex-shrink: 0; }

/* ============ CATEGORIES ============ */
.categories { padding: 24px 0 0; }
.categories__title { font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 16px; }
.categories__scroll { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.categories__scroll::-webkit-scrollbar { display: none; }
.cat-pill { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0; min-width: 72px; transition: all 180ms var(--ease-out); }
.cat-pill__circle { width: 56px; height: 56px; border-radius: 50%; background: var(--color-off-white); border: 2px solid transparent; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; transition: all 180ms var(--ease-out); }
.cat-pill:hover .cat-pill__circle { background: var(--color-accent-mint); border-color: rgba(29,185,84,0.15); transform: translateY(-2px); }
.cat-pill--active .cat-pill__circle { background: var(--color-accent-mint); border-color: var(--color-helparr-primary); box-shadow: 0 3px 12px rgba(29,185,84,0.15); }
.cat-pill__label { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-text-muted); white-space: nowrap; }
.cat-pill--active .cat-pill__label { color: var(--color-text); }

/* ============ TOOLBAR ============ */
.toolbar { display: flex; align-items: center; justify-content: space-between; padding: 24px 0 16px; gap: 12px; flex-wrap: wrap; }
.toolbar__left { display: flex; align-items: baseline; gap: 8px; }
.toolbar__heading { font-family: var(--font-heading); font-size: 1.15rem; }
.toolbar__count { font-size: 0.72rem; font-weight: 600; color: var(--color-text-muted); background: var(--color-off-white); padding: 2px 10px; border-radius: var(--radius-full); }
.toolbar__right { display: flex; align-items: center; gap: 8px; }
.toolbar__search { display: flex; align-items: center; gap: 8px; background: white; border: 1.5px solid rgba(0,0,0,0.07); border-radius: var(--radius-full); padding: 0 14px; height: 38px; transition: all 200ms var(--ease-out); min-width: 200px; }
.toolbar__search:focus-within { border-color: var(--color-helparr-primary); box-shadow: 0 0 0 3px rgba(29,185,84,0.06); }
.toolbar__search svg { flex-shrink: 0; color: #bbb; }
.toolbar__search input { flex: 1; border: none; background: none; outline: none; font-family: var(--font-body); font-size: 0.82rem; color: var(--color-text); }
.toolbar__search input::placeholder { color: #bbb; }
.toolbar__clear { padding: 2px; color: #bbb; transition: color 150ms; }
.toolbar__clear:hover { color: var(--color-text); }
.toolbar__select { height: 38px; padding: 0 30px 0 12px; border: 1.5px solid rgba(0,0,0,0.07); border-radius: var(--radius-full); background: white; font-family: var(--font-body); font-size: 0.8rem; font-weight: 500; color: var(--color-text); appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color 200ms; }
.toolbar__select:focus { outline: none; border-color: var(--color-helparr-primary); }

/* ============ PRODUCT GRID ============ */
.products-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; padding-bottom: 40px; }

/* ============ PRODUCT CARD ============ */
.p-card { display: block; text-decoration: none; color: inherit; background: white; border-radius: 14px; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; position: relative; transition: all 220ms var(--ease-out); }
.p-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); border-color: rgba(0,0,0,0.02); }
.p-card__fav { position: absolute; top: 8px; right: 8px; z-index: 3; width: 30px; height: 30px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 6px rgba(0,0,0,0.08); opacity: 0; transition: all 150ms; }
.p-card:hover .p-card__fav { opacity: 1; }
.p-card__fav:hover { background: #fff0f0; }
.p-card__fav:hover svg { stroke: var(--color-accent-coral); }
.p-card__tag { position: absolute; top: 8px; left: 8px; z-index: 3; background: var(--color-accent-live); color: white; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.02em; padding: 3px 8px; border-radius: var(--radius-full); }

/* Image area — padded, product centered */
.p-card__visual { position: relative; aspect-ratio: 1; background: #f7f7f7; display: flex; align-items: center; justify-content: center; padding: 16px; overflow: hidden; }
.p-card__visual img { max-width: 82%; max-height: 82%; object-fit: contain; transition: transform 0.3s var(--ease-out); }
.p-card:hover .p-card__visual img { transform: scale(1.05); }
.p-card__visual-ph { display: flex; align-items: center; justify-content: center; }
.p-card__oos-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.65); backdrop-filter: blur(1px); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted); }

/* Card body */
.p-card__body { padding: 10px 12px 14px; }
.p-card__category { font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-text-muted); margin-bottom: 3px; }
.p-card__name { font-size: 0.78rem; font-weight: 500; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--color-text); margin-bottom: 5px; min-height: 2.1em; }
.p-card__rating-row { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.p-card__stars { display: flex; gap: 0; }
.p-card__review-count { font-size: 0.62rem; color: var(--color-text-muted); }
.p-card__price-row { display: flex; align-items: baseline; gap: 6px; }
.p-card__price { font-size: 0.88rem; font-weight: 700; color: var(--color-text); }
.p-card__old-price { font-size: 0.68rem; color: var(--color-text-muted); text-decoration: line-through; }

/* ============ EMPTY ============ */
.products-empty { text-align: center; padding: 60px 20px 80px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--color-text-muted); }
.products-empty p { font-size: 0.9rem; }
.products-empty__reset { font-size: 0.82rem; font-weight: 600; color: var(--color-helparr-primary); cursor: pointer; padding: 8px 20px; border-radius: var(--radius-full); border: 1.5px solid var(--color-helparr-primary); background: none; transition: all 150ms; margin-top: 4px; }
.products-empty__reset:hover { background: var(--color-accent-mint); }

/* ============ FOOTER ============ */
.store-footer { text-align: center; padding: 24px 0 36px; font-size: 0.76rem; color: var(--color-text-muted); display: flex; align-items: center; justify-content: center; gap: 6px; }
.store-footer__brand { font-weight: 700; color: var(--color-text); }
.store-footer__brand span { color: var(--color-helparr-primary); }

/* ============ RESPONSIVE ============ */
@media (max-width: 1200px) { .products-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 900px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .toolbar__right { width: 100%; }
  .toolbar__search { flex: 1; min-width: 0; }
}
@media (max-width: 640px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .store-hero__avatar { width: 52px; height: 52px; border-radius: 14px; }
  .store-hero__name-row h1 { font-size: 1.15rem; }
  .store-hero__inner { gap: 14px; }
  .cat-pill__circle { width: 48px; height: 48px; font-size: 1.1rem; }
  .cat-pill__label { font-size: 0.6rem; }
  .categories__scroll { gap: 14px; }
  .p-card__visual { padding: 12px; }
  .p-card__body { padding: 8px 10px 12px; }
  .p-card__name { font-size: 0.72rem; }
  .p-card__price { font-size: 0.82rem; }
  .toolbar__right { flex-direction: column; }
  .toolbar__search { width: 100%; }
  .toolbar__select { width: 100%; }
}
@media (max-width: 380px) {
  .products-grid { gap: 8px; }
  .p-card { border-radius: 10px; }
  .p-card__visual { padding: 10px; }
  .p-card__body { padding: 6px 8px 10px; }
}
</style>