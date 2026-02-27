<template>
  <div class="pd-page">
    <!-- Loading -->
    <div v-if="loading" class="pd-loading">
      <div class="pd-loading__dot"></div>
      <div class="pd-loading__dot"></div>
      <div class="pd-loading__dot"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="pd-error">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01"/></svg>
      <h2>Product Not Found</h2>
      <p>This product doesn't exist or is unavailable.</p>
      <NuxtLink :to="`/store/${merchantId}`" class="pd-error__back">← Back to Store</NuxtLink>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="pd container">
      <!-- Breadcrumb -->
      <nav class="pd__crumb">
        <NuxtLink :to="`/store/${merchantId}`" class="pd__crumb-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          {{ product.store?.name }}
        </NuxtLink>
        <span class="pd__crumb-sep">/</span>
        <span class="pd__crumb-current">{{ product.name }}</span>
      </nav>

      <div class="pd__layout">
        <!-- ====== IMAGE SECTION ====== -->
        <div class="pd__image-col">
          <div class="pd__image-box">
            <img v-if="product.image" :src="imgUrl(product.image)" :alt="product.name" class="pd__image" />
            <div v-else class="pd__image-ph">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            </div>
            <span v-if="product.discount_percent > 0" class="pd__image-tag">-{{ product.discount_percent }}%</span>
          </div>
        </div>

        <!-- ====== INFO SECTION ====== -->
        <div class="pd__info-col">
          <!-- Store link -->
          <NuxtLink :to="`/store/${merchantId}`" class="pd__store-chip">
            <img v-if="product.store?.image" :src="imgUrl(product.store.image)" class="pd__store-chip-img" />
            <div v-else class="pd__store-chip-ph">{{ product.store?.name?.charAt(0) }}</div>
            <span>{{ product.store?.name }}</span>
            <svg v-if="product.store?.is_verified" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#1DB954"/><path d="M9 12l2 2 4-4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>

          <!-- Name -->
          <h1 class="pd__name">{{ product.name }}</h1>

          <!-- Rating -->
          <div v-if="product.rating > 0 || product.total_sold > 0" class="pd__rating">
            <div class="pd__stars">
              <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 18 18"
                :fill="s <= Math.round(product.rating || 0) ? '#F5C518' : '#E0E0E0'">
                <path d="M9 1.5L11.3 6.2L16.5 6.9L12.75 10.5L13.6 15.7L9 13.3L4.4 15.7L5.25 10.5L1.5 6.9L6.7 6.2L9 1.5Z"/>
              </svg>
            </div>
            <span v-if="product.total_sold" class="pd__sold">{{ product.total_sold }} sold</span>
          </div>

          <!-- Price -->
          <div class="pd__pricing">
            <span class="pd__price">₦{{ formatPrice(product.price) }}</span>
            <span v-if="product.discount_percent > 0" class="pd__original">₦{{ formatPrice(product.compare_price) }}</span>
            <span v-if="product.discount_percent > 0" class="pd__discount-pill">{{ product.discount_percent }}% off</span>
          </div>

          <!-- Stock -->
          <div class="pd__stock" :class="product.in_stock ? 'pd__stock--ok' : 'pd__stock--out'">
            <svg v-if="product.in_stock" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span v-if="product.in_stock">In Stock · {{ product.quantity }} available</span>
            <span v-else>Out of Stock</span>
          </div>

          <!-- Quantity + Add to Cart -->
          <div v-if="product.in_stock" class="pd__actions">
            <div class="pd__qty">
              <button @click="qty > 1 && qty--" :disabled="qty <= 1" class="pd__qty-btn">−</button>
              <span class="pd__qty-val">{{ qty }}</span>
              <button @click="qty < product.quantity && qty++" :disabled="qty >= product.quantity" class="pd__qty-btn">+</button>
            </div>
            <button class="pd__add-btn" @click="handleAddToCart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              {{ isInCart(product.id) ? 'Update Cart' : 'Add to Cart' }}
            </button>
          </div>

          <!-- Description -->
          <div v-if="product.description" class="pd__desc">
            <h3>Description</h3>
            <div class="pd__desc-text" v-html="product.description?.replace(/\\n/g, '<br>')"></div>
          </div>

          <!-- Delivery info -->
          <div v-if="product.can_dispatch && product.delivery_price" class="pd__delivery">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>Delivery available · ₦{{ formatPrice(product.delivery_price) }}</span>
          </div>
        </div>
      </div>
    </div>

    <StoreCartFloatingButton v-if="cartCount > 0" :merchant-id="merchantId" />
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const merchantId = route.params.merchantId;
const productId = route.params.productId;

const product = ref(null);
const loading = ref(true);
const error = ref(false);
const qty = ref(1);

const { addToCart, isInCart, getItemQuantity, cartCount } = useCart();

const imgUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${config.public.apiBase}${path}`;
};

const formatPrice = (price) => Number(price).toLocaleString('en-NG', { minimumFractionDigits: 0 });

const fetchProduct = async () => {
  try {
    loading.value = true;
    const res = await $fetch(`${config.public.apiBase}/api/public/store/${merchantId}/product/${productId}`);
    if (res.success) {
      product.value = res.data;
      const cartQty = getItemQuantity(res.data.id);
      if (cartQty > 0) qty.value = cartQty;
    } else { error.value = true; }
  } catch (e) { error.value = true; }
  finally { loading.value = false; }
};

const handleAddToCart = () => addToCart(product.value, qty.value, merchantId);

useHead(() => ({ title: product.value ? `${product.value.name} — Helparr Sell` : 'Product — Helparr Sell' }));
onMounted(fetchProduct);
</script>

<style scoped>
/* ============ LOADING ============ */
.pd-loading { display: flex; align-items: center; justify-content: center; min-height: 70vh; gap: 8px; }
.pd-loading__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--color-helparr-primary); animation: pdot 1.2s ease-in-out infinite; }
.pd-loading__dot:nth-child(2) { animation-delay: 0.15s; }
.pd-loading__dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes pdot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

/* ============ ERROR ============ */
.pd-error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; gap: 8px; }
.pd-error h2 { font-family: var(--font-heading); }
.pd-error p { color: var(--color-text-muted); font-size: 0.9rem; }
.pd-error__back { margin-top: 16px; font-size: 0.85rem; font-weight: 600; color: var(--color-helparr-primary); }

/* ============ MAIN ============ */
.pd { padding-top: calc(var(--nav-height, 72px) + 20px); padding-bottom: 100px; }

/* Breadcrumb */
.pd__crumb { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 24px; }
.pd__crumb-link { display: flex; align-items: center; gap: 4px; color: var(--color-text-secondary); font-weight: 500; transition: color 150ms; }
.pd__crumb-link:hover { color: var(--color-helparr-primary); }
.pd__crumb-sep { opacity: 0.3; }
.pd__crumb-current { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }

/* Layout */
.pd__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }

/* ============ IMAGE ============ */
.pd__image-col { position: sticky; top: calc(var(--nav-height, 72px) + 24px); }
.pd__image-box {
  position: relative;
  border-radius: 20px; overflow: hidden;
  background: #f7f7f7;
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  padding: 32px;
}
.pd__image {
  max-width: 78%; max-height: 78%;
  object-fit: contain;
  transition: transform 0.4s var(--ease-out);
}
.pd__image-box:hover .pd__image { transform: scale(1.04); }
.pd__image-ph { display: flex; align-items: center; justify-content: center; }
.pd__image-tag {
  position: absolute; top: 16px; left: 16px;
  background: var(--color-accent-live); color: white;
  font-size: 0.7rem; font-weight: 700;
  padding: 4px 12px; border-radius: var(--radius-full);
}

/* ============ INFO ============ */
.pd__store-chip {
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 14px; font-size: 0.82rem; font-weight: 500;
  color: var(--color-text-secondary);
  padding: 6px 14px 6px 6px;
  background: var(--color-off-white);
  border-radius: var(--radius-full);
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 200ms;
}
.pd__store-chip:hover { border-color: rgba(0,0,0,0.08); background: white; }
.pd__store-chip-img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
.pd__store-chip-ph { width: 24px; height: 24px; border-radius: 50%; background: var(--color-helparr-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; }

.pd__name { font-family: var(--font-heading); font-size: clamp(1.4rem, 2.5vw, 1.85rem); line-height: 1.2; margin-bottom: 10px; }

/* Rating */
.pd__rating { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.pd__stars { display: flex; gap: 1px; }
.pd__sold { font-size: 0.78rem; color: var(--color-text-muted); font-weight: 500; }

/* Price */
.pd__pricing { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.pd__price { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }
.pd__original { font-size: 1rem; color: var(--color-text-muted); text-decoration: line-through; }
.pd__discount-pill { font-size: 0.7rem; font-weight: 700; color: var(--color-accent-live); background: #FFF0F0; padding: 3px 10px; border-radius: var(--radius-full); }

/* Stock */
.pd__stock { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 500; margin-bottom: 24px; }
.pd__stock--ok { color: #0d7a3e; }
.pd__stock--out { color: var(--color-accent-live); }

/* Actions */
.pd__actions { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.pd__qty {
  display: flex; align-items: center;
  border: 2px solid rgba(0,0,0,0.08); border-radius: 12px;
  overflow: hidden;
}
.pd__qty-btn {
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.15rem; font-weight: 600;
  transition: background 150ms; cursor: pointer;
}
.pd__qty-btn:hover:not(:disabled) { background: rgba(0,0,0,0.04); }
.pd__qty-btn:disabled { opacity: 0.25; cursor: default; }
.pd__qty-val { width: 36px; text-align: center; font-weight: 600; font-size: 0.95rem; }

.pd__add-btn {
  flex: 1; height: 46px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--color-black); color: white;
  border-radius: 12px; font-family: var(--font-body);
  font-size: 0.88rem; font-weight: 600;
  cursor: pointer;
  transition: all 200ms var(--ease-out);
}
.pd__add-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.pd__add-btn:active { transform: translateY(0); }

/* Description */
.pd__desc { border-top: 1px solid rgba(0,0,0,0.05); padding-top: 24px; margin-bottom: 16px; }
.pd__desc h3 { font-size: 0.92rem; font-weight: 600; margin-bottom: 10px; }
.pd__desc-text { font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.7; }

/* Delivery */
.pd__delivery {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.82rem; color: var(--color-text-muted); font-weight: 500;
  padding: 12px 16px; border-radius: 12px;
  background: var(--color-off-white);
  border: 1px solid rgba(0,0,0,0.03);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 768px) {
  .pd__layout { grid-template-columns: 1fr; gap: 24px; }
  .pd__image-col { position: static; }
  .pd__image-box { padding: 24px; border-radius: 16px; }
  .pd__image { max-width: 72%; max-height: 72%; }
  .pd__name { font-size: 1.3rem; }
  .pd__price { font-size: 1.4rem; }
  .pd__actions { flex-direction: column; }
  .pd__qty { align-self: flex-start; }
  .pd__add-btn { width: 100%; }
}
</style>